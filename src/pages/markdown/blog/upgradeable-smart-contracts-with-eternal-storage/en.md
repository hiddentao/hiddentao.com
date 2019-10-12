---
title: Upgradeable smart contracts with eternal storage
date: '2019-10-03'
tags:
  - Solidity
  - Ethereum
---

For the [Nayms](http://nayms.io/) project we've opted to build upgradeable smart contracts so that we can do
permissioned upgrades of our smart contract logic whilst keeping our on-chain data
unchanged.

In attempting to figure out how to design for upgradeable contracts I looked
at the OpenZepellin project's approaches as well as other commentary on the idea:

* https://blog.trailofbits.com/2018/09/05/contract-upgrade-anti-patterns/
* https://blog.zeppelinos.org/proxy-patterns/
* https://docs.zeppelinos.org/docs/pattern.html
* https://medium.com/rocket-pool/upgradable-solidity-contract-design-54789205276d

Initially I thought about storing data separately in its own contract (like
  Rocket Pool does) but decided against this as this then introduces a new
problem to solve - that of controlling access to the data.

Thus, the proxy pattern (using [delegatecall](https://blog.nucypher.com/upgradeable-smart-contracts-in-defense-of-delegatecall/)) became the preferred option. In this pattern the _proxy_ contract forwards
all incoming calls to an _logic_ contract which actually has the
business logic. Because the forwarding is done using `delegatecall`, the _logic_ contract 
gets run in the context of the _proxy_ contract's memory space, meaning it
operates on the data in the _proxy_ contract rather than its own:

```solidity
pragma solidity >=0.5.8;

contract Proxy {
  /**
   * The logic contract address.
   */
  address public implementation;

  /**
  * @dev This event will be emitted every time the implementation gets upgraded
  * @param implementation representing the address of the upgraded implementation
  */
  event Upgraded(address indexed implementation, string version);

  /**
   * Constructor.
   */
  constructor (address _implementation) public {
    require(_implementation != address(0), 'implementation must be valid');
    implementation = _implementation;
  }

  /**
   * @dev Set new logic contract address.
   */
  function setImplementation(address _implementation) public {
    require(_implementation != address(0), 'implementation must be valid');
    require(_implementation != implementation, 'already this implementation');

    implementation = _implementation;

    emit Upgraded(_implementation, version);
  }

  /**
  * @dev Fallback function allowing to perform a delegatecall to the given implementation.
  * This function will return whatever the implementation call returns.
  * (Credits: OpenZepellin)
  */
  function () payable external {
    address _impl = getImplementation();
    require(_impl != address(0), 'implementation not set');

    assembly {
      let ptr := mload(0x40)
      calldatacopy(ptr, 0, calldatasize)
      let result := delegatecall(gas, _impl, ptr, calldatasize, 0, 0)
      let size := returndatasize
      returndatacopy(ptr, 0, size)
      switch result
      case 0 { revert(ptr, size) }
      default { return(ptr, size) }
    }
  }
}
```

_Note: I've deliberately omitted authorisation code to keep things simple!_.

When using a proxy pattern the approaches can be broken up into two types:

* "Shared" storage structure - both the _proxy_ and _logic_
contracts have the same storage data structures. This ensures that the _logic_
contract does not overwrite important _proxy_ member variables when storing data:

```solidity
pragma solidity >=0.5.8;

contract SharedStorage {
  address public implementation;
}

contract Proxy is SharedStorage {
  /* same as before */
}

contract LogicVersion1 is SharedStorage {
  // add member variables
  bool isAllowed;
  string personName;
}

contract LogicVersion2 is SharedStorage {
  /*
  Note that successive versions of the _logic_ contract must define all of their
  predecessor's member variables in the same order.
   */
  bool isAllowed;
  string personName;
  // add new member variables...
  uint256 total;
}
```

* "Unshared" storage structure - the _proxy_ contract reserves one or more specific
storage slots for storing upgradeability information using inline assembly code.
Thus the _logic_ contract does not need to share such storage data and can simply
define the useful member variables. However, successive _logic_ contracts are
still forced to define all of their predecessor's member variables in the same
order:

```solidity
pragma solidity >=0.5.8;

contract Proxy {
  bytes32 private constant IMPL_POS = keccak256("implementation.address");  

  function setImplementation(address _implementation) public {
    /* pre-condition checks (same as before) */

    bytes32 position = IMPL_POS;
    assembly {
      sstore(position, _implementation)
    }

    /* emit event (same as before) */
  }

}

contract LogicVersion1 {
  bool isAllowed;
  string personName;
}

contract LogicVersion2 {
  bool isAllowed;
  string personName;
  uint256 total;
}
```

After considering the options available, I felt that the "shared" storage
structure approach would work just fine; but instead of inflexible member
variables, an _eternal storage_ approach made more sense:

```solidity
pragma solidity >=0.5.8;

contract EternalStorage {
  // scalars
  mapping(string => address) dataAddress;
  mapping(string => string) dataString;
  mapping(string => bytes32) dataBytes32;
  mapping(string => int256) dataInt256;
  mapping(string => uint256) dataUint256;
  mapping(string => bool) dataBool;
  // arrays
  mapping(string => address[]) dataManyAddresses;
  mapping(string => bytes32[]) dataManyBytes32s;
  mapping(string => int256[]) dataManyInt256;
  mapping(string => uint256[]) dataManyUint256;
  mapping(string => bool[]) dataManyBool;
}

contract Proxy is EternalStorage {
  constructor (_implementation) {
    dataAddress["implementation"] = _implementation;
  }

  setImplementation(address _implementation) {
    /* pre-condition checks (same as before) */

    dataAddress["implementation"] = _implementation;

    /* emit event (same as before) */
  }
}

contract LogicVersion1 is EternalStorage {
  // we don't need to define anything here since mappings automatically
  // return default values for unset keys
}

contract LogicVersion2 is EternalStorage {
  // we don't need to define anything here since we didn't need to define
  // anything in LogicVersion1 :)
}
```

The beauty of this approach is that the _logic_ contracts do not need to
explicitly define any member variables since the mappings in the
`EternalStorage` base class in effect define all possible storage slots already.

This, I believe, is the most flexible storage structure though code
readability and ease-of-use is slightly sacrificed.

And this is how the [Nayms contracts](https://github.com/nayms/contracts) are
built. We added some code to ensure upgrades are only possible when authorised:

```solidity
pragma solidity >=0.5.8;

import "./ECDSA.sol";

interface IProxyImpl {
  function getImplementationVersion() pure external returns (string memory);
}

contract Proxy is EternalStorage {
   * @dev Point to a new implementation.
   * This is internal so that descendants can control access to this in custom ways.
   */
  function setImplementation(address _implementation) internal {
    require(_implementation != address(0), 'implementation must be valid');
    require(_implementation != dataAddress["implementation"], 'already this implementation');

    IProxyImpl impl = IProxyImpl(_implementation);
    string memory version = impl.getImplementationVersion();

    dataAddress["implementation"] = _implementation;

    emit Upgraded(_implementation, version);
  }

  /**
   * @dev Get the signer of the given signature which represents an authorization to upgrade
   * @return {address} address of signer
   */
  function getUpgradeSigner(address _implementation, bytes memory _signature) pure internal returns (address) {
    require(_implementation != address(0), 'implementation must be valid');

    // get implementation version
    IProxyImpl impl = IProxyImpl(_implementation);
    string memory version = impl.getImplementationVersion();
    // generate hash
    bytes32 h = ECDSA.toEthSignedMessageHash(keccak256(abi.encodePacked(version)));
    // get signer
    address signer = ECDSA.recover(h, _signature);
    // check is valid
    require(signer != address(0), 'valid signer not found');

    return signer;
  }
}
```

_Note: the `ECDSA` library that is referred to above is from [OpenZepellin](https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/master/contracts/cryptography/ECDSA.sol)_

The _logic_ contract (aka the _implementation_ contract) must simply implement
the `IProxyImpl` interface, which specifies a function to return the implementation
version. This method is used as a way for an implementation to provide meta
information about itself, as well as a way for us to ensure that the upgrade to
a specific implementation is authorised via digital signatures (the `getUpgradeSigner()` method
 above).

Every upgrade in our system requires two signatures, one from each primary user
of the _proxy_ contract. In our case we have two entities - _asset managers_ and
_client managers_ - who are the primary users.

Here is a simplified version of our actual upgradeable contract (i.e. which
  inherits from `Proxy`) which uses the two aforementioned signatures to enable
an upgrade:

```solidity
import "./Proxy.sol";

contract ConcreteProxy is Proxy {
  /**
   * @dev Constructor.
   * @param {address} _impl address of initial logic contract.
   * @param {address} _assetMgr address of "asset manager" upgrade authorizor.
   * @param {address} _clientMgr address of "client manager" upgrade authorizor.
   */
  constructor (
    address _impl,
    address _assetMgr,
    address _clientMgr
  ) Proxy(_impl) public {
    dataAddress["assetMgr"] = _assetMgr;
    dataAddress["clientMgr"] = _clientMgr;
  }

  /**
   * @dev Upgrade the logic/imlementation contrat
   * @param  {address} _implementation New implementation
   * @param  {bytes} _assetMgrSig Signature of asset manager
   * @param  {bytes} _clientMgr Signature of client manager
   */
  function upgrade (address _implementation, bytes memory _assetMgrSig, bytes memory _clientMgrSig) public {
    address assetMgr = getUpgradeSigner(_implementation, _assetMgrSig);
    address clientMgr = getUpgradeSigner(_implementation, _clientMgrSig);

    require(assetMgr == dataAddress["assetMgr"], 'must be approved by asset mgr');
    require(clientMgr = dataAddress["clientMgr"], 'must be approved by client mgr');

    setImplementation(_implementation);
  }
}
```

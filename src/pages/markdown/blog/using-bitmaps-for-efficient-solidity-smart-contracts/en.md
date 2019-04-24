---
title: Using bitmaps for efficient Solidity smart contracts
date: '2018-12-10'
summary: ''
tags:
  - Solidity
  - Ethereum
  - Smart Contracts
  - Bitmaps
---

Smart contracts on Ethereum cost gas to run, and since gas is paid for in Ether,
it's generally a good idea to minimize the gas cost of running one's contract.
In this sense, writing a smart contract is similar to writing a complex program
for a resource-constrained computer - be as efficient as possible,
both in terms of memory use and and CPU cycles.

One well known technique for optimizing storage and access in certain use cases
is _bitmaps_. In this context _bitmap_ refers to the raw 1 and 0 bits in memory,
which are then used to represent some program state. For example, let's say we
have 10 people signed up to attend a class and we want to record whether each
person showed up or not. If coding in [Solidity](https://solidity.readthedocs.io),
we could use an array of 8-bit values to store this:

```solidity
// people who showed up: 1, 3, 4, 8, 9
uint8[] memory a = new uint8[](1, 0, 1, 1, 0, 0, 0, 1, 1, 0);
```

Notice that each value takes up 8 bits of space in RAM, meaning in total we are
using up at least 80 bits of memory to represent each person. In 64-bit
systems (which most computers are these days) numbers are represented in
multiples of 64-bits since each memory position is 64-bits. Thus 80 bits will
actually require 128 bits to represent in memory.

Yet we actually only need to represent two values per attendance state - 0 or 1.
Thus, we could actually use a single bit to represent each value, by using a
`uint16`:

```solidity
// people who showed up: 1, 3, 4, 8, 9
uint16 a = 397; // equals 0110001101 in binary
```

Now everything combined take up only 16 bits of space in RAM, meaning 64 bits in
raw memory. This is a much more memory efficient scheme. The only thing we
need to be able to do is read individual bits within the integer. We
can use _bitwise_ operators to do this. Note that bits are counted from
[right to left]((https://www.techopedia.com/definition/8030/least-significant-bit-lsb)):

```solidity
uint16 a = 397; // equals 0110001101 in binary

// Read bits at positions 3 and 7.
// Note that bits are 0-indexed, thus bit 1 is at position 0, bit 2 is at position 1, etc.
uint8 bit3 = a & (1 << 2)
uint8 bit7 = a & (1 << 6)
```

Setting a specific bit works similary:

```solidity
uint16 a = 397; // equals 0110001101 in binary

// Set bit 5
a = a | (1 << 4)
```

**Battleship**

In my [Ethereum-based implementation of Battleship](https://github.com/eth-battleship/eth-battleship.github.io),
I use bitmaps to both store each player's game board as well as their list of
moves against their opponent's board.

Using bitmaps makes checks and calculations very efficient. For instance, when a
user initial signs onto a game we need to check that they've placed their ships
on their board correctly. Ships may not overlap with each other and they must
all be fully contained within the game board boundaries:

```solidity
/**
 * Calculate the bitwise position of given XY coordinate.
 * @param boardSize_ board size
 * @param x_ X coordinate
 * @param y_ Y coordinate
 * @return position in integer
 */
function calculatePosition(uint boardSize_, uint x_, uint y_) public pure returns (uint) {
    return 2 ** (x_ * boardSize_ + y_);  // could also write as 1 << (x_ * boardSize_ + y)
}


/**
 * Calculate board hash.
 *
 * This will check that the board is valid before calculating the hash
 *
 * @param ships_ Array representing ship sizes, each ship is a single number representing its size
 * @param boardSize_ Size of board's sides (board is a square)
 * @param board_ Array representing the board, each ship is represented as [x, y, isVertical]
 * @return the SHA3 hash
 */
function calculateBoardHash(bytes ships_, uint boardSize_, bytes board_) public pure returns (bytes32) {
  // used to keep track of existing ship positions
  uint marked = 0;

  // check that board setup is valid
  for (uint s = 0; ships_.length > s; s += 1) {
    // extract ship info
    uint index = 3 * s;
    uint x = uint(board_[index]);
    uint y = uint(board_[index + 1]);
    bool isVertical = (0 < uint(board_[index + 2]));
    uint shipSize = uint(ships_[s]);
    // check ship is contained within board boundaries
    require(0 <= x && boardSize_ > x);
    require(0 <= y && boardSize_ > y);
    require(boardSize_ >= ((isVertical ? x : y) + shipSize));
    // check that ship does not overlap with other ships on the board
    uint endX = x + (isVertical ? shipSize : 1);
    uint endY = y + (isVertical ? 1 : shipSize);
    while (endX > x && endY > y) {
      uint pos = calculatePosition(boardSize_, x, y);
      // ensure no ship already sits on this position
      require((pos & marked) == 0);
      // update position bit
      marked = marked | pos;

      x += (isVertical ? 1 : 0);
      y += (isVertical ? 0 : 1);
    }
  }

  return keccak256(board_);
}
```

When it comes to calculate the winner of a game, bitmaps are again used to
check how many times a player has managed to hit their opponent's ships:

```solidity
/**
 * Calculate no. of hits for a player.
 *
 * @param  revealer_ The player whose board it is
 * @param  mover_ The opponent player whose hits to calculate
 */
function calculateHits(Player storage revealer_, Player storage mover_) internal {
  // now let's count the hits for the mover and check board validity in one go
  mover_.hits = 0;

  for (uint ship = 0; ships.length > ship; ship += 1) {
      // extract ship info
      uint index = 3 * ship;
      uint x = uint(revealer_.board[index]);
      uint y = uint(revealer_.board[index + 1]);
      bool isVertical = (0 < uint(revealer_.board[index + 2]));
      uint shipSize = uint(ships[ship]);

      // now let's see if there are hits
      while (0 < shipSize) {
          // did mover_ hit this position?
            if (0 != (calculatePosition(boardSize, x, y) & mover_.moves)) {
              mover_.hits += 1;
          }
          // move to next part of ship
          if (isVertical) {
              x += 1;
          } else {
              y += 1;
          }
          // decrement counter
          shipSize -= 1;
      }
  }
}
```

All of a player's moves (`mover_.moves` above) are stored in a single `uint256`
value, for sake of efficiency. Each bit within this value signifies whether
the player hit the given position or now. Since our positions are 2-dimensional
(x, y) this means our maximum board size is 16, i.e. a 16x16 board. If we
wished to represent larger boards then we would have to use multiple `uint256` \
values to represent each player's moves.

**Kickback**

Kickback is an [event attendee management platform](https://github.com/wearekickback/contracts)
I'm currently working on. In Kickback we want to tell the smart contract who
showed up to an event and who didn't. This is an effect a real world
implementation of the example I presented earlier in this post.

We use a bitmap to represent participant attendance status (0 = not attended, 1 =
  attended) but this time we need to use multiple bitmaps since we don't with to
 limit the event capacity or the number of people who can show up. Technically
 speaking, we use a list of `uint256` numbers to represent attendance status,
where each number in the list represents the attendance status of 256 people:

```solidity
/**
 * @dev Mark participants as attended and enable payouts. The attendance cannot be undone.
 * @param _maps The attendance status of participants represented by uint256 values.
 */
function finalize(uint256[] _maps) external onlyAdmin onlyActive {
    uint256 totalBits = _maps.length * 256;
    require(totalBits >= registered && totalBits - registered < 256, 'incorrect no. of bitmaps provided');
    attendanceMaps = _maps;
    uint256 _totalAttended = 0;
    // calculate total attended
    for (uint256 i = 0; i < attendanceMaps.length; i++) {
        uint256 map = attendanceMaps[i];
        // brian kerninghan bit-counting method - O(log(n))
        while (map != 0) {
            map &= (map - 1);
            _totalAttended++;
        }
    }
    // since maps can contain more bits than there are registrants, we cap the value!
    totalAttended = _totalAttended < registered ? _totalAttended : registered;
}
```

Note that we first check to see that the current no. of `uint256` numbers have
been provided. We then save the "attendance bitmaps" for use later on, and use the
[Brian Kerninghan method](https://stackoverflow.com/questions/12380478/bits-counting-algorithm-brian-kernighan-in-an-integer-time-complexity) for counting the no. of set bits. This algorithm goes through
as many iterations as there are set bits, meaning that if only 2 people
attended then only 2 iterations of the loop would be needed to get the final count.

Finally, we add a safety check at the end to ensure that the "total attended"
count doesn't exceed the total no. of people who registered to attend, though
technically speaking this should never be the case if we've set the bits properly
in the input attendance bitmaps.

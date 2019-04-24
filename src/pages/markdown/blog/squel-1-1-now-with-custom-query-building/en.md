---
title: Squel 1.1 - now with custom query building
date: '2013-03-28'
summary: "Squel 1.1 is now available. This release was a major rewrite of how Squel works underneath the hood and has been a long time coming. There are two main benefits introduced by this new release:\r\n\r\n* The ability to customize the query building logic\r\n* The ability to build new types of queries\r\n\r\nThe [documentation has been updated](http:&#47;&#47;hiddentao.github.com&#47;squel&#47;#custom) with info and demos of the above. I'll talk a bit about the architectural changes in this post.\r\n"
tags:
  - Javascript
  - node.js
  - SQL
  - Squel
---
Squel 1.1 is now available. This release was a major rewrite of how Squel works underneath the hood and has been a long time coming. There are two main benefits introduced by this new release:

* The ability to customize the query building logic
* The ability to build new types of queries

The [documentation has been updated](http://hiddentao.github.com/squel/#custom) with info and demos of the above. I'll talk a bit about the architectural changes in this post.

## Building blocks

Squel query builders now consist of one or more building blocks, where each block is responsible for building a different part of the query. Each block provides methods which the query builder then exposes through its interface. For instance, the `OffsetBlock` provides the `offset()` method:

```coffee
class cls.OffsetBlock extends cls.Block
  constructor: (options) ->
    super options
    @offsets = null
  # Set the OFFSET transformation.
  #
  # Call this will override the previously set offset for this query. Also note that Passing 0 for 'max' will remove
  # the offset.
  offset: (start) ->
    start = @_sanitizeLimitOffset(start)
    @offsets = start
  buildStr: (queryBuilder) ->
    if @offsets then "OFFSET #{@offsets}" else ""
```

The query builder base class - `QueryBuilder` - constructor will create a `offset()` method on the query builder instance which acts as proxy to the `OffsetBlock.offset()` method:

```coffee
class cls.QueryBuilder extends cls.BaseBuilder
  # Constructor
  #
  # blocks - array of cls.BaseBuilderBlock instances to build the query with.
  constructor: (options, blocks) ->
    super options
    @blocks = blocks or []
    # Copy exposed methods into myself
    for block in @blocks
      for methodName, methodBody of block.exposedMethods()
        if @[methodName]?
          throw new Error "#{@_getObjectClassName(@)} already has a builder method called: #{methodName}"
        ( (block, name, body) =>
          @[name] = =>
            body.apply(block, arguments)
            @
        )(block, methodName, methodBody)
```

All blocks inherit from the `Block` base class which provides the `exposedMethods()` method used above. This method will expose all block methods which aren't prefixed with `_`. Blocks can and do get re-used between different query builders. The current list of blocks is as follows:

* StringBlock
* FromTableBlock
* UpdateTableBlock
* IntoTableBlock
* GetFieldBlock
* SetFieldBlock
* InsertFieldValueBlock
* JoinBlock
* WhereBlock
* OrderByBlock
* GroupByBlock
* OffsetBlock
* LimitBlock

To build the query we simply call `buildStr()` on each block and then concatenate the resulting strings. `QueryBuilder.toString()` has the logic:

```coffee
class cls.QueryBuilder extends cls.BaseBuilder
  ...
  toString: ->
    (block.buildStr(@) for block in @blocks).filter( (v) -> return (0 < v.length)).join(' ')
```

## Customising queries

If we take a look at the `SELECT` query builder code we can see how easy it is to now customise it:

```coffee
class cls.Select extends cls.QueryBuilder
    constructor: (options, blocks = null) ->
      blocks or= [
        new cls.StringBlock(options, 'SELECT'),
        new cls.DistinctBlock(options),
        new cls.GetFieldBlock(options),
        new cls.FromTableBlock(options),
        new cls.JoinBlock(options),
        new cls.WhereBlock(options),
        new cls.GroupByBlock(options),
        new cls.OrderByBlock(options),
        new cls.LimitBlock(options),
        new cls.OffsetBlock(options)
      ]
      super options, blocks
```

By passing in our own `blocks` list to the constructor we can change the query content entirely. For instance, if we wanted to customise the `UPDATE` queries such that it supports the `OFFSET` keyword:

```coffee
squel.update = (options) ->
  new squel.cls.Update options, [
    new squel.cls.StringBlock(options, 'UPDATE')
    new squel.cls.UpdateTableBlock(options)
    new squel.cls.SetFieldBlock(options)
    new squel.cls.WhereBlock(options)
    new squel.cls.OrderByBlock(options)
    new squel.cls.OffsetBlock(options)
    new squel.cls.LimitBlock(options)
  ]
```

After running the above, calling `squel.update()` will return our customised version of the query builder. But we can do more. We can go ahead and build an entirely new type of query if we so wish to, by subclassing `QueryBuilder` and then passing in `Block` instances (either built-in blocks or our own creations). See a [live example](http://hiddentao.github.com/squel/#custom) of this in the docs.

As usual squel is available from [npm](https://npmjs.org/package/squel) and [github](https://github.com/hiddentao/squel).

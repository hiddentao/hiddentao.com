---
title: Instructing Cakefile to exit with error if a vows test fails
date: '2011-12-21'
summary: "I'm using the [vows](http:&#47;&#47;vowsjs.org&#47;) \"behaviour-driven development\" framework to test the [squel](https:&#47;&#47;github.com&#47;hiddentao&#47;squel) Javascript library. I have a Cakefile which acts as my build script and inside it there is function which runs all of my tests. I decided to hook it up to the excellent [Travis CI](http:&#47;&#47;travis-ci.org&#47;) automated build system to ensure continuous testing on commits. One of the problems I had was that `cake` script exited normally even when one of the vows tests broke.\r\n"
tags:
  - Javascript
  - CoffeeScript
  - node.js
  - Build
---
I'm using the [vows](http://vowsjs.org/) "behaviour-driven development" framework to test the [squel](https://github.com/hiddentao/squel) Javascript library. I have a Cakefile which acts as my build script and inside it there is function which runs all of my tests. I decided to hook it up to the excellent [Travis CI](http://travis-ci.org/) automated build system to ensure continuous testing on commits. One of the problems I had was that `cake` script exited normally even when one of the vows tests broke.

I came up with this little snippet to ensure that `cake` exited abnormally (with error code 1) if any of the tests failed:

```coffee
run_tests = (callback) ->
    options = [
        'test/expression.coffee'
        'test/select.coffee'
        'test/update.coffee'
        'test/delete.coffee'
        'test/insert.coffee'
        '--spec'
    ]
    vows = spawn "#{binpath}/vows", options
    output = ""
    data_handler = (data) ->
        output =+ data if data
        stream_data_handler data
    vows.stdout.on 'data', data_handler
    vows.stderr.on 'data', data_handler
    vows.on 'exit', (status) ->
        if 0 isnt status or (output and -1 isnt output.indexOf("✗ Broken"))
            return process.exit(1)
        callback?()
```

Essentially it looks for the `— Broken` string in the vows output - this string only gets output if one or more vows were 'broken'. Now Travis also picks up on test failures. There might be a more elegant way to do the above - if you know give me a shout. Otherwise I hope somebody else finds this useful.

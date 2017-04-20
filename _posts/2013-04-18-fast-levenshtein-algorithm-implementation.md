---
layout: post
published: true
title: Fast Levenshtein algorithm implementation
date: '2013-04-18 17:29:57 +0800'
categories:
- Uncategorized
tags:
- Javascript
- node.js
- Levenshtein
comments: []
---
For my current project I needed an efficient implementation of the Levenshtein algorithm in Javascript. I had a look at the existing modules and didn't find one which implemented it efficiently as well as provide an asynchronous implementation so I decided to write my own.

It's published as an **npm** module called [fast-levenshtein](https://npmjs.org/package/fast-levenshtein) and works in both node.js and in the browser. Usage examples and other documentation is available on [the github page](https://github.com/hiddentao/fast-levenshtein).

My implementation is based on the [optimized iterative version](http://en.wikipedia.org/wiki/Levenshtein_distance#Computing_Levenshtein_distance) which does away with the need to calculate and store the entire matrix, instead just storing the last two calculated rows. My improvement on the original code is to do away with the need to copy the **current** row into the **previous** row within a separate loop at the end of each iteration.

I've included what I think is a more comprehensive set of test cases than other modules provide thus ensuring the correctness of the implementation as well as making it easier to make changes in future. And I've already come across further potential optimizations that can be made and have [created issues](https://github.com/hiddentao/fast-levenshtein/issues) for these.
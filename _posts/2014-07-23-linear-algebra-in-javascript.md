---
layout: post
published: true
title: Linear Algebra in Javascript
date: '2014-07-23 10:34:48 +0800'
categories:
- Uncategorized
tags:
- Javascript
- Performance
- Maths
comments: []
---
I recently released an efficient [linear algebra library](https://github.com/hiddentao/linear-algebra) for Javascript. I'm undertaking the Machine Learning course at Coursera and am building a [machine-learning library](https://github.com/hiddentao/machine-learning) as a way of better understanding the various algorithms better and the challenges involved when it comes time to implement them (in Javascript, at least!). I also hope to inject machine learning into my future projects using this codebase.

Back to the linear algebra library. I had a look at similar libraries such as [sylvester](https://github.com/jcoglan/sylvester) and [linalg](https://github.com/ben-ng/linalg) and decided that I could build something that was a bit more user-friendly whilst at the same time high-performant.

For maximum performance when performing such calculations there are just a few principles to keep in mind:

* Arrays are the simplest and therefore fastest available built-in mechanism for storing lists of numbers.  
* Overwriting an existing array with values is faster than constructing a new one with all the new values - and it uses less memory (and there's less work for the garbage collector).  
* Changing the size of an array is also expensive compared to leaving it as it is, due to needed memory cleanups, re-allocations, etc.

At the same time I wanted an API which is consistent and easy to understand. I'm using [Octave](https://www.gnu.org/software/octave/) to do the practical exercises in the course and I love it's easy-to-use API for manipulating matrices and vectors. I wanted my library to get as close to that as possible without unnecessarily sacrificing performance.

In order to satisfy these constraints I decided to expose two versions of every method - one version which returned a new array as the result of the operation, and one version which modified the original array. The developer can then decide which one to use based on their needs. For example:

```js  
var m = new Matrix([ [1, 2, 3], [4, 5, 6] ]); // 2 rows, 3 columns

// default  
var m2 = m.mulEach(5); // multiply every element by 5 and return a new Matrix object  
m2 === m1; // false

// in-place  
var m2 = m.mulEach_(5); // notice the _ suffix  
m2 === m1; // true  
```

In the first version - `mulEach` - two new objects get allocated, an `Array` and a `Matrix` which refers to it. In the second version - `mulEach_` - no new objects get allocated. All the other algebraic and mathematical methods exposed by the`Matrix` class have two versions which perform in a similar way to this.

Also notice that the method calls are chainable:

```js  
var m = new Matrix([ [1, 2, 3], [4, 5, 6] ]); /// 2 rows, 3 columns

// M*M'+(0.5*M)  
var m2 = m.dot(m.trans()).plus(m.mulEach(0.5));  
```

Unlike in other libraries, vectors are not treated as separate objects. A vector in this library is simply a single-row matrix:

```js  
m = Vector.zero(5);

console.log( m instanceof Matrix ); // true  
console.log( m.data ); // [ [0, 0, 0, 0, 0] ]  
```

If the size of a matrix is reduced as part of an in-place operation the internally array is still left at the same size to prevent any memory re-allocations or unnecessary garbage collections:

```js  
var m = new Matrix([ [1, 2, 3], [4, 5, 6] ]); // 2 rows, 3 columns  
var m2 = new Matrix([ [7], [8], [9] ]); // 3 rows, 1 column

m.dot_(m2);

console.log( m.data ); // [ [43, 2, 3], [112, 5, 6] ]  
console.log( m.rows ); // 2  
console.log( m.cols ); // 1  
```

The library comes packaged in 2 versions - normal and high-precision. The high-precision version enables the use of custom floating point adders such as the [add](https://github.com/ben-ng/add) module. This enables you to get more accurate calculation results, but performance will take a hit:

```bash  
[14:32:19] Running suite Normal vs High precision [/Users/home/dev/js/linear-algebra/benchmark/nvh-matrix-mul.perf.js]...  
[14:32:24] Normal precision (5x5 matrix dot-product) x 418,761 ops/sec Â±2.49% (94 runs sampled)  
[14:32:30] High precision (5x5 matrix dot-product) x 156,012 ops/sec Â±3.14% (89 runs sampled)  
[14:32:35] Normal precision (30x30 matrix dot-product) x 2,217 ops/sec Â±2.86% (95 runs sampled)  
[14:32:40] High precision (30x30 matrix dot-product) x 851 ops/sec Â±1.21% (95 runs sampled)  
```

Performance vs. other modules (Macbook Air 2012, 2 GHz Core i7, 8GB RAM 1600MHz DDR3):

```bash  
[17:23:14] Running suite vs. other modules [/Users/home/dev/js/linear-algebra/benchmark/vs-other-modules.perf.js]...  
[17:23:20] Matrix dot-product (100x100) - linear-algebra x 288 ops/sec Â±1.21% (88 runs sampled)  
[17:23:25] Matrix dot-product (100x100) - sylvester x 56.77 ops/sec Â±4.51% (61 runs sampled)  
[17:23:25] Fastest test is Matrix dot-product (100x100) - linear-algebra at 5.1x faster than Matrix dot-product (100x100) - sylvester  
```

Over time I hope to improve the performance even further, with [SIMD](https://software.intel.com/sites/billboard/article/simd-javascript-faster-html5-apps) and other improvements.

Github: [https://github.com/hiddentao/linear-algebra](https://github.com/hiddentao/linear-algebra)

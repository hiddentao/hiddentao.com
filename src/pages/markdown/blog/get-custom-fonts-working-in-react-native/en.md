---
title: Get custom fonts working in React Native
date: '2017-03-10'
summary: ''
tags:
  - React Native
  - React
  - Fonts
---

This post outlines how to get custom fonts working reliably in React Native
(tested in 0.40).

Most crucially, our font files have to be named correctly. I recommend using
the following format for file names:

* `OpenSans.ttf` - _Regular weight_
* `OpenSans-Italic.ttf` - _Regular weight, Italic style_
* `OpenSans-Light.ttf` - _Light weight_
* `OpenSans-LightItalic.ttf` - _Light weight, Italic style_
* `OpenSans-SemiBold.ttf` - _Semi-bold weight_
* `OpenSans-SemiBoldItalic.ttf` - _Semi-bold weight, Italic style_
* `OpenSans-Bold.ttf` - _Bold weight_
* `OpenSans-BoldItalic.ttf` - _Bold weight, Italic style_
* `OpenSans-ExtraBold.ttf` - _Extra Bold weight_
* `OpenSans-ExtraBoldItalic.ttf` - _Extra Bold weight, Italic style_

## Add to platforms

Place the font files in a folder, e.g:

```
my-react-native-project/
  package.json
  ios/
  android/
  app/
    fonts/
      OpenSans...
      ...
```

Then add the following to `package.json`:

```js
"rnpm": {
  "assets": [
    "app/fonts"
  ]
}  
```

Then run:

```shell
$ react-native link
```

Now rebuild for iOS and Android and the font files will be included correctly.

## Use in your styles

If we wish to use the `OpenSans-SemiBoldItalic` font for a given
element this is how we would specify it in our styles:

```js
// iOS
{
  fontFamily: 'OpenSans',
  fontWeight: '600',
  fontStyle: 'italic'
}

// Android
{
  fontFamily: 'OpenSans-SemiBoldItalic'
}
```

Thus, for iOS we need to map filenames to three styles. You may need to
experiment to find the right mapping values for your custom font, but for
Open Sans these are the values:

* `OpenSans` - `{ fontWeight: 400, fontStyle: 'normal' }`
* `OpenSans-Italic` - `{ fontWeight: 400, fontStyle: 'italic' }`
* `OpenSans-Light` - `{ fontWeight: 300, fontStyle: 'normal' }`
* `OpenSans-LightItalic` - `{ fontWeight: 300, fontStyle: 'italic' }`
* `OpenSans-SemiBold` - `{ fontWeight: 600, fontStyle: 'normal' }`
* `OpenSans-SemiBoldItalic` - `{ fontWeight: 500, fontStyle: 'italic' }`
* `OpenSans-Bold` - `{ fontWeight: 700, fontStyle: 'normal' }`
* `OpenSans-BoldItalic` - `{ fontWeight: 700, fontStyle: 'italic' }`
* `OpenSans-ExtraBold` - `{ fontWeight: 800, fontStyle: 'normal' }`
* `OpenSans-ExtraBoldItalic` - `{ fontWeight: 800, fontStyle: 'italic' }`

We can embed this information into our code and provide a helper function -
`fontMaker()` - to help with cross-platform style generation:

```js
// we define available font weight and styles for each font here
const font = {
  OpenSans: {
    weights: {
      ExtraBold: '800',
      Bold: '700',
      SemiBold: '600',
      Light: '300',
      Normal: '400'
    },
    styles: {
      Italic: 'italic'
    }
  },
  Verdana: ...,
  Tahoma: ...,
  ...
}

// generate styles for a font with given weight and style
export const fontMaker = (options = {}) => {
  let { weight, style, family } = Object.assign({
    weight: null,
    style: null,
    family: 'OpenSans'
  }, options)

  const { weights, styles } = font[family]

  if (Platform.OS === 'android') {
    weight = weights[weight] ? weight : ''
    style = styles[style] ? style : ''

    const suffix = weight + style

    return {
      fontFamily: family + (suffix.length ? `-${suffix}` : '')
    }
  } else {
    weight = weights[weight] || weights.Normal
    style = styles[style] || 'normal'

    return {
      fontFamily: family,
      fontWeight: weight,
      fontStyle: style
    }
  }
}
```

Now we can easily use customs font using the `fontMaker` method:

```js
fontMaker({ weight: 'SemiBold', style: 'Italic' })
/*
// iOS
{
  fontFamily: 'OpenSans',
  fontWeight: '600',
  style: 'italic'
}
// Android
{
  fontFamily: 'OpenSans-SemiBoldItalic'
}
*/

fontMaker({ weight: 'Light', family: 'Verdana' })
/*
// iOS
{
  fontFamily: 'Verdana',
  fontWeight: '300',
  fontStyle: 'normal'
}
// Android
{
  fontFamily: 'Verdana-Light'
}
*/

fontMaker({ family: 'Tahoma' })
/*
// iOS
{
  fontFamily: 'Tahoma',
  fontWeight: 'normal',
  fontStyle: 'normal'
}
// Android
{
  fontFamily: 'Tahoma'
}
*/
```

And that's it, all done 😃.

_Massive thanks to [https://blog.bam.tech/developper-news/add-a-custom-font-to-your-react-native-app](https://blog.bam.tech/developper-news/add-a-custom-font-to-your-react-native-app) for helping me get this working._

---
layout: post
published: true
title: Adding model validation to the Sequelize ORM library for node.js
excerpt: "I've been using the [Sequelize ORM](http:&#47;&#47;sequelizejs.com&#47;)
  library for node.js lately and it's a really nicely done piece of work by Sascha
  Depold. It's still got some way to go before one can consider it to be mature framework.
  One thing I miss having is a nice easy way of specifying how to validate field values
  (e.g. [Kohana's validation](http:&#47;&#47;docs.kohanaphp.com&#47;libraries&#47;validation)).
  Luckily there is already the excellent [node-validator](https:&#47;&#47;github.com&#47;chriso&#47;node-validator)
  library and yesterday I was able to integrate it into Sequelize to provide declarative
  validation for fields.\r\n"
date: '2011-11-12 15:57:08 +0800'
categories:
- Uncategorized
tags:
- Javascript
- node.js
- ORM
- Sequelize
- Validation
comments: []
---
I've been using the [Sequelize ORM](http://sequelizejs.com/) library for node.js lately and it's a really nicely done piece of work by Sascha Depold. It's still got some way to go before one can consider it to be mature framework. One thing I miss having is a nice easy way of specifying how to validate field values (e.g. [Kohana's validation](http://docs.kohanaphp.com/libraries/validation)). Luckily there is already the excellent [node-validator](https://github.com/chriso/node-validator) library and yesterday I was able to integrate it into Sequelize to provide declarative validation for fields.

~~I've raised a [pull request](https://github.com/sdepold/sequelize/pull/108) for my work~~ **These changes are now in Sequelize trunk**. But I'll explain the changes here. To validate your models first define the validation for each field. For example:

```js
var User = sequelize.define 'User',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: {
                    args: 3,
                    msg: "Name must be atleast 3 characters in length"
                }
            }
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: {
                    args: [6, 128],
                    msg: "Email address must be between 6 and 128 characters in length"
                },
                isEmail: {
                    msg: "Email address must be valid"
                }
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: 3
                }
            }
        }
    }
```

The `isEmail` and `len` methods are just two of the many methods available (for the full list see the [node-validator page](https://github.com/chriso/node-validator)). The *msg* key specifies the error message to return for a given validation if it fails. If this isn't provided then a default generic error message will be returned by the validation library for that particular validation failure.

To actually perform the validation, call the validate() method on your model instance once your model has been built. For example:

```js
// build user
var user = User.build({
    name: "test"
    email: "test"
    password: "test"
});

// validate
errors = user.validate();
if (errors) {
// errors is an object with the entries structured as follows:
// { field name : [list of validation failure messages] }
//
    for (var prop in errors) {
    if (errors.hasOwnProperty(prop))
        console.log("Errors for field "
            prop ": ");
    for (var i = 0; i < errors[prop].length; i) = "" { < br = "" > console.log("\t"
            errors[prop][i]);
    }
}
else {
    // errors is null, which means validation succeeded
}
```

As a further improvement it would probably be good to enable custom validation methods, though this would be something we add to Sequelize rather than node-validator. Custom methods might be declared and used as follows:

```js
name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: {
                args: 3,
                msg: "Name must be atleast 3 characters in length"
            },
            fn: function(val) {
                if (val !== "mustbethis") throw new Error("Custom validation failed");
            }
        }
}
```

If Sascha accepts the existing validation stuff then I'll push to include custom methods too.
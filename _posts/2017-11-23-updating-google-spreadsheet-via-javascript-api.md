---
layout: post
published: true
title: Updating a Google spreadsheet via the Javascript API
date: '2017-11-23 11:56:01 +0100'
categories:
- Uncategorized
tags:
- Google
- Spreadsheet
- API
comments: []
---

For some recent client work I needed to record the results of running
performance tests in a conveniently accessible place for the rest of the team,
i.e. a [Google spreadsheet](https://www.google.com/sheets/about/).

The tests were being run in CI, meaning that we had to be able to
update the spreadsheets from the CI server itself using the programmatic API.

Our spreadsheet was private (i.e. only visible within our organisation). But
the Git repository running our performance tests is also private, meaning we'd be
able to store some non-public data (e.g. access tokens) within it.

## Script architecture

We have 3 scripts which work together to enable us to write to our spreadsheet:

* `api.js` - This script uses [google-auth-library](https://github.com/google/google-auth-library-nodejs) to
obtain authorisation and access to the spreadsheet.
* `ping.js` - This uses the authorisation obtained via `api.js` to check that the
spreadsheet is actually readable.
* `update.js` - This uses the authorisation obtained via `api.js` to actually
update the spreadsheet.


## Step1: Enable API access

Follow the [quick start instructions](https://developers.google.com/sheets/api/quickstart/nodejs) to enable the Sheets API for your account.

You will receive a credentials JSON file that looks like:

```js
{
    "installed": {
        "client_id": "239872323-alsdjflaskdjf9823sld.apps.googleusercontent.com",
        "project_id": "ecom-performance-testing",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://accounts.google.com/o/oauth2/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_secret": "jsdf89723ihsdoisd_",
        "redirect_uris": ["urn:ietf:wg:oauth:2.0:oob", "http://localhost"]
    }
}
```

Save this file to your Git repo. We save it in `.credentials/client_secret.json`.

## Step 2: api.js

The Sheets v4 API requires an [OAuth-authenticated access token](https://developers.google.com/sheets/api/guides/authorizing#AboutAuthorization) to be
used if one needs to write to a spreadsheet.

But since we're running in a CI environment that's non-interactive that's not
going to be possible to do at runtime. So our script will work as follows:

1. Load existing token from `.credentials/token.json` in our Git repo.
2. If existing token found then create and return an Auth object for use with the API.
3. If existing NOT token found then:
4. - If running on local machine, trigger OAuth authentication flow and save new token to `.credentials/token.json`, OR
5. - If running in CI then tell the user to re-run the build locally for step 3a to happen.

Here is the script:

```js
import fs from 'fs';
import path from 'path';
import promisify from 'es6-promisify';
import readline from 'readline';
import GoogleAuth from 'google-auth-library';

const credentialsPath = path.join(__dirname, '.credentials');
const credentialsFile = path.join(credentialsPath, 'client_secret.json');
const tokenFile = path.join(credentialsPath, 'token.json');


export const getClient = async () => {
  const credentials = require(credentialsPath);

  const {
    installed: {
      client_secret: clientSecret,
      client_id: clientId,
      redirect_uris: redirectUrls
    }
  } = credentials;

  const redirectUrl = redirectUrls[0];

  const auth = new GoogleAuth();
  const client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  try {
    client.credentials = require(tokenFile);
  } catch (err) {
    console.warn(`Error loading token: ${err}`);

    client.credentials = getNewToken(client);
  }

  return client;
}


const getNewToken = async client => {
  // if not running in CI then tell user to run the script locally
  if (process.env.CI) {
    throw new Error('The OAuth token has expired. Please run this script locally to obtain a new token.');
  }

  // generate auth URL
  const authUrl = client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/spreadsheets']
  });

  // tell user to visit the URL
  console.log(`\nPlease visit the following URL to obtain an authorisation code:`, authUrl);

  // let user input the obtained code
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const code = await new Promise(resolve => {
    rl.question(`\nEnter the code from that page here: `, resolve);
  });

  rl.close();

  // get token corresponding to the code from Google
  const token = JSON.stringify(await promisify(client.getToken, client)(code), null, 2);

  console.log('New token:', token);

  // save token
  fs.writeFileSync(tokenFile, token);

  console.log(`\nNew auth token has been saved to disk.`);

  return token;
}
```

Note that we're saving the token in plaintext in `.credentials/token.json`. If
this was a public Git repo and we wanted to keep the token a secret we could
encrypt and then decrypt it on the fly during the CI build. The decryption key
could be [provided via an environment variable](https://github.com/circleci/encrypted-files) on the CI build server.

## Step 3: ping.js

Now that we have `api.js` in place, this script is straightforward:

```js
import promisify from 'es6-promisify';
import Google from 'googleapis';

import { getClient } from './api';

const main = async () => {
  // get the authenticated client
  const client = await(getClient());

  // init the API
  const sheets = Google.sheets('v4');

  const asyncGet = promisify(sheets.spreadsheets.values.get, sheets.spreadsheets.values);

  // get spreadsheet data from cells: Sheet1, A1:B1
  const res = await asyncGet({
    auth: client,
    spreadsheetId: '23jsdfljslfkjsdkfjsldfjsdf',
    range: 'Sheet1!A1:B'
  });

  console.log(res);
  console.log('Spreadsheet accessed successfully!')
}

main().catch(err => {
  console.error(err);

  throw err;
});
```

The ping script simply checks that we can actually access the spreadsheet.
This checks that our API token is valid and that the Sheets API is working as
expected.

Note that we use [A1 Notation](https://developers.google.com/sheets/api/guides/concepts#a1_notation)
to actually refer to the cells we wish to check.

## Step 4: update.js

The `update.js` script is also straightforward to write:

```js
import fs from 'fs';
import path from 'path';
import promisify from 'es6-promisify';
import Google from 'googleapis';

import { getClient } from './api';

const main = async () => {
  // get auth client
  const client = await(getClient());

  // init api
  const sheets = Google.sheets('v4');

  const asyncAppend = promisify(sheets.spreadsheets.values.append, sheets.spreadsheets.values);

  // append data
  await asyncAppend({
    auth: client,
    spreadsheetId: 'sflasdhflsh293lasdlsdf',
    range: `Sheet1!A:E`,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    resource: {
      range: `${name}!A:E`,
      majorDimension: "ROWS",
      values: [
        [
          '2018-01-01',
          23.4,
          1.2,
          9.5,
          "looks good"
        ]
      ]
    }
  })
}

main().catch(err => {
  console.error(err);

  throw err;
});
```

## Further thoughts

You can customize and paramterize the above scripts if you need
something more generic you want to use for any spreadsheet.

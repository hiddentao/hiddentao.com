---
layout: post
published: true
title: Javascript client-side file generation and download
excerpt: "For a project I'm currently working on I need to be able to generate a file
  in Javascript and then prompt the user to save it to their hard drive. I've spent
  some time searching the web for the various available solutions to this and have
  decided to list them here for others to benefit.\r\n"
date: '2011-07-04 11:35:55 +0800'
categories:
- Uncategorized
tags:
- Javascript
- HTML5
comments:
- id: 4722
  author: Kelley
  author_email: kelley@bikemountain.info
  author_url: ''
  date: '2011-08-10 20:16:00 +0800'
  date_gmt: '2011-08-10 20:16:00 +0800'
  content: |
    <p>I have a web site that I want users to be able to download
    their choices off a menu of bike parts to an Excel spread sheet. I have also
    tried using Downloadify.<&#47;p>

    <p>First it took me a couple of hours, and I hate admitting
    that, to figure out that the<&#47;p>

    <p><<&#47;p>

    <p>p id=downloadify> was a place holder for
    the button. I could not get the button to display.<&#47;p>

    <p>It is still not working with FireFox and I am not sure why.<&#47;p>

    <p>It works with Chrome and IE9.<&#47;p>
- id: 4723
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2011-08-10 21:18:00 +0800'
  date_gmt: '2011-08-10 21:18:00 +0800'
  content: "<p>@Kelley I haven't tried it in Firefox yet as I'm primarily testing
    it on Chrome. But the official downloadify test page works ok for me in Firefox
    ->&nbsp;http:&#47;&#47;pixelgraphics.us&#47;downloadify&#47;test.html. Perhaps
    you can compare that with your local and see what difference there is.<&#47;p>\n"
- id: 4764
  author: Ludovic Urbain
  author_email: ludovic.urbain.1@gmail.com
  author_url: ''
  date: '2012-04-23 11:52:00 +0800'
  date_gmt: '2012-04-23 11:52:00 +0800'
  content: "<p>dude you can use js to interact with your flash if that's your problem.<&#47;p>\n"
- id: 4765
  author: Ludovic Urbain
  author_email: ludovic.urbain.1@gmail.com
  author_url: ''
  date: '2012-04-24 08:16:00 +0800'
  date_gmt: '2012-04-24 08:16:00 +0800'
  content: '<p>Also the data uri scheme works perfectly with the "download" attribute
    - unfortunately, like anything great it works in chrome only.<&#47;p>

'
- id: 4789
  author: Capi Etheriel
  author_email: barraponto@gmail.com
  author_url: http://barraponto.blog.br/
  date: '2012-10-26 12:35:00 +0800'
  date_gmt: '2012-10-26 11:35:00 +0800'
  content: "<p>What about https:&#47;&#47;github.com&#47;eligrey&#47;FileSaver.js
    ?<&#47;p>\n"
- id: 4790
  author: Ram
  author_email: ram@hiddentao.com
  author_url: ''
  date: '2012-10-28 10:15:00 +0800'
  date_gmt: '2012-10-28 10:15:00 +0800'
  content: "<p>Looks like that was first committed after I posted this. From the looks
    of it it allows you to save to a 'sandboxed' file system using the W3C File System
    API, i.e. it's specific to your app and is not the global file system on the user's
    machine. You can place the file in temporary storage (can be deleted at any time
    by the browser) or persistent storage (only the user can delete it, but they must
    approve its use in the first place). It still won't let you save something to
    an arbitrary location on your machine.<&#47;p>\n"
- id: 4807
  author: Javascript client-side file generation and download | FullMoon&#039;s Blog
  author_email: ''
  author_url: http://fullmoon.limewebs.com/?p=251
  date: '2013-01-20 03:47:07 +0800'
  date_gmt: '2013-01-20 03:47:07 +0800'
  content: "<p>[...] http:&#47;&#47;www.hiddentao.com&#47;archives&#47;2011&#47;07&#47;04&#47;javascript-client-side-file-generation-and-download&#47;
    [...]<&#47;p>\n"
- id: 4892
  author: File generation and download using Javascript on Android browser (client-side)CopyQuery
    CopyQuery | Question &amp; Answer Tool for your Technical Queries,CopyQuery, ejjuit,
    query, copyquery, copyquery.com, android doubt, ios question, sql query, sqlite
    qu
  author_email: ''
  author_url: http://www.copyquery.com/file-generation-and-download-using-javascript-on-android-browser-client-side/
  date: '2014-01-15 01:55:27 +0800'
  date_gmt: '2014-01-15 01:55:27 +0800'
  content: "<p>[...] a web page with save file functionality where the file is generated
    dynamically on client-side. this [...]<&#47;p>\n"
- id: 4893
  author: File generation and download using Javascript on Android browser (client-side)
    | BlogoSfera
  author_email: ''
  author_url: http://www.blogosfera.co.uk/2014/01/file-generation-and-download-using-javascript-on-android-browser-client-side/
  date: '2014-01-15 02:02:10 +0800'
  date_gmt: '2014-01-15 02:02:10 +0800'
  content: "<p>[...] a web page with save file functionality where the file is generated
    dynamically on client-side. this [...]<&#47;p>\n"
- id: 5028
  author: Atul
  author_email: atulchanne@gmail.com
  author_url: ''
  date: '2015-04-06 15:21:00 +0800'
  date_gmt: '2015-04-06 14:21:00 +0800'
  content: "<p>@hiddentao:disqus, I am using downloadify. Is there any way to invoke
    download functionality from custom html button rather than downloadify flash button?<&#47;p>\n"
- id: 5029
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2015-04-07 08:25:00 +0800'
  date_gmt: '2015-04-07 07:25:00 +0800'
  content: "<p>Not really since Flash is creating the file. My article is probably
    bit out of date now, especially now that the FileWriter API is no longer supported.
    I think people use Blobs today, e.g. see http:&#47;&#47;pdfkit.org&#47;demo&#47;browser.html<&#47;p>\n"
- id: 5054
  author: Matthew Browne
  author_email: mbrowne83@gmail.com
  author_url: ''
  date: '2015-05-26 11:13:00 +0800'
  date_gmt: '2015-05-26 10:13:00 +0800'
  content: |
    <p>There is a now a great library for saving files using Blobs or data URIs:
    https:&#47;&#47;github.com&#47;eligrey&#47;FileSaver.js<&#47;p>
---
For a project I'm currently working on I need to be able to generate a file in Javascript and then prompt the user to save it to their hard drive. I've spent some time searching the web for the various available solutions to this and have decided to list them here for others to benefit.

## Browser-specific methods ##

As far as I'm aware, of all the major browsers only IE and Firefox provide pure-Javascript solutions for reading and writing files to/from the client machine's disk drives. Firefox uses the [nsILocalFile](https://developer.mozilla.org/en/XPCOM_Interface_Reference/nsILocalFile) API to do this. IE uses [FileSystemObject](http://msdn.microsoft.com/en-us/library/2z9ffy99(v=vs.85).aspx). Both require the user to approve special privileges for either the website or the browser itself. Such a solution wouldn't go down well with non-technical users.

The other browsers (Safari, Opera, Chrome) require the use of plugins to provide file system access, which is what I'll come onto next.

## Third-party plugins ##

Flash files and Java applets are much more powerful in terms of what they can do once loaded. Thanks to YouTube and other flash-heavy sites most machines (excluding i-devices) have Flash already installed. So it's natural that most of the file-saving code out there relies on a flash movie to do the actual working of generating the file and popping up a 'save' dialog box to show the user. An example of this in action is the [TableTools plugin for DataTools](http://www.datatables.net/extras/tabletools), itself a jQuery plugin. This uses a flash movie to allow users to copy and download the contents of a table in various formats. The flash movie's capabilities are configured via Javascript.

An open source tool called [Downloadify](https://github.com/dcneiner/Downloadify) enables anyone to integrate such a Flash Javascript combo file downloader into their website. From looking at this and the TableTools solution it seems that in order for the Flash movie to trigger a file saving dialog the user must click within the flash movie. It doesn't seem possible trigger it directly through Javascript. Thus you will need to render the Flash movie button on your page for the user to click.

## Data URI scheme ##

Neither of the previous options were really appearing. I set out searching for cross-browser ways of achieving what I wanted and came across the [data URI scheme](http://en.wikipedia.org/wiki/Data_URI_scheme). This involves encoding the file contents as, say, the `href` attribute of an anchor tag as follows:

```html
data:image/png;base64,iVMNBDSg...==
```

Support for this method is patchy across browsers and versions of IE older than 9 have a 32 KB limit in terms of the size of the resulting file. But the biggest downside is that you cannot set what the name of the file ought to be (see [RFC2397](http://tools.ietf.org/html/rfc2397)).

## FileWriter API ##

This is a work in progress by the W3C to specify a [standard way of writing and saving files from Javascript](http://www.w3.org/TR/file-writer-api/) though at the moment it isn't yet supported by any browsers. Chrome is aiming to support it soon (already?) though, according to [rumours](http://stackoverflow.com/questions/4531585/can-you-write-files-in-chrome-8), written files will probably be restricted to a sandboxed folder specific to each web app.

*Note: It's cousin - the [FileReader API](http://www.html5rocks.com/en/tutorials/file/dndfiles/) - is supported in [Opera](http://www.opera.com/docs/specs/presto28/file/) [Firefox](https://developer.mozilla.org/en/DOM/FileReader) and [Chrome](http://blog.chromium.org/2010/06/google-chrome-developer-update-google.html).*

## Final thoughts ##

I looked up [TiddlyWiki](http://en.wikipedia.org/wiki/TiddlyWiki) and it is said to use a Java applet to save files when there are no proprietary file system APIs available. And that thing has been around for years so it would know what works best.

I've decided to go with Downloadify - the Flash Javascript solution - for now whilst I'm developing the application. It works quite well and is easy to use. It sucks that users won't be able to save files on i-devices. But they're mobile devices so perhaps it's ok to just have a read-only experience on them. This isn't a long term solution. I guess I'm hoping to hit upon a better way of doing things as time progresses. The simplest improvement would be to enable developers to set the name of the download file when using data URIs.

**Update 1**

For use of the `FileReader` API I found some good resources:

* [http://www.thebuzzmedia.com/html5-drag-and-drop-and-file-api-tutorial/](http://www.thebuzzmedia.com/html5-drag-and-drop-and-file-api-tutorial/) - up-to-date drag & drop tutorial.
* [http://code.google.com/p/html5uploader/](http://www.thebuzzmedia.com/html5-drag-and-drop-and-file-api-tutorial/) - cross-browser file drag and drop upload library, though still won't work without a server on Safari.
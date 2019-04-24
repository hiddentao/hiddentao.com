---
title: Javascript client-side file generation and download
date: '2011-07-04'
summary: "For a project I'm currently working on I need to be able to generate a file in Javascript and then prompt the user to save it to their hard drive. I've spent some time searching the web for the various available solutions to this and have decided to list them here for others to benefit.\r\n"
tags:
  - Javascript
  - HTML5
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

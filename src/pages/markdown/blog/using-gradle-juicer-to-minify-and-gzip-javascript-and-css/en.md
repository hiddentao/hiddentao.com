---
title: Using Gradle + Juicer to minify and GZip Javascript and CSS
date: '2010-11-10'
summary: "Recently I've been focussing more and more on performance in the web projects I'm working on. By now the [benefits of merging, minifying and GZipping](http:&#47;&#47;developer.yahoo.com&#47;performance&#47;rules.html) external Javascript and CSS files are well documented - your web page loads quicker (due to smaller download sizes and less HTTP requests to make). For a web project I'm currently working on I decided to investigate what tools were available out there and particularly, how I could automate the whole process using a build script.\r\n"
tags:
  - Javascript
  - Gradle
  - Juicer
  - CSS
---
Recently I've been focussing more and more on performance in the web projects I'm working on. By now the [benefits of merging, minifying and GZipping](http://developer.yahoo.com/performance/rules.html) external Javascript and CSS files are well documented - your web page loads quicker (due to smaller download sizes and less HTTP requests to make). For a web project I'm currently working on I decided to investigate what tools were available out there and particularly, how I could automate the whole process using a build script.
<a id="more"></a><a id="more-997"></a>
My requirements are quite simple:

* The CSS minification process should process `@import` statements within CSS files and merge the imported files into the original, thereby reducing the number of files which get loaded via HTTP calls.
* The Javascript minification process should also be able to merge multiple script files into one using some sort of declarative syntax in the files to specify dependencies (since Javascript has not built-in import mechanism like CSS).
* Once minifed both Javascript and CSS files should be served GZipped to browsers which support it in order minimise download size and therefore transmission time.

There are a few established Javascript minifiers out there - the main two I came across being [Google Closure](http://code.google.com/closure/) and [YUI Compressor](http://developer.yahoo.com/yui/compressor/). YUI Compressor minifies CSS as well as Javascript files (and I planned to do both). There are comparisons out there between the various toolkits but I already prefer YUI Compressor since it does CSS files too. However, neither of these tools have any concept of inter-file dependencies as their main focus is to simplify minify a given set of input files.

Some further searching on the web brings up [RequireJS](http://requirejs.org/) and [Juicer](http://cjohansen.no/en/javascript/juicer_a_css_and_javascript_packaging_tool). RequireJS provides a small Javascript library which enables you to split your Javascript code into *modules* where each module lies within its own script file and can assert dependencies on other modules. The RequireJS code will ensure that modules are loaded in the right order when needed. Moreoever, it comes with an optimisation tool (internally utilising Closure) which you can use to merge and minify modules into single files when it comes time to deploy your application. The optimisation tool also minifies CSS files, though it doesn't process `@import` statements. Juicer, on the other hand, is simply a minification tool (internally utilising Closure or YUI Compressor) which can process CSS `@import` statements. It also provides a custom `@depends` declaration for use in Javascript files to determine inter-file dependencies though this is optional.

Taking things into consideration I've personally opted for Juicer over RequireJS. For my project I don't need to merge Javascript files just yet since everything is already nicely modularized, but I do need the kind of CSS minification which Juicer provides. In addition, using RequireJS would require me to rewrite my Javscript code whereas the Juicer method wouldn't, though the benefits of modularized Javascript outweigh the cons in the long run. So I might switch the Javascript minification to RequireJS later on once my scripts get more complicated.

Getting Juicer installed is easy:

```bash
... // assuming you have Java already installed
...
$ sudo apt-get install rubygems ruby ruby-dev libxslt-dev libxml2-dev
...
$ sudo gem install juicer
...
$ sudo ln -s /var/lib/gems/1.8/gems/juicer-1.0.8/bin/juicer /usr/local/bin/juicer
...
$ juicer install yui_compressor
$ juicer install jslint
```

You may have noticed the installation of [JSLint](http://www.jslint.com/) above. This is used by Juicer the verify the Javascript code integrity prior to the minification process - but we can tell Juicer to ignore the result of this and proceed with minification anyway. You can run Juicer from the command-line right now:

```bash
$ juicer merge myfile.css
... // will produce myfile.min.css containing merged and minifed CSS
$ juicer help
... // will show help on commands and options
```

By default Juicer stores the minifed output in the same folder as the original file. This is ok when you have only one or two files but not when you have many. I want minified files to be stored in a folder parallel to the original folder. For instance, all my CSS files are stored under `css/` and some in sub-folders of that folder. Thus, the minifed version of `css/forms/base.css` should be output at `css_min/forms/base.css`. All other CSS files under `css/` should be minifed and output to the same relative path under `css_min`.

The benefit of storing the minifed version under a different folder is that it makes it easy to delete existing minified resources if need be. Additionally, when it comes to minifying Javascript some of the script files I have are third-party files which are already minified - storing the minifed version of a script file in a separate folder means not having to work out whether a minified file in the original folder is one that was already minified or one that was minified from an original non-minified source.

*Note: You will need to modify your application code such that it is able easily switch the root folder it serves CSS and Javascript resources from (e.g. `css` or `css_min`). In my application I have it serve from the original folders when in development mode and from the minification output folders when in production deployment.*

The folder for storing minifed CSS files should always be sibling to the original CSS folder in order for relative CSS image paths to remain accurate. For instance, if `css/forms/base.css` contains the following:

```css
button {
  background: transparent url("../../img/bg.png");
}
```

The minifed version of the CSS file should also be stored in such a way that the relative image path `"../../img/bg.png"` still makes sense. Taking all of the above into consideration, if the following is the folder structure containing the original source files:

```
project/css/base.css
project/css/forms/base.css
project/js/base.js
project/js/net/sockets.js
project/img
```

Then the minifed versions would be stored as follows:

```
project/css/base.css
project/css/forms/base.css
project/css_min/base.css
project/css_min/forms/base.css
project/js/base.js
project/js/net/sockets.js
project/js_min/base.js
project/js_min/net/sockets.js
project/img
```

The next step is to automate the minification process using a [Gradle](http://gradle.org/) build script. In my Gradle script (below) I'm also GZipping the minifed CSS files:

```groovy
// Create given folder if it doesn't exist
void ensure_folder_exists(String folderPath) {
        File f = new File(folderPath)
        if (!f.exists()) {
                println "<< Creating folder: $folderPath >>"
                f.mkdir()
        }
}

task minify_css << {
        println "\nMinifying CSS..."

        String outputFolder = "css_min"
        ensure_folder_exists(outputFolder)
        FileTree files = fileTree(dir: "css", include: "**/*.css")

        files.each { File file ->
                String fileName = file.getName()

                String fileFolder = file.getParent()

                String fileOutputFolder = outputFolder   fileFolder.substring(fileFolder.indexOf("css") 3)

                ensure_folder_exists(fileOutputFolder)

                String outputFilePath = fileOutputFolder   "/"   fileName

                println "-- $fileName => $outputFilePath"

                ant.exec(executable: "/usr/local/bin/juicer") {

                        arg(value: "merge")

                        arg(value: "-o"   outputFilePath)

                        arg(value: "-f")        // force overwrite target file

                        arg(value: file.toString())

                }

        }

}

task zip_css(dependsOn: minify_css) << {

        println "\nZipping CSS..."

        FileTree files = fileTree(dir: "css_min", include: "**/*.css")

        files.each { File file ->

                String fileName = file.getName()

                println "-- $fileName => ${fileName}.gz"

                ant.gzip(src: file, destfile:file.toString()   ".gz")

        }

}

```

And here's the equivalent for Javascript files. Note that when minifying Javascript files I first check to ensure that the file isn't already minified. I also tell Juicer to ignore JSLint verification results since it throws up lots of false negatives for my code:

```groovy
task minify_js << {
        println "\nMinifying JS..."

        String outputFolder = "js_min"

        ensure_folder_exists(outputFolder)

        FileTree files = fileTree(dir: "js", include: "**/*.js")

        files.each { File file ->

                String fileName = file.getName()

                String fileFolder = file.getParent()

                String fileOutputFolder = outputFolder   fileFolder.substring(fileFolder.indexOf("js") 2)

                ensure_folder_exists(fileOutputFolder)

                String outputFilePath = fileOutputFolder   "/"   fileName

                // don't minify already minified files

                if (-1 == fileName.indexOf(".min.")) {

                        println "-- $fileName => $outputFilePath"

                        ant.exec(executable: "/usr/local/bin/juicer") {

                                arg(value: "merge")

                                arg(value: "-o"   outputFilePath)

                                arg(value: "-i")        // skip JSLint errors

                                arg(value: "-f")        // force overwrite target file

                                arg(value: file.toString())

                        }

                } else {

                        println "-- $fileName => $outputFilePath (SKIP/COPY)"

                        ant.copyfile(src: file, dest: outputFilePath)

                }

        }

}

task zip_js(dependsOn: minify_js) << {

        println "\nZipping JS..."

        FileTree tree = fileTree(dir: "js_min", include: "**/*.js")

        tree.each {File file ->

                String fileName = file.getName()

                println "$fileName => ${fileName}.gz"

                ant.gzip(src: file, destfile:file.toString()   ".gz")

        }

}

```

I've integrated with the above Gradle script with my [automated build process](/archives/2010/10/27/setting-up-hudson-on-debian-for-continuous-integration-with-git/) so that minifed, gzipped resources get created as part of my continuous integration process.

If you're using [nginx](http://nginx.org/) or [Apache](http://httpd.apache.org/) to serve up the CSS and Javascript files then you can configure them to serve up GZipped versions of these resources if available. I'm using nginx and it has a [module which does this](http://wiki.nginx.org/NginxHttpGzipStaticModule). Here are the settings I use:

```
server {
...
        # Serve static files directly
        #
        #    /var/www/static/css/...
        #    /var/www/static/css_min/...
        #    /var/www/static/js/...
        #    /var/www/static/js_min/...
        #
        location ^~ /static/ {
                root /var/www;
        }
        #
        # serve pre-compressed static files
        #
        gzip off;
        gzip_static on;
        gzip_http_version 1.1;
        gzip_proxied any;   # Enables compression for all proxy requests
        gzip_vary on;    # Enables response header of "Vary: Accept-Encoding"
...
}
```

Let me know if you have any questions about the above or if you've come across better tools for the job.

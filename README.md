# release-planner
Plan your environment releases.

Head over to https://e2jk.github.io/release-planner/ to give it a spin!

## Build

To build the web application from source, clone the project from github

    $ git clone https://github.com/e2jk/release-planner.git

The source code uses the module style of node (require and module.exports) to
organize dependencies. To install all dependencies and build the library,
run `npm install` in the root of the project.

    $ cd release-planner
    $ npm install

Then, the project can be build running:

    $ npm run build-js

Alternatively, to automatically recompile the bundled Javascript and CSS as you save modifications, run:

    $ npm run watch-js

Start up a local webserver (have a look at the Live Server extension for Visual Studio Code, if you use that IDE) and open the `public/index.html` file in your browser.
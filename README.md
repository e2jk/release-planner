# release-planner
Plan your environment releases.

Head over to https://e2jk.github.io/release-planner/ to give it a spin!

## Build

To build the web application from source, clone the project from GitHub

    $ git clone https://github.com/e2jk/release-planner.git

The source code uses the module style of node (require and module.exports) to
organize dependencies. To install all dependencies and build the library,
run `npm install` in the root of the project.

    $ cd release-planner
    $ npm install

Then, the project can be build running:

    $ npm run build

Alternatively, to automatically recompile the bundled Javascript and CSS as you save modifications, run:

    $ npm run watch

Start up a local webserver (have a look at the Live Server extension for Visual Studio Code, if you use that IDE) and open the `public/index.html` file in your browser.

## Test

To run the test suite:

    $ npm test

If you want to automatically run the test suite every time you save modifications, run:

    $ npm test -- --watchAll
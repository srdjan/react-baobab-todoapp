rmdir /S /Q build

mkdir build
cd build
mkdir css
mkdir lib
mkdir js
cp ./src/index.html ./build/index.html
cp ./src/css/base.css ./build/css/base.css

browserify ./src/js/app.js -t [reactify --es6] -do ./build/js/bundle.js

// ./node_modules/.bin/server


var rimraf = require('rimraf')
var mkdirp = require('mkdirp')
var cp = require('cp')

rimraf('build')
mkdirp('build')
// cp('src/index.html', 'build')
// cp('src/css/base.css', 'build/css/')

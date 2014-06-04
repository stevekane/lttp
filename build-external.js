var path       = require('path')
  , fs         = require('fs')
  , browserify = require('browserify')
  , es6ify     = require('es6ify')
  , bundlePath = path.join("assets", "vendor", "bundle.js")

browserify()
  .require("lodash")
  .bundle({ debug: true })
  .on('error', function (err) { console.error(err); })
  .pipe(fs.createWriteStream(bundlePath));

var path       = require('path')
  , fs         = require('fs')
  , browserify = require('browserify')
  , distPath   = path.join(__dirname, 'assets', 'dist')
  , bundlePath = path.join(distPath, 'lttp.js')
  ;

browserify()
  .require(require.resolve('./public/main.js'), { entry: true })
  .external("lodash")
  .external("socket.io-client")
  .bundle({ debug: true })
  .on('error', function (err) { console.error(err); })
  .pipe(fs.createWriteStream(bundlePath));

var path       = require('path')
  , fs         = require('fs')
  , browserify = require('browserify')
  , distPath   = path.join(__dirname, 'assets', 'dist')
  , bundlePath = path.join(distPath, 'lttp-controller.js')
  ;

browserify()
  .require(require.resolve('./public/controllers/controller.js'), { entry: true })
  .external("socket.io-client")
  .bundle({ debug: true })
  .on('error', function (err) { console.error(err); })
  .pipe(fs.createWriteStream(bundlePath));

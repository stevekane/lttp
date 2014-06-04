var path       = require('path')
  , fs         = require('fs')
  , browserify = require('browserify')
  , es6ify     = require('es6ify')
  , distPath   = path.join(__dirname, 'assets', 'dist')
  , bundlePath = path.join(distPath, 'lttp.js')
  ;

browserify()
  .add(es6ify.runtime)
  .transform(es6ify)
  .require(require.resolve('./public/main.js'), { entry: true })
  .bundle({ debug: true })
  .on('error', function (err) { console.error(err); })
  .pipe(fs.createWriteStream(bundlePath));

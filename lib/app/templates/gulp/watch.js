'use strict';

var gutil = require('gulp-util');

module.exports = function (gulp, $, config) {
  gulp.task('browserSync', ['build'], function () {
    $.browserSync({
      host: config.host,
      open: 'external',
      port: config.port,
      server: {
        baseDir: config.buildDir
      }
    });
  });

  gulp.task('watch', ['build'], function () {
    $.browserSync.reload();

    gulp.watch([config.unitTestFiles], function(event) { onWatchTrigger(event, ['unitTest']);});
    gulp.watch([config.appImageFiles], function(event) { onWatchTrigger(event, ['images']);} );
    gulp.watch([config.appFontFiles], function(event) { onWatchTrigger(event, ['fonts']);} );
    gulp.watch([config.appStyleFiles], function(event) { onWatchTrigger(event, ['styles']);} );
    gulp.watch([config.appIndexFile], function(event) { onWatchTrigger(event, ['inject', 'bowerInject']);} );
    gulp.watch([config.appMarkupFiles, '!' + config.appIndexFile], function(event) { onWatchTrigger(event, ['markup']);} );
    gulp.watch([config.appScriptFiles], function(event) { onWatchTrigger(event, ['scripts', 'unitTest']);} );

    function onWatchTrigger (event, tasks) {
      gutil.log(gutil.colors.bold(event.path + ' is ' + event.type));

      if(event.type === 'deleted') {
        $.runSequence('clean', 'build', tasks);
      } else if (event.type === 'added' || event.type === 'renamed') {
        $.runSequence('inject', tasks);
      } else {
        $.runSequence(tasks);
      }

      gulp.start($.browserSync.reload);
    }
  });
};

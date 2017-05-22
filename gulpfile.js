var concat = require('gulp-concat'),
    concatCss = require('gulp-concat-css'),
    cssnano = require('gulp-cssnano'),
    del = require('del'),
    gulp = require('gulp'),
    rename = require('gulp-rename'),
    runSequence = require('run-sequence'),
    uglify = require('gulp-uglify');



/*********************************************
            Global Tasks
*********************************************/

gulp.task('clean:dist', function() {
  return del.sync('dist');
});

gulp.task('minify-css', function() {
  return gulp.src(['dev/styles.css'])
    .pipe(concatCss('univ-intranet-seattle.css'))
    .pipe(cssnano())
    .pipe(gulp.dest('dist'));
});

gulp.task('compile-widgets', function() {
  return gulp.src(['dev/photo-gallery/*.js'])
    .pipe(rename('custom-widgets.js'))
    .pipe(gulp.dest('dist'))
});
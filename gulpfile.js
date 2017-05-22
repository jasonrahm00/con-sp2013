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
  return gulp.src(['dev/styles.css', 'dev/photo-gallery/*.css'])
    .pipe(concatCss('univ-intranet-seattle.css'))
    .pipe(cssnano())
    .pipe(gulp.dest('dist'));
});

gulp.task('minify-js', function() {
  return gulp.src(['dev/custom-scripts.js'])
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
});

gulp.task('compile', function(callback) {
  runSequence('clean:dist', ['minify-css', 'minify-js'], callback);
});
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
  return gulp.src(['dev/styles.css', 'dev/photo-gallery/*.css', 'dev/quick-links/*.css', 'dev/accordion-widget/*.css'])
    .pipe(concatCss('custom-master-styles.css'))
    .pipe(cssnano())
    .pipe(gulp.dest('dist/live'));
});

gulp.task('minify-js', function() {
  return gulp.src(['dev/custom-scripts.js'])
    .pipe(uglify())
    .pipe(rename('custom-scripts.min.js'))
    .pipe(gulp.dest('dist/live'))
});

gulp.task('compile', function(callback) {
  runSequence('clean:dist', ['minify-css', 'minify-js'], callback);
});



/*********************************************
            Services Tasks
*********************************************/

gulp.task('service-scripts', function() {
  return gulp.src(['dev/service-list/service-list-scripts.js'])
    //.pipe(uglify())
    .pipe(gulp.dest('dist/live'))
})



/*********************************************
            Directory Tasks
*********************************************/

gulp.task('minify-dir-scripts', function() {
  return gulp.src(['dev/staff-directory/*.js'])
    .pipe(uglify())
    .pipe(gulp.dest('dist/live'))
});

gulp.task('minify-dir-css', function() {
  return gulp.src(['dev/staff-directory/*.css'])
    .pipe(cssnano())
    .pipe(gulp.dest('dist/live'))
});

gulp.task('compile-directory', function(callback) {
  runSequence('clean:dist', ['minify-dir-scripts', 'minify-dir-css'], callback);
});



/*********************************************
            Test Site Tasks
*********************************************/

gulp.task('test-scripts', function() {
  return gulp.src(['dev/service-list/service-list-scripts.js'])
    .pipe(rename('test-scripts.js'))
    .pipe(gulp.dest('dist/test'))
});

gulp.task('test-styles', function() {
  return gulp.src(['dev/staff-directory/*.css'])
    .pipe(rename('test-styles.css'))
    .pipe(gulp.dest('dist/test'))
});

gulp.task('compile-test', function(callback) {
  runSequence('clean:dist', ['test-scripts', 'test-styles'], callback);
});
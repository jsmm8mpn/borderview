var gulp = require('gulp');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var templateCache = require('gulp-angular-templatecache');
var less = require('gulp-less');
var jade = require('gulp-jade');
var cssBase64 = require('gulp-css-base64');
var connect = require('gulp-connect');
 
// Basic usage 
gulp.task('build', function() {
	
	gulp.src('src/*.jade')
    .pipe(jade())
    .pipe(templateCache({
			standalone: true
		}))
    .pipe(gulp.dest('src/'));
	
	gulp.src('src/app.js')
		.pipe(browserify())
		.pipe(rename("borderlayout.js"))
		.pipe(gulp.dest('./'));
	
	gulp.src('src/*.less')
		.pipe(less())
		.pipe(cssBase64())
		.pipe(gulp.dest('./'));
});

gulp.task('refresh', function() {
	gulp.src('./').pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['src/*'], ['build', 'refresh']);
});

gulp.task('connect', function() {
  connect.server({
    root: './',
    livereload: true
  });
});

gulp.task('default', ['build']);
gulp.task('serve', ['connect', 'watch']);
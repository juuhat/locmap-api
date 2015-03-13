var gulp = require('gulp');
var gutil = require('gulp-util');
var mocha = require('gulp-mocha');

gulp.task('test', function() {
	return gulp.src('./test/*.js')
		.pipe(mocha({ 'reporter': 'spec' }))
		.on('error', gutil.log);
});

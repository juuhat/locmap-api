var gulp = require('gulp');
var gutil = require('gulp-util');
var mocha = require('gulp-mocha');

gulp.task('test', function() {
	return gulp.src('./test/*.js')
		.pipe(mocha({ 'reporter': 'mocha-jenkins-reporter' }))
		.on('error', gutil.log);
});

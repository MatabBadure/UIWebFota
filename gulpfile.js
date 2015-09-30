//load plugins
var gulp             = require('gulp'),
	compass          = require('gulp-compass'),
	autoprefixer     = require('gulp-autoprefixer'),
	minifycss        = require('gulp-minify-css'),
	uglify           = require('gulp-uglify'),
	rename           = require('gulp-rename'),
	concat           = require('gulp-concat'),
	notify           = require('gulp-notify'),
	livereload       = require('gulp-livereload'),
	plumber          = require('gulp-plumber'),
	path             = require('path'),
	gulprc = require("./gulpfile.json"),
	del = require("del"),
	htmlreplace = require('gulp-html-replace'),
	runSequence = require('run-sequence'),
	stripCssComments = require('gulp-strip-css-comments');
//the title and icon that will be used for the Grunt notifications
var notifyInfo = {
	title: 'Gulp',
	icon: path.join(__dirname, 'gulp.png')
};

//error notification settings for plumber
var plumberErrorHandler = { errorHandler: notify.onError({
		title: notifyInfo.title,
		icon: notifyInfo.icon,
		message: "Error: <%= error.message %>"
	})
};

//clean build and index file
gulp.task("clean", function (done) {
  del(gulprc.patterns.clean, {force: true}, done);
});

//styles
gulp.task('styles_process', function() {
	return gulp.src('app/styles/*.scss')
		.pipe(plumber(plumberErrorHandler))
		.pipe(compass({
			css: 'app/build/css',
			sass: 'app/styles/',
			image: 'app/build/images',
			comments: false
		}))
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulp.dest('app/build/css'));
});

//styles remove comments
gulp.task('styles_strip_comments', function() {
	return gulp.src(gulprc.patterns.styles)
		.pipe(plumber(plumberErrorHandler))
		.pipe(stripCssComments({preserve: false}))
		.pipe(gulp.dest('app/build/css'));
});

//styles minify
gulp.task('styles_minify', function() {
	return gulp.src(gulprc.patterns.styles)
		.pipe(plumber(plumberErrorHandler))
		.pipe(concat('main.css'))
		.pipe(gulp.dest('app/build/css'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(minifycss())
		.pipe(gulp.dest('app/build/css'));
});

gulp.task('styles', function (cb) {
  runSequence('styles_process', 'styles_strip_comments', 'styles_minify', cb);
});

//scripts
gulp.task('scripts', function() {
	return gulp.src(gulprc.patterns.scriptsProject)
		.pipe(plumber(plumberErrorHandler))
		.pipe(concat('main.js'))
		.pipe(gulp.dest('app/build/js'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify())
		.pipe(gulp.dest('app/build/js'));
});

gulp.task('html_replace', function() {
  gulp.src('app/index.html')
    .pipe(htmlreplace({
    	'css': 'app/build/js/main.min.css',
        'js': 'app/build/js/main.min.js'
    }))
    .pipe(gulp.dest('app/index.html'));
});

gulp.task('build', function (cb) {
  runSequence('clean', 'scripts', 'styles', 'html_replace', cb);
});


//watch
gulp.task('live', function() {
	livereload.listen();

	//watch .scss files
	gulp.watch('src/scss/**/*.scss', ['styles']);

	//watch .js files
	gulp.watch('src/js/**/*.js', ['scripts']);

	//reload when a template file, the minified css, or the minified js file changes
	gulp.watch('templates/**/*.html', 'html/css/styles.min.css', 'html/js/main.min.js', function(event) {
		gulp.src(event.path)
			.pipe(plumber())
			.pipe(livereload())
			.pipe(notify({
				title: notifyInfo.title,
				icon: notifyInfo.icon,
				message: event.path.replace(__dirname, '').replace(/\\/g, '/') + ' was ' + event.type + ' and reloaded'
			})
		);
	});
});
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
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	gulprc = require("./gulpfile.json"),
	del = require("del"),
	htmlreplace = require('gulp-html-replace'),
	runSequence = require('run-sequence'),
	stripCssComments = require('gulp-strip-css-comments'),
	connect = require('gulp-connect'),
	webserver = require('gulp-webserver');

gulp.task('serve', function(cb) {
	 return runSequence('clean','scripts_minify','styles_process','webserver', 'watch');
});
	
//the title and icon that will be used for the Grunt notifications
var notifyInfo = {
	title: 'Gulp',
	icon: path.join(__dirname, 'gulp.png')
};

gulp.task('webserver', function() {
  gulp.src('app')
    .pipe(webserver({
      host:'localhost',
      port:9000,
      livereload: true,
      directoryListing: false,
      fallback:'dev_index.html',
      proxies: [{
            source: '/api',
            target: 'http://fota.hillromvest.com/api'
        }],
      open: true
    }));
});


//error notification settings for plumber
var plumberErrorHandler = { errorHandler: notify.onError({
		title: notifyInfo.title,
		icon: notifyInfo.icon,
		message: "Error: <%= error.message %>"
	})
};

//clean build and index file
gulp.task("clean", function () {
  return del(gulprc.patterns.clean, {force: true});
});

//Compress images. Required only in prod
gulp.task('images_compress', function () {
    return gulp.src('app/images/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('app/images'))
        .pipe(connect.reload());
});

//process scss style to css. Required both in dev and prod
gulp.task('styles_process', function() {
	return gulp.src('app/styles/*.scss')
		.pipe(plumber(plumberErrorHandler))
		.pipe(compass({
			css: 'app/build/css',
			sass: 'app/styles/',
			image: 'app/images/',
			comments: false
		}))
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'ie Edge', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulp.dest('app/styles'))
		.pipe(connect.reload());
});

//styles remove comments need only in the build and not in development mode
gulp.task('styles_strip_comments', function() {
	return gulp.src(gulprc.patterns.styles)
		.pipe(plumber(plumberErrorHandler))
		.pipe(stripCssComments({preserve: false}))
		.pipe(gulp.dest('app/build/css'));
});

//styles minify and put them in the build folder app/build/css
gulp.task('styles_minify', function() {
	return gulp.src(gulprc.patterns.styles)
		.pipe(plumber(plumberErrorHandler))
		.pipe(concat('main.css'))
		.pipe(gulp.dest('app/build/css'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(minifycss())
		.pipe(gulp.dest('app/styles'))
		.pipe(connect.reload());
});

//Task to do all style work. Required only in prod
gulp.task('styles', function () {
  return runSequence('styles_process', 'styles_strip_comments', 'styles_minify');
});

//Task to minify scripts from the json file
gulp.task('scripts_minify', function() {
	return gulp.src(gulprc.patterns.scriptsProject)
		.pipe(plumber(plumberErrorHandler))
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify())
		.pipe(gulp.dest(function(file) {
		    return file.base;
		}))
		.pipe(connect.reload());
});

//Task to concatenate scripts files
//Task to minify scripts from the json file. Only required in prod
gulp.task('scripts_concat', function() {
	return gulp.src(gulprc.patterns.scriptsProject)
		.pipe(plumber(plumberErrorHandler))
		.pipe(concat('main.js'))
		.pipe(gulp.dest('app/build/js'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify())
		.pipe(gulp.dest('app/build/js'));
});

gulp.task('watch', function () {
  gulp.watch(['./app/scripts/*.js'], ['scripts_minify']);
  gulp.watch(['./app/styles/*.scss'], ['styles_process']);
  gulp.watch(['./app/**/*.html'], []);
});

//html replace with js and css
gulp.task('html_replace', function() {
  return gulp.src('app/index.html')
    .pipe(htmlreplace({
    	'css': 'styles/main.min.css',
        'js': 'build/js/main.min.js'
    }))
    .pipe(gulp.dest('app/'));
});

gulp.task('build', function (cb) {
  runSequence('clean', ['scripts_minify','scripts_concat', 'styles', 'html_replace'], cb);
});

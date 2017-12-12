/**********


 *********/

var config      = require('./config.json');
var fs          = require('fs');
var gulp        = require('gulp');
var uglify      = require('gulp-uglify');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var sourcemaps  = require('gulp-sourcemaps');
var copy        = require('gulp-copy');
var concat      = require('gulp-concat');
var prompt      = require('gulp-prompt');
var merge       = require('merge-stream');
var autoprefixer= require('gulp-autoprefixer');
var cleanCSS    = require('gulp-clean-css');
var rename      = require("gulp-rename");
var babel       = require('gulp-babel');
var notify      = require("gulp-notify");
var plumber     = require('gulp-plumber');

var bases = {
    theme:  'wp-content/themes/' + config.projectName + '/',
    css:    'wp-content/themes/' + config.projectName + '/css/',
    sass:   'wp-content/themes/' + config.projectName + '/src/sass/',
    js:     'wp-content/themes/' + config.projectName + '/js/',
    es:     'wp-content/themes/' + config.projectName + '/src/js',
};

gulp.task('custom-config', function() {

    if(!config.projectName) {
        gulp.src('*').pipe(prompt.prompt({
            type: 'input',
            name: 'projectName',
            message: 'Name of project'
        }, function(user) {
            config.projectName = user.projectName;
            fs.writeFile('config.json', JSON.stringify(config), 'utf8');
        }));
    }
});

gulp.task('custom-theme', function() {
    fs.access('wp-content/themes/' + config.projectName, function(doesntExist) {
        if(doesntExist) {
            gulp  
                .src('wp-content/themes/wp_scaff/**/*.*')
                .pipe(gulp.dest('wp-content/themes/' + config.projectName + '/'));

            console.log('created!');
        }
    });
});

gulp.task('customize', ['custom-config', 'custom-theme']);

gulp.task('concat', function () {
    return gulp.src('src/js/**/*.js')
        .pipe(concat('all.js'))
        .pipe(uglyfy())
        .pipe(gulp.dest('public/js'));
});

gulp.task('vendor', function () {
    return gulp.src([
        'node_modules/jquery/dist/jquery.js',                       //  jQuery
        'node_modules/foundation-sites/dist/js/foundation.js',      //  Foundation
    ])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(bases.js))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(bases.js));
});


gulp.task('scripts', function () {

    return gulp.src([
        bases.es + '**/*.js'
    ])
    .pipe(babel({
        presets: ['es2015']
    })
    .on('error', function(err) {
        console.log(err.message);
          notify.onError({
            title:    "Gulp Sass",
            subtitle: err.message,
            message:  "Error"
          })(err);
          this.emit('end');
        }))
    .on('error', function(e) {notify(e.message, 5000); console.log(e.message)})
    .pipe(concat('main.js'))
    .pipe(gulp.dest(bases.js))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(bases.js));
});

gulp.task('sass', function () {

    var sassStream, cssStream;
    var onError = function(err) {
        console.log(err.message);
          notify.onError({
            title:    'Gulp SASS error',
            message:  err.message
          })(err);
          this.emit('end');
        };

    sassStream = gulp.src(bases.sass + 'main.scss')
        .pipe(plumber({errorHandler: onError}))
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: [sass, './node_modules/foundation-sites/scss', './node_modules/slick-carousel/slick/slick.scss', './node_modules/slick-carousel/slick/slick-theme.scss']
        }))
        .pipe(gulp.dest(bases.css))
        .pipe(rename({suffix: '.min'}))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(bases.css))
        .pipe(sourcemaps.write('./'));


    cssStream = gulp.src([
        './node_modules/slick-carousel/slick/slick.css',
        './node_modules/slick-carousel/slick/slick-theme.css',
        './node_modules/lity/dist/lity.css',
        './node_modules/video.js/dist/video-js.css',
    ])
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(bases.css))
        .pipe(rename({suffix: '.min'}))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(bases.css));
});


gulp.task('autoprefixer', function () {
    return gulp.src('src/css/**/*.css')
        .pipe(autoprefixer({
            browsers: ['> 1%', 'last 5 version'],
            cascade: false
        }))
        .pipe(gulp.dest('src/css'));
});

gulp.task('minify-css', function () {
    return gulp.src(bases.css + '**/*.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(bases.css));
});


gulp.task('watch', function (event, file) {

    const server = browserSync.init({
        proxy: "http://localhost:8888" + config.projectDir
    });

    gulp.watch([bases.theme + "**/*.php"],          browserSync.reload);
    gulp.watch([bases.theme + "**/*.version"],      browserSync.reload);
    gulp.watch([bases.es + "**/*.js"], ["scripts",  browserSync.reload]);
    gulp.watch([bases.sass + "**/*.scss"],          ['sass']);
    gulp.watch(bases.css + "main.css", function() {
        gulp.src(bases.css + "main.css")
        .pipe(browserSync.stream());
     });

});

gulp.task('default', ['customize','vendor','scripts','sass','watch']);
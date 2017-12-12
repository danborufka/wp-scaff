/**********


 *********/

const config      = require('./config.json');
const gulp        = require('gulp'),
const uglify      = require('gulp-uglify'),
const browserSync = require('browser-sync').create(),
const sass        = require('gulp-sass'),
const sourcemaps  = require('gulp-sourcemaps'),
const copy        = require('gulp-copy'),
const concat      = require('gulp-concat'),
const prompt      = require('gulp-prompt'),
const merge       = require('merge-stream'),
const autoprefixer= require('gulp-autoprefixer'),
const cleanCSS    = require('gulp-clean-css'),
const rename      = require("gulp-rename"),
const babel       = require('gulp-babel'),
const notify      = require("gulp-notify"),
const plumber     = require('gulp-plumber');

var bases = {
    theme:  'wp-content/themes/' + config.projectName + '/',
    css:    'wp-content/themes/' + config.projectName + '/css/',
    sass:   'wp-content/themes/' + config.projectName + '/src/sass/',
    js:     'wp-content/themes/' + config.projectName + '/js/',
    es:     'wp-content/themes/' + config.projectName + '/src/js',
};


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
        'node_modules/slick-carousel/slick/slick.js',               //  Slick
        'node_modules/gsap/TweenMax.js',                            //  GSAP
        // 'node_modules/countup.js/dist/countUp.js',               //  Countiup
        // 'node_modules/in-view/dist/in-view.min.js',              //  in-view
        // 'node_modules/vissense/dist/vissense.js',                //  vissense (Visivle in Dom)
        'node_modules/chart.js/dist/Chart.js',                   //  chart.js
        'node_modules/parsleyjs/dist/parsley.js',                //  parsley.js
        'node_modules/parsleyjs/dist/i18n/en.js',                //  parsley.js
        'node_modules/parsleyjs/dist/i18n/de.js',                //  parsley.js
        'node_modules/parsleyjs/dist/i18n/ru.js',                //  parsley.js
        // 'node_modules/video.js/dist/video.js',                   //  video.js
        // 'node_modules/lodash/lodash.js',                         //  lodash
        // 'node_modules/gsap/TweenMax.js',                			//
        // 'node_modules/gsap/src/uncompressed/plugins/ScrollToPlugin.js',                       			//
        // 'node_modules/scrollmagic/scrollmagic/uncompressed/ScrollMagic.js',            
        // 'node_modules/scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js',                       			//
        // 'node_modules/scrollmagic/scrollmagic/plugins/jquery.ScrollMagic.js',                       			//
        // 'node_modules/photoswipe/dist/photoswipe.js',                       			//
        // 'node_modules/photoswipe/dist/photoswipe-ui-default.js',                       			//
        // 'node_modules/masonry-layout/dist/masonry.pkgd.js',      //  Foundation
        // 'node_modules/jquery/dist/jquery.min.js',                       //  jQuery
        // 'node_modules/foundation-sites/dist/js/foundation.min.js',      //  Foundation
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
        proxy: "http://localhost:8888/" + config.projectDir
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

gulp.task('default', ['vendor', 'scripts', 'sass', 'watch']);
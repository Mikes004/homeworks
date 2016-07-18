var gulp = require('gulp'),
	less = require('gulp-less'),
	watch = require('gulp-watch'),
    concat = require('gulp-concat'),
    cleanCSS = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    sourcemaps = require('gulp-sourcemaps'),
    reload      = browserSync.reload,
    uglify = require('gulp-uglify'),
    cache = require('gulp-cache'),
    imagemin = require('gulp-imagemin'),
    eslint = require('gulp-eslint');

gulp.task('compile-less', function() {
    gulp.src('./src/less/**/*.less')
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(concat('all.min.css'))
        .pipe(gulp.dest("./dist/css/"))
        .pipe(reload({stream: true}))
});

gulp.task('compile-less-live', function() {
    gulp.src('./src/less/**/*.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(concat('all.min.css'))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./dist/css/"))
});

gulp.task('compress-js', function() {
    gulp.src('./src/js/**/*.js')
        .pipe(concat('all.min.js'))
        .pipe(gulp.dest("./dist/js/"))
        .pipe(reload({stream: true}))
});

gulp.task('compress-js-live', function() {
    gulp.src('./src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('all.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./dist/js/"))
});

gulp.task('watch-js', function() {
    gulp.watch('./src/js/**/*.js' , ['compress-js']);
});

gulp.task('watch-less', function() {
    gulp.watch('./src/less/**/*.less' , ['compile-less']);
});

gulp.task('watch-html', function() {
    gulp.watch("./**/*.html", ['copy-to-dist']);
});

gulp.task('compress-img-live', function() {
    gulp.src(["./src/img/*"], {base: './src'})
        .pipe(cache(imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('./dist/'));
});


gulp.task('browser-sync', function() {
    var files = [
        './**/*.html',
        './css/**/*.css',
        './js/**/*.js'
    ];

    browserSync.init(//files,
        {
        server: {
            baseDir: './dist/'
        }
    });
});

gulp.task('copy-to-dist', function () {
        gulp.src(["./src/**/*.html"], {base: './src'})
            .pipe(gulp.dest('./dist'))
            .pipe(reload({stream: true}));
    }
);

gulp.task('eslint', function() {
    return gulp.src(['./src/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});



gulp.task('default', [
    'browser-sync',
    'compile-less', 'watch-less',
    'compress-js', 'watch-js',
    'watch-html'
]);


gulp.task('live', [
    'compile-less-live',
    'compress-js-live',
    'compress-img-live',
    'eslint'
]);
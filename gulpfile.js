const { src, dest, watch, parallel, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const del = require('del')

function browsersync() {
  browserSync.init({
    server: { baseDir: 'src/' },
    online: true,
  })
}

function clean() {
  return del('dist')
}

function images() {
  return src('src/img/**/*')
    .pipe(imagemin())
    .pipe(dest('dist/img'))
}

function styles() {
  return src('src/sass/main.sass')
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 10 version'],
      grid: true,
    }))
    .pipe(dest('src/css'))
    .pipe(browserSync.stream())
}

function build() {
  return src([
    'src/css/style.min.css',
    'src/fonts/**/*',
    'src/**/*.html ',
  ], { base: 'src' })
    .pipe(dest('dist'))
}

function watching() {
  watch(['src/sass/**/*.sass'], styles)
  watch(['src/**/*.html']).on('change', browserSync.reload)
}

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.images = images;
exports.clean = clean;

exports.build = series(clean, images, build);
exports.default = parallel(browsersync, watching)

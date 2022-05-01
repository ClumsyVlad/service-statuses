const { src, dest, watch, parallel, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
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

function scripts() {
  return src('src/js/*.js')
    .pipe(dest('dist/js'))
    .pipe(dest('docs/js'))
    .pipe(browserSync.stream())
}

function build() {
  return src([
    'src/css/style.min.css',
    'src/fonts/**/*',
    'src/**/*.html ',
    'src/**/*.js ',
  ], { base: 'src' })
    .pipe(dest('dist'))
    .pipe(dest('docs'))
}

function watching() {
  watch(['src/sass/**/*.sass'], styles)
  watch(['src/js/**/*.js'], scripts)
  watch(['src/**/*.html']).on('change', browserSync.reload)
}

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.clean = clean;

exports.build = series(clean, build);
exports.default = parallel(build, browsersync, watching)

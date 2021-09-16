const { series, parallel, src, dest, watch } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const babel = require("gulp-babel");
sass.compiler = require("node-sass");
const cssnano = require("gulp-cssnano");
const autoprefixer = require("gulp-autoprefixer");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");
const sourcemaps = require("gulp-sourcemaps");
const clean = require("gulp-clean");
const kit = require("gulp-kit");
const browserSync = require("browser-sync").create();
const reload = browserSync.reload;

const paths = {
  html: "./html/**/*.kit",
  sass: "./src/sass/**/*.scss",
  cssDist: "./dist/css",
  js: "./src/js/**/*.js",
  jsDist: "./dist/js",
  images: "./src/images/*",
  imagesDist: "./dist/images",
  dist: "./dist",
};

function javaScript(cb) {
  src(paths.js)
    .pipe(sourcemaps.init())
    .pipe(babel({ presets: ["@babel/env"] }))
    .pipe(uglify())
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(sourcemaps.write())
    .pipe(dest(paths.jsDist));
  cb();
}

function sassCompiler(cb) {
  src(paths.sass)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(cssnano())
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(sourcemaps.write())
    .pipe(dest(paths.cssDist));
  cb();
}

function minify(cb) {
  src(paths.images).pipe(imagemin()).pipe(dest(paths.imagesDist));
  cb();
}

function handleKits(done) {
  src(paths.html).pipe(kit()).pipe(dest("./"));
  done();
}

function cleanStuff(done) {
  src(paths.dist, { read: false }).pipe(clean());
  done();
}

function startBrowserSync(done) {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });
  done();
}

function watchForChanges(cb) {
  watch("./*.html").on("change", reload);
  watch(
    [paths.html, paths.sass, paths.js],
    parallel(handleKits, sassCompiler, javaScript)
  ).on("change", reload);
  watch(paths.images, minify).on("change", reload);
  cb();
}

const mainFunctions = parallel(handleKits, sassCompiler, javaScript, minify);
exports.cleanStuff = cleanStuff;
exports.default = series(mainFunctions, startBrowserSync, watchForChanges);

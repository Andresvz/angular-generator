var gulp = require("gulp");
var babel = require("gulp-babel");
var concat = require("gulp-concat");


gulp.task("default", function () {
  return gulp.src("src/**/*.js")
  .pipe(babel())
  .pipe(concat("bundle.js"))
  .pipe(gulp.dest("dist"));
});

gulp.task('vendor', function(done) {
  var vendorFiles = require('./vendor.json');

  return gulp.src(vendorFiles)
  .pipe(concat('vendor.js'))
  .pipe(gulp.dest("dist"));
});


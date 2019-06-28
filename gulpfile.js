var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');
var imagemin = require('gulp-imagemin');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var del = require('del');
var htmlmin = require('gulp-htmlmin');
var fileinclude = require('gulp-file-include');

gulp.task('styles', function() {
  var generateSccs =  function (sourceFile,destFile){
    gulp.src([sourceFile])
    .pipe(plumber({
        errorHandler: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))
    .pipe(sass({outputStyle: 'expanded', sourceComments: 'map'}))
    .pipe(concat(destFile))
    .pipe(gulp.dest('source/css'))
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(concat(destFile))
    .pipe(gulp.dest('dist/css'));
  }

  generateSccs('source/css/source.scss','site-styles.css');

});

gulp.task('html', function() {
    gulp.src('source/templates/*.html')
    .pipe(plumber({
        errorHandler: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('source/'))

    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist/'));
});

gulp.task('js', function() {

  gulp.src([
    'node_modules/requirejs/require.js'
  ])
  .pipe(concat('require.js'))
  .pipe(gulp.dest('source/js'))
  .pipe(uglify())
  .pipe(gulp.dest('dist/js'));


  gulp.src([
    'source/js/config.js',
    'source/js/**/*.js' ,
    '!source/js/libs/**/*.*',
    '!source/js/require.js',
    '!source/js/main.js'
  ])
  .pipe(plumber({
      errorHandler: function (err) {
          console.log(err);
          this.emit('end');
      }
  }))
  .pipe(concat('main.js'))
  .pipe(gulp.dest('source/js'))
  .pipe(uglify())
  .pipe(gulp.dest('dist/js'));
});

gulp.task('libs', function() {
  gulp.src([
    'source/libs/**/*.*'
  ])
  .pipe(gulp.dest('dist/libs'));
});

gulp.task('fonts', function() {
  gulp.src(['source/css/fonts/*.*'])
    .pipe(gulp.dest('dist/css/fonts'));
});

gulp.task('img', function() {
  gulp.src('source/assets/img/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/assets/img'));
});

gulp.task('watch',function() {
    gulp.watch(['source/**/*.html', '!source/*.html'],['html']);
    gulp.watch(['source/assets/img/*/**'],['img']);
    gulp.watch(['source/css/fonts/*.*'],['fonts']);
    gulp.watch(['source/css/**/*.scss' ],['styles']);
    gulp.watch(['source/libs/**/*' ],['libs']);
    gulp.watch(['source/js/**/*.js', '!source/js/require.js','!source/js/site/main.js'],['js']);
});

gulp.task('default',function(cb) {
    runSequence(['html' , 'img' ,  'libs' , 'fonts' , 'styles', 'js'], cb);
});

"use strict";

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    gutil = require("gulp-util"),
    rename=require("gulp-rename");
    
  var paths={
       src:"./js/*.js",
       dist:"dist"      
   }
  gulp.task("default",function(cb){
     return gulp.src('./js/*.js')
    .pipe(uglify())
     .pipe(rename({
            suffix: '.min'
        }))
    .pipe(gulp.dest('dist'));
  });
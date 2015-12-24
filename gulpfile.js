"use strict";

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    gutil = require("gulp-util"),
    rename = require("gulp-rename"),
    license=require("uglify-save-license");

var version = "1.0" //当前版本号
var now = new Date();  //构建日期
var date = now.getFullYear() + "." + (now.getMonth() + 1) + "." + now.getDate()

var paths = {
    src: "./src/*.js",
    dist: "dist",
    name:"jquery.keypopup.js"
}

gulp.task("default", function (cb) {    
    return gulp.src(paths.src)
        .pipe(concat(paths.name))               
        .pipe(uglify({preserveComments:license}))
        .pipe(rename({
            suffix: '-'+version+'.min'
        }))        
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
    gulp.watch(paths.src, ['default']);
});
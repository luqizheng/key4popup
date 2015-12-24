"use strict";

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    gutil = require("gulp-util"),
    rename = require("gulp-rename");

var version = "1.0" //当前版本号
var now = new Date();  //构建日期
var date = now.getFullYear() + "." + (now.getMonth() + 1) + "." + now.getDate()

var paths = {
    src: "./js/*.js",
    dist: "dist"
}

gulp.task("default", function (cb) {    
    return gulp.src(paths.src)        
        .pipe(uglify())
        .pipe(rename({
            suffix: '-'+version+'.min'
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
    gulp.watch(paths.src, ['default']);   //监听 RAW/js 下的全部.js文件，若有改动则执行名为'minjs'任务
});
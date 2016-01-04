"use strict";

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    gutil = require("gulp-util"),
    rename = require("gulp-rename"),
    license = require("uglify-save-license"),
    tsc = require("gulp-typescript"),
    webpack = require("webpack"),
    gfi = require("gulp-file-insert");;
var version = "1.1" //当前版本号
var now = new Date();  //构建日期
var date = now.getFullYear() + "." + (now.getMonth() + 1) + "." + now.getDate()

var gulpInsert = {
    "/* summary */": "./src/0.summary.js",
    "/* _cursorMgr.js */": "./src/_cursorMgr.js",
    "/* _eventHandler.js */": "./src/_eventHandler.js",
    "/* _MatcherInfo.js */": "./src/_MatchInfo.js",
    "/* _matcher.js */": "./src/_matcher.js",
    "/* _pubEvent.js */": "./src/_pubEvent.js",
    "/* _layout.js */": "./src/_layout.js"
};

var jqueryInsert = JSON.parse(JSON.stringify(gulpInsert));
jqueryInsert["/* extendLib.js */"] = "./src/jquery/extendLib.js"

var avalonInsert = JSON.parse(JSON.stringify(gulpInsert));
avalonInsert["/* extendLib.js */"] = "./src/avalon/extendLib.js"

gulp.task('default',["clean:js"],function(){
    gulp.run(['avalon:min', 'jquery:min', 'jquery', 'avalon']);
});

gulp.task("clean:js", function (cb) {
    rimraf("dist", cb);
});
gulp.task("avalon:min", function (cb) {
    //avalon
    return gulp.src("./src/avalon/keypopup.js")
        .pipe(concat("avalon.keypopup.js"))
        .pipe(gfi(avalonInsert))
        .pipe(rename({
            suffix: '-' + version + '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
})

gulp.task("jquery:min", function (cb) {

    var result = gulp.src("./src/jquery/keypopup.js")
        .pipe(concat("jquery.keypopup.js"))
        .pipe(gfi(jqueryInsert))
        .pipe(rename({
            suffix: '-' + version + '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));

    return result;
})
gulp.task("jquery", function (cb) {
    var result = gulp.src("./src/jquery/keypopup.js")
        .pipe(concat("jquery.keypopup.js"))
        .pipe(gfi(jqueryInsert))
        .pipe(rename({
            suffix: '-' + version
        }))
        .pipe(gulp.dest('dist'));

    return result;
})

gulp.task("avalon", function (cb) {
    //avalon
    return gulp.src("./src/avalon/keypopup.js")
        .pipe(concat("avalon.keypopup.js"))
        .pipe(gfi(avalonInsert))
        .pipe(rename({
            suffix: '-' + version
        }))
        .pipe(gulp.dest('dist'));
})

gulp.task('watch', function () {
    gulp.watch(["./src/**", "./example/"], ['default']);
});
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
    webpack = require("webpack");
var version = "1.0" //当前版本号
var now = new Date();  //构建日期
var date = now.getFullYear() + "." + (now.getMonth() + 1) + "." + now.getDate()

var paths = {
    jquery: "./src/jquery*.js",
    avalon: "",
    util: [],
    dist: "dist",
    jqueryName: "jquery.keypopup.js"
}
var util = ["_cursorMgr.js", "_eventHandler.js", "_pubMethod.js", "_matcher.js", "_pubEvent.js", "_layout.js"];

var jqueryDist = {
    start: "jquery/header.txt",
    end: "jquery/end.txt",
    name: "jquery.keypopup.js",
    main: "jquery/keypopup.js",
    extends: "jquery/extendLib.js",
    util: util
}

var avalonDist = {
    start: "avalon/header.txt",
    end: "avalon/end.txt",
    name: "avalon.keypopup.js",
    main: "avalon/keypopup.js",
    extends: "avalon/extendLib.js",
    util: util

}


function Make(pathInfo) {
    var result = ["0.summary.js", pathInfo.start, pathInfo.main, pathInfo.extends];
    result = result.concat(pathInfo.util);
    result.push(pathInfo.end);
    for (var i = 0; i < result.length; i++) {
        result[i] = './src/' + result[i];
        console.log(result[i])
    }
    return result;
}

gulp.task("default", function (cb) {

    var runs = Make(jqueryDist);
    //build jquery.
    var result = gulp.src(runs, { base: "./src/" })
        .pipe(concat(jqueryDist.name))
        .pipe(rename({
            suffix: '-' + version + '.min'
        }))
        //.pipe(uglify())
        .pipe(gulp.dest('dist'));
    // build avalon; 
    runs = Make(avalonDist);
    result = gulp.src(runs, { base: "./src/" })
        .pipe(concat(avalonDist.name))
        .pipe(rename({
            suffix: '-' + version + '.min'
        }))
        //.pipe(uglify())
        .pipe(gulp.dest('dist'));
    return result;
});

gulp.task('watch', function () {
    gulp.watch(["./src/**", "./example/"], ['default']);
});
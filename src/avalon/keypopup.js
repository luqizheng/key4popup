/* summary */


/// <reference path="../_MatchInfo.js" />
/// <reference path="../_globalDefined.js" />
/// <reference path="../_eventHandler.js" />
//闭包执行一个立即定义的匿名函数
!function (factory) { //http://chen.junchang.blog.163.com/blog/static/6344519201312514327466/

    //factory是一个函数，下面的koExports就是他的参数

    // Support three module loading scenarios
    if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        // [1] CommonJS/Node.js
        // [1] 支持在module.exports.abc,或者直接exports.abc
        //var target = module['exports'] || exports; // module.exports is for Node.js
        //var avalon = require("avalon");
        //factory(avalon);
        define(function(){
            factory(require("avalon"));
        })
    } else if (typeof define === 'function' && define['amd']) {
        // [2] AMD anonymous module
        // [2] AMD 规范 
        //define(['exports'],function(exports){
        //    exports.abc = function(){}
        //});
        define(['avalon'], factory);
    } else {
        // [3] No module loader (plain <script> tag) - put directly in global namespace
        factory(window['avalon']);
    }
} (function (avalon) {
    
    /* global */
    avalon.component("ms:keypopup", {
        $init: function (vm, ele) {
            vm.$ta = ele.innerHTML;
            var layoutEle = document.getElementById(layoutId)
            if (layoutEle == null) {
                document.body.appendChild(avalon.parseHTML(layout).childNodes[0]);
                layoutEle = document.getElementById(layoutId)
            }
            vm._layout = layoutEle;

        },
        $replace: 1,
        $ta: "",
        $$template: function (vm, ol) {
            return this.$ta.replace(">", 'ms-on-keyup="_keyup($event)" ms-on-keydown="_keydown($event)" ms-on-mouseup="_mouseup($event)" on-init="onInit">');
        },
        $ready: function (vm, ele) {
            vm.matchInfo = new MatchInfo(ele, vm);
            vm.matchInfo.content = ele.value;
            vm.onCursorChanged(vm.matchInfo);           
            //vm._mouseleave = hd;
            function hd(e) {
                return globalEventHandler(vm, e)
            }
            vm._keyup = hd;
            vm._keydown = hd;
            vm._mouseup = hd;
        },
        _state: 0,
        _keyup: false,
        _keydown: false,
        _mouseup: false,
        _layout: null,
        onMatch: false, // match pop up condition
        onMiss: false, // missmatch ,
        onFocus: false, //for select start.
        onDefault: false, //use press to select the first one. it should  return default one.        
        onInit: avalon.noop,//这个应该被抛弃
        onCursorChanged: avalon.noop,//当游标改变的时候，就会发出这个时间
        matches: [{
            start: "@",
            end: " ",
            isMatch: function (e) {
                return e.which === 50 && e.shiftKey;
            }
        },
            {
                start: "#",
                end: "# ",
                isMatch: function (e) {
                    return e.which === 51 && e.shiftKey;
                }
            }
        ],
        matchInfo: null
    })

  
    /* gulp file inert* DO NOT REMOVE FOLLOWING COMMENT*/
  
    /* _pubEvent.js */
    /* _MatcherInfo.js */
    /* _cursorMgr.js */
    /* _eventHandler.js */
    /* _layout.js */
    /* _matcher.js */
    /* extendLib.js */

});


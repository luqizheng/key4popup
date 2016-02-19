/*!
jquery.keypopup Copyright(c) 2011 Leo.lu  MIT Licensed
https://github.com/luqizheng/key4popup 
*/


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
    
    var layoutId = "_keypopup_"
var layout = '<div id="' + layoutId + '" style="position:absolute;width;z-index:-99999;overflow:hidden;visibility:hidden;word-wrap:break-word;word-break:normal;"/>';
function log() {
    if (window.console) {
        // http://stackoverflow.com/questions/8785624/how-to-safely-wrap-console-log
        Function.apply.call(console.log, console, arguments)
    }
}

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
  
    /// <reference path="_layout.js" />
/// <reference path="_MatchInfo.js"/>
var _pubEvent = {
    match: {
        create: function () {
            return {
                invoke: function (options, matchInfo) { //defnined matcher.byCursor,
                    _setMatchInfoAndCall(options, matchInfo)
                    _callEvent(options, "onMatch", 1)
                },
                bubby: false
            }
        }

    },
    cursorChanged: {
        create: function (matchInfo) {
            return {
                matchInfo: matchInfo,
                invoke: function (options, matchInfo) {
                    _setMatchInfoAndCall(options, matchInfo)
                    _callEvent(options, "onCursorChanged");
                },
                bubby: true
            }
        }
    },
    miss: {
        create: function () {
            return {
                invoke: function (options) {
                    _callEvent.call(this, options, "onMiss", 0)
                },
                bubby: true
            }
        }
    },
    focus: {
        create: function () {
            return {
                invoke: function (options) {
                    _callEvent.call(this, options, "onFocus", 0)
                },
                bubby: false
            }
        }
    },
    "default": {
        create: function () {
            return {
                invoke: function (options) {
                    var d = _callEvent.call(this, options, "onDefault", 1);
                    if (d) {
                        options.matchInfo.self.blur();
                        options.matchInfo.set(d);                        
                        options.matchInfo.self.focus();
                    }
                },
                bubby: false
            }
        }
    }
};

var _setMatchInfoAndCall = function (options, matchInfo) {
    if (options.matchInfo.key) {
        options.matchInfo.hide();
    }
    options.matchInfo = matchInfo;
}

var _callEvent = function (options, pubEvent, resetState) {
    if (!options[pubEvent]) {
        log("please define" + pubEvent + " fucntion  in options")
    }
    if (resetState !== undefined)
        options._state = resetState;
    return options[pubEvent].call(this, options.matchInfo);
}
    /// <reference path="_cursorMgr.js" />

function MatchInfo(textarea, options) {
    this.self = textarea
    this.options = options;
    this.key = "";
    this.start = "";
    this.end = "",
    this.content = "",
    this.offset = function () {
        this.left;
        this.top;
    },
    this.scrollTop = 0;
    this.set = function (strName) {        
        var self = this.self,
            options = this.options,
            matchInfo = this,
            tagName = matchInfo.start + strName + matchInfo.end
            , layoutLength = matchInfo.content.substr(0, matchInfo.content.length - matchInfo.key.length).length
            , srcContent = self.value
            , start = srcContent.substr(0, layoutLength)
            , end = srcContent.substr(layoutLength + matchInfo.key.length)
            , result = start + tagName + end; //add space avoid popup panel again.        
        self.value = result;
        options._state = 0;
        options.onMiss.call(self);
        _cursorMgr.setPos.call(self, layoutLength + tagName.length, matchInfo.scrollTop, matchInfo);
    }
    this.hide = function () {
        var options = this.options;
        //var matchInfo = this.options.matchInfo;
        _pubEvent.miss.create().invoke.call(this.self, options)
        //_cursorMgr.setPos.call(this.self, matchInfo.content.length,matchInfo.scrollTop);
    }
    this.focus = function () {        
        _pubEvent.miss.create().invoke.call(this.self, this.options);
    }
    this.isMatch = function () {
        return !!this.key;
    }

}
    
/// <reference path="./lib/lib.d.ts" />


var _cursorMgr = {
    //this必须是 textarea对象 
    getSelection: function () {
        var content, self = this;
        if (window.getSelection) {								
            //statnd browser;        
            content = self.value.substring(0, self.selectionEnd);
        } else {
            //for ie 678            
            var range = document.selection.createRange(),
                dup_range = range.duplicate();
            dup_range.moveToElementText(self);
            dup_range.setEndPoint('EndToEnd', range);
            content = dup_range.text;
        }
        return content;
    },
    setPos: function (newLength, scrollTop) {
        var self = this;
        self.focus();
        self.scrollTop = scrollTop
        if (window.getSelection) {

            self.selectionStart = self.selectionEnd = newLength;
        }
        else if (self.createTextRange) {

            var range = self.createTextRange()
                , action = 'character'
            range.collapse(true);
            range.moveStart(action, newLength);
            range.select();
        }
        //fireEvent(self);
    }
}
/*
function fireEvent(element) {
    var event; // The custom event that will be created

    if (document.createEvent) {
        event = document.createEvent("KeyboardEvent");
        event.initEvent("keydown", true, true);
    } else {
        event = document.createEventObject();
        event.eventType = "keydown";
    }
    event.keyCode = 32;
    event.which=32;
    event.eventName = "keydown";

    if (document.createEvent) {
        element.dispatchEvent(event);
    } else {
        element.fireEvent("on" + event.eventType, event);
    }
}*/
    /// <reference path="_matcher.js" />
/// <reference path="_layout.js" />
/// <reference path="_pubEvent.js"/>
//return miss, onMatch,onFouce
//miss, match,focus,
//matchInfo
var event_name_noop = "noop",
    event_name_miss = "miss",
    event_name_focus = "focus",
    event_name_default = "default",
    event_name_match = "match";
// bind to keyup,keydown mouseup
function globalEventHandler(options, e) {

    var self =
        e.target, bubby = true,
        obj = _eventHandler[e.type].call(self, e, options),
        info;
    if (obj.matchInfo) {
        _pubEvent.cursorChanged.create().invoke.call(self, options, obj.matchInfo);
    }
    if (obj.eventName != event_name_noop) {
        info = _pubEvent[obj.eventName].create();
        bubby = info.bubby;
        info.invoke.call(self, options, obj.matchInfo);
    }

    if (!bubby) {
        e.preventDefault();
        e.stopPropagation();        
        return false;
    }
}

var _eventHandler = {
    keydown: function (e, options) {        
        var evnName = event_name_noop,
            inputKey =e.keyCode || e.which
        if (options._state == 1) { //had execute onMatch, it should pop up the menu, but DONOT　fosuc on int.
            if (inputKey == 40) { //press-down
                evnName = event_name_focus//focus the popup menu.
            } else if (inputKey == 13) { //input enter get the popup menut default value;
                evnName = event_name_default;
            }
        }
        return {//keydown不需要处理info
            eventName: evnName,
            matchInfo: false
        }
        //return _eventKey[evnName].create();
    },
    keyup: function (e, options) {
        //handler curosr in textarea.
        var inputKey = e.which,
            //inputByIme = inputKey == 229,  //microsoft ime return 229.;
            isCursorCtrlKey = inputKey == 38 || inputKey == 39 || inputKey == 40 || inputKey == 37 || inputKey == 8,
            eventName = event_name_noop,
            matchInfo = _matcher.byCursor.call(this, options, isCursorCtrlKey ? 1 : 0) //get the matcherInfo            
        // up down left,right,BackSpace
                                                
        if (inputKey == 27 || inputKey == 32) {//ESC or space
            eventName = event_name_miss
        }
        else if (matchInfo.isMatch()) { //if match keyup condition, key should have value, such as @ or #
            eventName = event_name_match;
        }
        //return _eventKey[eventName].create(matchInfo);
        return {
            eventName: eventName,
            matchInfo: matchInfo
        }
    },
    mouseup: function (e, options) {
        _layout.reset.call(this, options);
        var info = _matcher.byCursor.call(this, options);
        //return _eventKey[info.isMatch() ? "match" : "noop"].create(info);
        return {
            matchInfo: info,
            eventName: info.isMatch() ? event_name_match : event_name_noop
        }
    } 
}

    
var atId;
var _layout = {
    reset: function (options) {
        var self = this, offset = _extendLib.offset(self);
        _extendLib.setSizePos(options._layout, {
            width: self.clientWidth,
            height: self.clientHeight,
            left: offset.left,
            top: offset.top
        })
    },    
    /**
     * @param  {any} options
     * @param  {any} matchContent, this value from matcher.checkRange struct is {content:<without key>, key:<key>}
     */
    render: function (options, matchInfo) {

        var content = matchInfo.content.substr(0, matchInfo.content.length - matchInfo.key.length); //内容，不包括                
        var htmlcontent = content.replace(/[\r\n]/g, "<br>").replace(/ /g, "&nbsp;");

        if (!atId) {
            atId = "at" + Math.round(Math.random() * 201) + (new Date()).getTime();
        }
        options._layout.innerHTML = htmlcontent + "<span id='" + atId + "'>" + matchInfo.key + "</span>";
        return atId;
    }
}

    /// <reference path="_cursorMgr.js" />
/// <reference path="_MatchInfo.js" />
var regexMatch = "\\s\\x20-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\x7e\\x80-\\xff\\u3000-\\u3002\\u300a\\u300b\\u300e-\\u3011\\u2014\\u2018\\u2019\\u201c\\u201d\\u2026\\u203b\\u25ce\\uff01-\\uff5e\\uffe5";
var _matcher = { //all matcher fire by it;
    /**
     * fire by cursor in textarea
     * @param  {any} options
     * @param  {any} startLen include 1 charge after the matches[0].start.
     */
    byCursor: function (options, startLen) {
        //render the text which mouse focus to the layout behinde the textarea.
                                    
        var len = startLen === undefined ? 1 : startLen,
            self = this,
            result = new MatchInfo(self, options),
            content = _cursorMgr.getSelection.call(self);
            result.content = content;
            result.scrollTop = self.scrollTop;
        for (var i = 0; i < options.matches.length; i++) {
            var item = options.matches[i];
            var start = item.start;
            var reg = new RegExp(start + "[^" + start + regexMatch + "]{" + len + ",20}$", "gi");
            var matches = content.match(reg);
            if (matches != null) {
                //It should be match.
                //var result = new MatchInfo(self, options)                
                result.key = matches[0];
                result.start = item.start;
                result.end = item.end;              

                var atId = _layout.render.call(this, options, result);
                var tagele = document.getElementById(atId);
                var offset = _extendLib.offset(tagele);
                offset.top += _extendLib.height(tagele) - this.scrollTop;
                result.offset = offset;
                return result;
            }
        }
        return result;
    } 

}
    var _extendLib = {
    offset: function (ele) {
        return avalon(ele).offset();
    },
    setSizePos: function (ele, info) {
        avalon(ele).css(info);
    },
    height:function(ele){
        return avalon(ele).height();
    }

}

});


/*!
jquery.keypopup Copyright(c) 2011 Leo.lu  MIT Licensed
https://github.com/luqizheng/key4popup 
*/

(function () {

    /// <reference path="../_pubMethod.js" />
    /// <reference path="../_pubEvent.js" />
    /// <reference path="../_layout.js" />
    /// <reference path="../_globalDefined.js" />
    
    var layoutId = "_keypopup_"
var layout = '<div id="' + layoutId + '" style="position:absolute;width;z-index:-99999;overflow:hidden;visibility:hidden;word-wrap:break-word;word-break:normal;"/>';
function log() {
    if (window.console) {
        // http://stackoverflow.com/questions/8785624/how-to-safely-wrap-console-log
        Function.apply.call(console.log, console, arguments)
    }
}


    var optKey = "_keypopup",
        defaultOpt = {
            onMatch: false, // match pop up condition
            onMiss: false, // missmatch ,
            onFocus: false, //for select start.
            onDefault: false, //use press to select the first one. it should  return default one.
            onCursorChanged: false,
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
            _state: 0 // 0 nothing , 1 onMatch.
        }


    $.fn.keypopup = function (opt) {

        var options = null,
            self = this[0]
            , $this = this;

        if (typeof opt == "string") {
            options = $this.data(optKey);
            var arg = [].concat([].slice.call(arguments, 1));
            options.matchInfo[opt](arg)
        }
        else {
            options = $.extend({}, defaultOpt, opt)
            createLayout(options);
            _layout.reset.call(self, options);
            $this.data(optKey, options)
                .mouseup(hd)
                .keydown(hd)
                .keyup(hd)

            function hd(e) {
                return globalEventHandler(options, e)
            }

            options.matchInfo = new MatchInfo(self, options);
            options.matchInfo.content = self.value;
            options.onCursorChanged(options.matchInfo);
        }

        function createLayout(options) {

            if (!options._layout) {
                var $keypop = $("#" + layoutId);
                if ($keypop.length == 0) {
                    $keypop = $(layout)
                        .appendTo("body");
                }
                options._layout = $keypop[0]
            }
        }
        return $this;
    }

    /// <reference path="_layout.js" />
/// <reference path="_MatchInfo.js"/>
var _pubEvent = {
    match: {
        create: function () {
            return {
                invoke: function (options, matchInfo) { //defnined matcher.byCursor,
                    __hidePreMatchInfo(options)
                    options.matchInfo = matchInfo;
                    options._state = 1;
                    if (!options.onMatch) {
                        log("please onMatch fucntion  in options")
                    }
                    options.onMatch.call(self, matchInfo);
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
                    __hidePreMatchInfo(options);
                    options.matchInfo = matchInfo;
                    if (!options.onCursorChanged) {
                        log("please onCursorChanged fucntion  in options")
                    }
                    options.onCursorChanged.call(self, matchInfo);
                },
                bubby: true
            }
        }
    },
    miss: {
        create: function () {
            return {
                invoke: function (options) {
                    __defaultCall.call(this,options,"onMiss",0)                    
                },
                bubby: true
            }
        }
    },
    focus: {
        create: function () {
            return {
                invoke: function (options) {
                    __defaultCall.call(this,options,"onFocus",0)
                },
                bubby: false
            }
        }
    },
    "default": {
        create: function () {
            return {
                invoke: function (options) {
                    /*if (!options.onDefault) {
                        log("please onDefault fucntion  in options")
                    }
                    var d = options.onDefault.call(this, options);
                    if (d) {
                        options.matchInfo.set(d);
                    }*/
                    var d=__defaultCall.call(this,options,"onDefault",1);
                    options.matchInfo.set(d);
                },
                bubby: false
            }
        }
    }
};

var __hidePreMatchInfo = function (options) {
    if (options.matchInfo.key) {
        options.matchInfo.hide();
    }
}

var __defaultCall = function (options, pubEvent,resetState) {
    if (!options[pubEvent]) {
        log("please define" + pubEvent + " fucntion  in options")
    }    
    options._state = resetState;
    return options[pubEvent].call(this)
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
    this.isMatch=function(){
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

    }
}
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
            inputKey = e.which
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
        return $(ele).offset();
    },
    setSizePos: function (ele, info) {
        $(ele).css(info);
    },
    height:function(ele){
        return $(ele).height();
    }

}

})(jQuery)
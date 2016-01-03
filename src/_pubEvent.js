/// <reference path="_layout.js" />
/// <reference path="_pubMethod.js"/>

var event_name_noop = "noop",
    event_name_miss = "miss",
    event_name_focus = "focus",
    event_name_default = "default",
    event_name_match = "match";


var _eventKey = {
    match: {
        create: function (matchInfo) {
            return {
                //e: "match",
                matchInfo: matchInfo,
                invoke: function (options, matchInfo) { //defnined matcher.byCursor,                                    
                    _layout.render.call(this, options, matchInfo);
                    var self = this;
                    var tagele = document.getElementById(options.atId);
                    var offset = _extendLib.offset(tagele);
                    offset.top += _extendLib.height(tagele) - this.scrollTop;
                    matchInfo.offset = offset;
                    matchInfo.set = function (newText) {
                        _pubMethod.set.call(self, options, newText)
                    }
                    matchInfo.focus = function () {
                        _pubMethod.focus(self, options)
                    },
                    matchInfo.hide = function () {
                        _pubMethod.hide(self, options)
                    }
                    matchInfo.scrollTop = self.scrollTop;                      
                    options.matchInfo = matchInfo;                  
                    options._state = 1;
                    options.onMatch.call(self, matchInfo);
                },
                bubby: false
            }
        }

    },
    leave: {
        create: function (matchInfo) {
            return {
                matchInfo: matchInfo,
                invoke: function (options, matchInfo) {
                    var self = this;
                    matchInfo.set = function (newText) {
                        _pubMethod.set.call(self, options, newText)
                    }
                    matchInfo.focus = function () {
                        _pubMethod.focus.call(self, options)
                    },
                    matchInfo.hide = function () {
                        _pubMethod.hide.call(self, options)
                    },
                    options._state = 0;
                    options.onLeave.call(self, matchInfo);
                }
            }
        }
    },
    miss: {
        create: function () {
            return {
                //e: "miss",
                invoke: function (options) {
                    options.onMiss.call(this)
                    options._state = 0;  
                },
                bubby: true
            }
        }
    },
    focus: {

        create: function () {
            return {
                //e: "focus",
                invoke: function (options) {
                    if (typeof options.onFocus == "function") {
                        options.onFocus.call(this);
                        options._state = 0;
                    }
                },
                bubby: false
            }
        }
    },
    "default": {
        create: function () {
            return {
                //e: "default",
                invoke: function (options) {
                    var d = options.onDefault.call(this, options);
                    if (d) {
                        _pubMethod.set.call(this, options, d);
                    }
                },
                bubby: false
            }
        }
    },
    "noop": {
        create: function () {
            return {
                //e: "noop",
                invoke: function () { },
                bubby: true,
            }
        }
    }
};
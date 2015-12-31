/// <reference path="_layout.js" />
var event_name_noop = "noop",
    event_name_miss = "miss",
    event_name_focus = "focus",
    event_name_default = "default",
    event_name_match="match";
    
    
var _eventKey = {
    match: {
        create: function (matchInfo) {
            return {
                //e: "match",
                matchInfo: matchInfo,
                invoke: function (options, matchInfo) { //defnined matcher.byCursor,                                    
                    _layout.render.call(this, options, matchInfo);
                    var tagele = document.getElementById(options.atId);
                    var offset = _extendLib.offset(tagele);
                    offset.top += _extendLib.height(tagele) - this.scrollTop;
                    matchInfo.offset = offset;
                    options._state = 1;
                    options.onMatch.call(this,matchInfo);
                },
                bubby: false
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
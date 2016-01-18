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
                        options.matchInfo.set(d);
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
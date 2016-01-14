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
/// <reference path="_layout.js" />
/// <reference path="_MatchInfo.js"/>




var _eventKey = {
    match: {
        create: function (matchInfo) {
            return {
                //e: "match",
                matchInfo: matchInfo,
                invoke: function (options, matchInfo) { //defnined matcher.byCursor,
                    if (options.matchInfo) {
                        options.matchInfo.hide();
                    }
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
    leave: {
        create: function (matchInfo) {
            return {
                matchInfo: matchInfo,
                invoke: function (options, matchInfo) {
                    var self = this;
                    options._state = 0;
                    if (!options.onLeave) {
                        log("please onLeave fucntion  in options")
                    }
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
                    if (!options.onMiss) {
                        log("please onMiss fucntion  in options")
                    }

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
                    if (!options.onFocus) {
                        log("please onMiss fucntion  in options")
                    }
                    options.onFocus.call(this);
                    options._state = 0;
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
                    if (!options.onDefault) {
                        log("please onDefault fucntion  in options")
                    }
                    var d = options.onDefault.call(this, options);
                    if (d) {
                        options.matchInfo.set(d);
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
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

var _eventHandler = {
    keyup: function (e, options) {
        //console.log("keyup-" + e.which)
        var inputKey = e.which,
            //inputByIme = inputKey == 229,  //microsoft ime return 229.;
            isCursorCtrlKey = inputKey == 38 || inputKey == 39 || inputKey == 40 || inputKey == 37 || inputKey == 8,
            eventName = event_name_noop
            ;
        // up down left,right,BackSpace
                                        
        if (inputKey == 27 || inputKey == 32) {//ESC or space
            eventName = event_name_miss
        }
        else {
            var matchInfo = _matcher.byCursor.call(this, options, isCursorCtrlKey ? 1 : 0) //get the matcherInfo            
            if (matchInfo)
                eventName = event_name_match;
        }
        return _eventKey[eventName].create(matchInfo);

    },
    keydown: function (e, options) {
        //console.log("keydown-" + e.which)
        var evnName = event_name_noop, inputKey = e.which;
        if (options._state == 1) { //had execute onMatch, it should pop up the menu, but DONOT　fosuc on int.
            if (inputKey == 40) { //press-down
                evnName = event_name_focus//focus the popup menu.
            }
            if (inputKey == 13) { //input enter get the popup menut default value;
                evnName = event_name_default;
            }
        }
        return _eventKey[evnName].create();
    },
    mouseup: function (e, options) {
        _layout.reset.call(this, options);
        var info = _matcher.byCursor.call(this, options);
        return info ? _eventKey.match.create(info) : _eventKey.noop.create();
    },
    mouseleave: function (e, options) {
        _layout.reset.call(this, options);
        var matchInfo = new MatchInfo(this, options)
        matchInfo.content = _cursorMgr.getSelection.call(this);
        if (!matchInfo.content) {
            matchInfo.content = this.value;
        }
        //console.debug(options.matchInfo.content);
        return _eventKey.leave.create(matchInfo);
    }
}
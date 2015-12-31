/// <reference path="_matcher.js" />
//return miss, onMatch,onFouce
//miss, match,focus,
//matchInfo

var _eventHandler = {
    keyup: function (e, options) {
        console.log("keyup-" + e.which)
        var
            inputByIme = e.which == 229,  //microsoft ime return 229.;
            isCursorCtrlKey = e.which == 38 || e.which == 39 || e.which == 40 || e.which == 37 || e.which == 8,
            eventName = event_name_noop
            ;
        // up down left,right,BackSpace
                                        
        if (e.which == 27 || e.which == 32) {//ESC or space
            eventName = event_name_miss            
        }
        else {
            var matchInfo = (inputByIme || isCursorCtrlKey)
                ? _matcher.byCursor.call(this, options, inputByIme ? 0 : 1)
                : _matcher.always.call(this, options, e)
            if (matchInfo)
                eventName = event_name_match;
        }
        return _eventKey[eventName].create(matchInfo);
        //eventName = matchInfo ? "match" _eventKey.match.create(matchInfo) : _eventKey.noop.create();

    },
    keydown: function (e, options) {
        //console.log("keydown-" + e.which)
        var evnName = event_name_noop;
        if (options._state == 1) { //had execute onMatch, it should pop up the menu, but DONOT　fosuc on int.
            if (e.which == 40) { //press-down
                evnName = event_name_focus//focus the popup menu.
            }
            if (e.which == 13) { //input enter get the popup menut default value;
                evnName = event_name_default;
            }
        }
        return _eventKey[evnName].create();
    },
    mouseup: function (e, options) {
        _layout.reset.call(this, options);
        var info = _matcher.byCursor.call(this, options);
        return info ? _eventKey.match.create(info) : _eventKey.noop.create();
    }
}
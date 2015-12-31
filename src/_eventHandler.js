/// <reference path="_matcher.js" />
//return miss, onMatch,onFouce
//miss, match,focus,
//matchInfo
var _eventHandler = {
    keyup: function (e, options) {

        console.log("keyup-" + e.which)
        var
            matchInfo = null,
            inputByIme = e.which == 229,  //microsoft ime return 229.;
            isCursorCtrlKey = e.which == 38 || e.which == 39 || e.which == 40 || e.which == 37 || e.which == 8;
        // up down left,right,BackSpace
                                        
        if (e.which == 27 || e.which == 32) {//ESC or space
            //fire.miss.call(this, options);
            return _eventKey.miss.create();
        }

        if (inputByIme || isCursorCtrlKey) {
            matchInfo = _matcher.byCursor.call(this, options, inputByIme ? 0 : 1);
        }
        else {
            matchInfo = _matcher.always.call(this, options, e)
        }
        return matchInfo ? _eventKey.match.create(matchInfo) : _eventKey.noop.create();

    },
    keydown: function (e, options) {
        console.log("keydown-" + e.which)
        if (options._state == 1) { //had execute onMatch, it should pop up the menu, but DONOT　fosuc on int.
        
            var evnName = null;
            if (e.which == 40) { //press-down
                evnName = "focus"//focus the popup menu.
            }
            if (e.which == 13) { //input enter get the popup menut default value;
                evnName = "default";
            }
            if (evnName) {
                //fire[evnName].call(this, options);
                return _eventKey[evnName].create();
            }
        }
        return _eventKey.noop.create();
    },
    mouseup: function (e, options) {
        _layout.reset.call(this, options);
        var info = _matcher.byCursor.call(this, options);
        return info ? _eventKey.match.create(info) : _eventKey.noop.create();
    }
}
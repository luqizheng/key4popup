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

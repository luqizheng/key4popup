/* summary */


/// <reference path="../_MatchInfo.js" />
/// <reference path="../_globalDefined.js" />
/// <reference path="../_eventHandler.js" />
(function (avalon) {
    
    /* global */

    avalon.component("ms:keypopup", {
        $init: function (vm, ele) {
            vm.$ta = ele.innerHTML;
            var layoutEle = document.getElementById(layoutId)
            if (layoutEle == null) {
                document.body.appendChild(avalon.parseHTML(layout).childNodes[0]);
                layoutEle = document.getElementById(layoutId)
            }
            vm._layout = layoutEle;

        },
        $replace: 1,
        $ta: "",
        $$template: function (vm, ol) {
            return this.$ta.replace(">", 'ms-on-keyup="_keyup($event)" ms-on-keydown="_keydown($event)" ms-on-mouseup="_mouseup($event)" on-init="onInit">');
        },
        $ready: function (vm, ele) {
            vm.matchInfo = new MatchInfo(ele, vm);
            vm.matchInfo.content = ele.value;
            vm.onCursorChanged(vm.matchInfo);           
            //vm._mouseleave = hd;
            function hd(e) {
                return globalEventHandler(vm, e)
            }
            vm._keyup = hd;
            vm._keydown = hd;
            vm._mouseup = hd;
        },
        _state: 0,
        _keyup: false,
        _keydown: false,
        _mouseup: false,
        _layout: null,        
        onMatch: false, // match pop up condition
        onMiss: false, // missmatch ,
        onFocus: false, //for select start.
        onDefault: false, //use press to select the first one. it should  return default one.        
        onInit: avalon.noop,//这个应该被抛弃
        onCursorChanged: avalon.noop,//当游标改变的时候，就会发出这个时间
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
        matchInfo: null
    })

  
    /* gulp file inert* DO NOT REMOVE FOLLOWING COMMENT*/
  
    /* _pubEvent.js */
    /* _MatcherInfo.js */
    /* _cursorMgr.js */
    /* _eventHandler.js */
    /* _layout.js */
    /* _matcher.js */
    /* extendLib.js */

})(window.avalon)
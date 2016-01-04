/// <reference path="../_MatchInfo.js" />
/// <reference path="../_globalDefined.js" />

/* summary */

(function (avalon) {
    
    /* global */

    avalon.component("ms:keypopup", {
        $init: function (vm, ele) {
            //console.log("call $init")
            //console.debug("oldEle" + ele.innerHTML);
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
            return this.$ta.replace(">", 'ms-on-keyup="_keyup($event)" ms-on-keydown="_keydown($event)" ms-on-mouseup="_mouseup($event)" ms-on-mouseleave="_mouseleave" on-init="onInit">');
        },
        $ready: function (vm, ele) {
            vm.matchInfo = new MatchInfo(ele, vm);
            vm.matchInfo.content = ele.value;
            vm.onInit(vm.matchInfo);
            vm._keyup = hd;
            vm._keydown = hd;
            vm._mouseup = hd;
            vm._mouseleave = hd;
            function hd(e) {
                var self = e.target;
                var info = _eventHandler[e.type].call(self, e, vm)
                //console.log("event popup called " + info.e);
                info.invoke.call(self, vm, info.matchInfo);
                if (info != undefined && !info.bubby) {
                    //console.log("no bubby.")
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
            }
        },
        _keyup: avalon.noop,
        _keydown: avalon.noop,
        _mouseup: avalon.noop,
        _layout: null,
        _mouseleave: avalon.noop,
        onMatch: avalon.noop, // match pop up condition
        onMiss: avalon.noop, // missmatch ,
        onFocus: avalon.noop, //for select start.
        onDefault: avalon.noop, //use press to select the first one. it should  return default one.
        onLeave: avalon.noop,
        onInit: avalon.noop,
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
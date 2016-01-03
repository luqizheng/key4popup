/* summary */
(function (avalon) {
    avalon.component("ms:keypopup", {
        $init: function (vm, ele) {
            //console.log("call $init")
            //console.debug("oldEle" + ele.innerHTML);
            var a = avalon.parseHTML('<div style="position:absolute;width;z-index:-99999;overflow:hidden;visiblity:hidden;word-wrap:break-word;word-break:normal;"></div>')
            vm._target = document.body.appendChild(a.childNodes[0]);
            vm.$ta = ele.innerHTML;
        },
        $replace: 1,
        $ta: "",
        $$template: function (vm, ol) {
            return this.$ta.replace(">", 'ms-on-keyup="_keyup($event)" ms-on-keydown="_keydown($event)" ms-on-mouseup="_mouseup($event)" ms-on-mouseleave="_mouseleave">');
        },
        $ready: function (vm) {
            vm._keyup = hd;
            vm._keydown = hd;
            vm._mouseup = hd;
            vm._mouseleave=hd;
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
        _target: null,
        _mouseleave: avalon.noop,
        onMatch: avalon.noop, // match pop up condition
        onMiss: avalon.noop, // missmatch ,
        onFocus: avalon.noop, //for select start.
        onDefault: avalon.noop, //use press to select the first one. it should  return default one.
        onLeave: avalon.noop,
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
        matchInfo: {
            content: '',
            key: '',
            start: '',
            end: '',
            offset: {
                left: 0,
                top: 0
            },
            set: avalon.noop,
            focus: avalon.noop,
            hide: avalon.noop
        }
    })

  
    /* gulp file inert* DO NOT REMOVE FOLLOWING COMMENT*/
  
      /* _pubEvent.js */
    /* _pubMethod.js */
    /* _cursorMgr.js */
    /* _eventHandler.js */
    /* _layout.js */
    /* _matcher.js */
    /* extendLib.js */

})(window.avalon)
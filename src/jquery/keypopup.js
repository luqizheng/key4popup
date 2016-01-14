/* summary */

(function () {

    /// <reference path="../_pubMethod.js" />
    /// <reference path="../_pubEvent.js" />
    /// <reference path="../_layout.js" />
    /// <reference path="../_globalDefined.js" />
    
    /* global */

    var optKey = "_keypopup",
        defaultOpt = {
            onMatch: false, // match pop up condition
            onMiss: false, // missmatch ,
            onFocus: false, //for select start.
            onDefault: false, //use press to select the first one. it should  return default one.
            onCursorChanged: false,
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
            _state: 0 // 0 nothing , 1 onMatch.
        }


    $.fn.keypopup = function (opt) {

        var options = null,
            self = this[0]
            , $this = this;

        if (typeof opt == "string") {
            options = $this.data(optKey);
            var arg = [].concat([].slice.call(arguments, 1));
            options.matchInfo[opt](arg)
        }
        else {
            options = $.extend({}, defaultOpt, opt)
            createLayout(options);
            _layout.reset.call(self, options);
            $this.data(optKey, options)
                .mouseup(hd)
                .keydown(hd)
                .keyup(hd)

            function hd(e) {
                return globalEventHandler(options, e)
            }

            options.matchInfo = new MatchInfo(self, options);
            options.matchInfo.content = self.value;
            options.onCursorChanged(options.matchInfo);
        }

        function createLayout(options) {

            if (!options._layout) {
                var $keypop = $("#" + layoutId);
                if ($keypop.length == 0) {
                    $keypop = $(layout)
                        .appendTo("body");
                }
                options._layout = $keypop[0]
            }
        }
        return $this;
    }

    /* _pubEvent.js */
    /* _MatcherInfo.js */
    /* _cursorMgr.js */
    /* _eventHandler.js */
    /* _layout.js */
    /* _matcher.js */
    /* extendLib.js */

})(jQuery)
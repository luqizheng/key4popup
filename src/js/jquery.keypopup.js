(function ($) {
    $.fn.keypopup = function (opt) {

        var defaultOpt = {
            onMatch: false, // match pop up condition
            onMiss: false, // missmatch ,
            onFocus: false, //for select start.
            onDefault: false, //use press to select the first one. it should  return default one.
            isShow: false,
            _curPos: {
                start: 0,
                end: 0,
                tag: false,
            },
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

        var options = null,
            $this = $(this);

        if (typeof opt == "string") {
            options = $this.data("_keypopup");
            var arg = [options].concat([].slice.call(arguments, 1));
            pub[opt].apply($this[0], arg)
        }
        else {
            options = $.extend({}, defaultOpt, opt)
            if (!options.atId) {
                var date = (new Date()).getTime();
                var rad = Math.round(Math.random() * 201);
                options.atId = "at" + rad + date;
            }
            $this
                .data("_keypopup", options)
                .mouseup(function (e) {
                    layout.reset.call(this);
                    if (matcher.byCursor.call(this, options)) {

                    }
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                })
                .keyup(function (e) {
                    var bMatchFocus = false,
                        isMatch = false,
                        inputByIme = e.which == 229,  //microsoft ime return 229.;
                        isCursorCtrlKey = inputByIme || e.which == 38 || e.which == 39 || e.which == 40 || e.which == 37 || e.which == 8;
                    // up down left,right,BackSpace
                                        
                    if (e.which == 27) {
                        fire.miss.call(this, options);//ESC 
                        return;
                    }
                    if (options._state == 1) { //had execute onMatch, it should pop up the menu, but DONOT　fosuc on int.
                        if (e.which == 40) { //press-down
                            fire.focus.call(this, options);//focus the popup menu. 
                            bMatchFocus = true;
                        }
                        if (e.which == 13) { //input enter get the popup menut default value;
                            fire.default.call(this, options);
                            bMatchFocus = true;
                        }
                    }

                    if (!bMatchFocus) {
                        if (inputByIme || isCursorCtrlKey) {
                            isMatch = matcher.byCursor.call(this, options, isCursorCtrlKey ? 1 : 0);
                        }
                        else {
                            for (var i = 0; i < options.matches.length; i++) {
                                var item = options.matches[i];
                                if (item.isMatch(e)) {
                                    isMatch = true;
                                    matcher.always.call(this, options, { start: item.start, end: item.end });
                                    break;
                                }
                            }
                        }
                    }
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                });
            resetDiv.call(this);
        }
        return $this;
    }

    var matcher = { //all matcher fire by it;
        /**
         * fire by cursor in textarea
         * @param  {any} options
         * @param  {any} startLen include 1 charge after the matches[0].start.
         */
        byCursor: function (options, startLen) {
            //render the text which mouse focus to the layout behinde the textarea.            
            var len = startLen || 1,
                content = cursorMgr.getSelection.call(this, options);
            for (var i = 0; i < options.matches.length; i++) {
                var item = options.matches[i];
                var start = item.start;
                var reg = new RegExp(start + "[^" + start + "\\s]{" + len + ",20}$", "gi");
                var matches = content.match(reg);
                if (matches != null) {
                    var matchInfo = {
                        content: content.substring(0, content.length - matches[0].length),
                        key: matches[0],
                        start: item.start,
                        end: item.end
                    }
                    matcher._fire.call(this, options, matchInfo);
                    return true;
                }
            }
            fire.miss.call(this, options);
            return false;
        },
        always: function (options, matchInfo) {
            var content = cursorMgr.getSelection.call(this, options);
            matchInfo.content=content.substring(0, content.length - 1); //exculde matchKey
            matchInfo.key="&nbsp;";            
            matcher._fire.call(this, options, matchInfo);

        },
        _fire: function (options, matchInfo) {
            layout.render.call(this, options, matchInfo);
            fire.match.call(this, options, matchInfo);
        }

    }

    var fire = {
        default: function (options) {
            var d = options.onDefault.call(this, options);
            if (d) {
                pub.set.call(this, options, d);
            }
        },
        match: function (options, matchInfo) { //defnined matcher.byCursor,
            var $tag = $("#" + options.atId);
            var offset = $tag.offset();
            offset.top += $tag.height();
            offset.start = matchInfo.start;
            offset.end = matchInfo.end;

            options._curMatch = offset;
            options._state = 1;
            options.onMatch.call(this, offset);
        },
        miss: function (options) {
            options.onMiss.call(this)
            options._state = 0;
        },
        focus: function (options) {
            options.onFocus.call(this);
            options._state = 0;
        }
    }

    var pub = {
        /**
         * @param  {any} options
         * @param  {any} strName
         */
        set: function (options, strName) {
            var self = this
                , strName = options._curMatch.start + strName + options._curMatch.end
                , $this = $(this)
                , $tag = options._target
                , tagLength = $tag.find("#" + options.atId).text().length
                , layoutLength = $tag.text().length
                , content = $this.val()
                , start = content.substr(0, layoutLength - tagLength)
                , end = content.substr(layoutLength)
                , result = start + strName + end; //add space avoid popup panel again.
            $this.val(result);
            options._state = 0;
            options.onMiss.call(self);
            cursorMgr.setPos.call(self, options, layoutLength - tagLength + strName.length);
        },
        focus: function (options) {
            cursorMgr.setPos.call(this, options, options._target.text().length);
        }

    }

    var cursorMgr = {
        getSelection: function (options) {
            var content, textarea = this;
            if (window.getSelection) {								
                //statnd browser;
                content = textarea.value.substring(0, textarea.selectionEnd);
            } else {
                var range = document.selection.createRange();
                var dup_range = range.duplicate();
                dup_range.moveToElementText(textarea);
                dup_range.setEndPoint('EndToEnd', range);
                content = dup_range.text;
            }
            return content;
        },
        setPos: function (options, newLength) {
            var self = this;
            $(self).focus();
            if (window.getSelection) {
                self.selectionEnd = newLength;
                self.selectionStart = newLength;
            }
            else if (self.createTextRange) {
                var range = self.createTextRange()
                    , action = 'character';
                range.collapse(true);
                range.moveEnd(action, newLength);
                range.moveStart(action, newLength);
            }
        }
    }



    var layout = {
        reset: function () {
            var self = this, $this = $(self)
                , options = $this.data("_keypopup")
                , offset = $this.offset();
            if (!options._target) {
                options._target = $('<div style="position:absolute;width;z-index:-99999;overflow:hidden;visiblity:hidden"></div>').appendTo("body");
            }
            options._target
                .css("width", self.clientWidth)
                .css("height", self.clientHeight)
                .css("left", offset.left)
                .css("top", offset.top);
        },
        /**
         * @param  {any} options
         * @param  {any} matchContent, this value from matcher.checkRange struct is {content:<without key>, key:<key>}
         */
        render: function (options, matchContent) {
            var content = matchContent.content.replace(/[\r\n]/g, "<br>");
            var key = matchContent.key;
            options._target.html(content + "<span id='" + options.atId + "'>" + key + "</span>");
        }
    }


    var resetDiv = layout.reset;
})(jQuery)
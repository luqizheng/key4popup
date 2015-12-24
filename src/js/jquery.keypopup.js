(function ($) {
    $.fn.keypopup = function (opt) {

        var defaultOpt = {
            onMatch: false, // match pop up condition
            onMiss: false, // missmatch ,
            onFocus: false, //for select start.
            onDefault: false, //use press to select the first one. it should  return default one.            
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
                    layout.reset.call(this, options);
                    if (matcher.byCursor.call(this, options)) {
                        e.stopPropagation();
                        e.preventDefault();
                        return false;
                    }                 
                })
                .keydown(function (e) {
                    console.log("keydown-"+e.which)
                    if (options._state == 1) { //had execute onMatch, it should pop up the menu, but DONOT　fosuc on int.
                        if (e.which == 40) { //press-down
                            fire.focus.call(this, options);//focus the popup menu.                            
                        }
                        if (e.which == 13) { //input enter get the popup menut default value;
                            fire.default.call(this, options);
                        }
                        e.preventDefault();
                        e.stopPropagation();                        
                        return false;
                    }                    
                })
                .keyup(function (e) {                    
                    console.log("keyup-"+e.which)
                    var isMatch = false,
                        inputByIme = e.which == 229,  //microsoft ime return 229.;
                        isCursorCtrlKey = e.which == 38 || e.which == 39 || e.which == 40 || e.which == 37 || e.which == 8;
                    // up down left,right,BackSpace
                                        
                    if (e.which == 27 || e.which == 32) {//ESC or space
                        fire.miss.call(this, options);                  
                        return;
                    }
                    if (inputByIme || isCursorCtrlKey) {
                        isMatch = matcher.byCursor.call(this, options, inputByIme ? 0 : 1);
                    }
                    else {
                        //something to check 
                        for (var i = 0; i < options.matches.length; i++) {
                            var item = options.matches[i];
                            if (item.isMatch(e)) {
                                isMatch = true;
                                matcher.always.call(this, options, { start: item.start, end: item.end });
                                break;
                            }
                        }
                    }

                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                });
            layout.reset.call(this, options);
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
                                    
            var len = startLen === undefined ? 1 : startLen,
                content = cursorMgr.getSelection.call(this, options);
            for (var i = 0; i < options.matches.length; i++) {
                var item = options.matches[i];
                var start = item.start;
                var reg = new RegExp(start + "[^" + start + "\\s]{" + len + ",20}$", "gi");
                var matches = content.match(reg);
                if (matches != null) {
                    var matchInfo = {
                        content: content,
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
            matchInfo.content = cursorMgr.getSelection.call(this, options);
            matchInfo.key = "@";
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
            offset.top += $tag.height() - this.scrollTop;
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
            if(typeof options.onFocus=="function"){
                options.onFocus.call(this);
                options._state = 0;
            }
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
                , $tag = options._target.data("_t")
                , layoutLength = $tag.contentLen
                , content = $this.val()
                , start = content.substr(0, $tag.contentLen)
                , end = content.substr(layoutLength + $tag.keyLen)
                , result = start + strName + end; //add space avoid popup panel again.
            console.log(JSON.stringify($tag));
            $this.val(result);
            options._state = 0;
            options.onMiss.call(self);
            cursorMgr.setPos.call(self, options, layoutLength + strName.length, $tag.scrollTop);
        },
        focus: function (options) {
            cursorMgr.setPos.call(this, options, options._target.text().length, options._target.data("_t").scrollTop);
        }

    }

    var cursorMgr = {
        getSelection: function (options) {
            var content, self = this;
            if (window.getSelection) {								
                //statnd browser;
                content = self.value.substring(0, self.selectionEnd);
            } else {
                var range = document.selection.createRange();
                var dup_range = range.duplicate();
                dup_range.moveToElementText(self);
                dup_range.setEndPoint('EndToEnd', range);
                content = dup_range.text;
            }
            return content;
        },
        setPos: function (options, newLength, scrollTop) {
            var self = this;
            $(self).focus();
            self.scrollTop = scrollTop
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
        reset: function (options) {
            var self = this, $this = $(self)
                , offset = $this.offset();
            if (!options._target) {
                options._target = $('<div style="position:absolute;width;z-index:-99999;overflow:hidden;visiblity:hidden;word-wrap: break-word;word-break:normal;"></div>').appendTo("body");
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
            var content = matchContent.content.substr(0, matchContent.content.length - matchContent.key.length);
            var htmlcontent = content.replace(/[\r\n]/g, "<br>").replace(/ /g, "&nbsp;");
            options._target.data("_t", {
                contentLen: content.length,
                keyLen: matchContent.key.length,
                scrollTop: this.scrollTop
            });//保存实际长度
            
            options._target.html(htmlcontent + "<span id='" + options.atId + "'>" + matchContent.key + "</span>");
        }
    }



})(jQuery)
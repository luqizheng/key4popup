(function ($) {
    $.fn.keypopup = function (opt) {
        var defaultOpt = {
            onMatch: false, // match pop up condition
            onMiss: false, // missmatch ,
            onFocus: false, //for select start.
            onDefault: false, //use press to select the first one. it should  return default one.
            isShow: false,
            atId: "at", // get the text position by this id,
            _curPos: {
                start: 0,
                end: 0,
                tag: false,
            },
            
            isMatch:function(e)
            {
                return e.which === 50 && e.shiftKey;
            },          
                        
            _state: 0 // 0 nothing , 1 onMatch.
        }

        var options = $.extend({}, defaultOpt, opt),
            $this = $(this);
        if (typeof opt == "string") {
            options = $(this).data("_keypopup");
            switch (opt) {
                case "set":
                    pub.setText.call(this, options, arguments[1]);
                    break;
                case "focus":
                    pub.focus.call(this, options);
            }
        }
        else {

            $this
                .data("_keypopup", options)
                .mouseup(function (e) {
                    resetDiv.call(this);//reset the layout position.
                    if (renderToLayer.call(this, options)) {
                        fire.match.call(this, options);
                    }
                    else {
                        fire.miss.call(this, options);
                    }
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                })
                .keyup(function (e) {
                    console.debug("keyup " + e.which);
                    var isMatchKey = options.isMatch(e),
                        bMatchFocus = false;
                    if (e.which == 27) {
                        fire.miss.call(this, options);//ESC 
                        return;
                    }
                    if (options._state == 1) {
                        if (e.which == 40) {
                            console.log("on focuse the panel.")
                            fire.focus.call(this, options);
                            bMatchFocus = true;
                        }
                        if (e.which == 13) {
                            fire.default.call(this, options);
                            bMatchFocus = true;
                        }
                    }
                    if (!bMatchFocus && (e.which == 38 || e.which == 39 || e.which == 40 || e.which == 37 || e.which == 8 || e.which == 229 || isMatchKey)) {
                        var method = renderToLayer.call(this, options, isMatchKey) ? "match" : "miss";
                        fire[method].call(this, options);
                    }
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                });
            resetDiv.call(this);
        }
        return $this;
    }

    var fire = {
        default: function (options) {
            var d = options.onDefault.call(this, options);
            if (d) {
                pub.setText.call(this, options, d);
            }
        },
        match: function (options) {
            var $tag = $("#" + options.atId);
            var offset = $tag.offset();
            offset.top += $tag.height();
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
        setText: function (options, strName) {
            var start = $(this).val().substr(0, options._curPos.start);
            var end = $(this).val().substr(options._curPos.end);
            var result = start + "@" + strName + end;
            $(this).val(result);
            setCursor.call(this, options, strName.length);
            options._state = 0;
            options.onMiss.call(this);
        },
        focus: function (options) {
            setCursor.call(this, options);
        }

    }

    function getSelection(options) {
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
    }

    function setCursor(options, wordLength) {
        var self=this, $self = $(self).focus();
        if (!wordLength) {
            wordLength = options._curPos.tag.length;
        }
        var newLength = wordLength + options._curPos.start + 1;
        console.debug("end curPos:" + newLength)
        if (window.getSelection) {
            self.selectionEnd = newLength;
            self.selectionStart = newLength;
        }
        else if (self.createTextRange) {
            var range = self.createTextRange();
            range.collapse(true);
            range.moveEnd('character', newLength);
            range.moveStart('character', newLength);
        }

    }


    function renderToLayer(options) {
        //render the text which mouse focus to the layout behinde the textarea.
        var textarea = this,
            content = getSelection.call(this, options),
            completeTag = "" // which target to fire the onMatchEvent, it should be a complete name when cursor on this word.;

        var matches = content.match(/@[^@\s]{1,20}$/g);
        var isMatch = matches != null
        if (isMatch) {
            // try to find complete name.
            // match full char 
            var regx = /.*?[\-,\/,\|,\$,\+,\%,\&,\',\(,\),\*,\x20-\x2f,\x3a-\x40,\x5b-\x60,\x7b-\x7e,\x80-\xff,\u3000-\u3002,\u300a,\u300b,\u300e-\u3011,\u2014,\u2018,\u2019,\u201c,\u201d,\u2026,\u203b,\u25ce,\uff01-\uff5e,\uffe5]/
            var halfName = textarea.value.substr(content.length).match(regx);
            if (halfName != null) {
                halfName = halfName[0].substring(0, halfName[0].length - 1)
            }
            content = content.substring(0, content.length - matches[0].length);

            completeTag = matches[0] + halfName; //without @ char.
            
        }
        else if (content.lastIndexOf("@") == Math.abs(content.length - 1)) {
            isMatch = true;
            content = content.substring(0, content.length - 1);
            //content hasn't any change. 
            completeTag = "@";
        }
        console.debug("content without name:" + content + " complete name:" + completeTag)
        options._curPos = {
            start: content.length,
            end: content.length + completeTag.length,
            tag: completeTag
        }
        options._target.html(content.replace(/[\r\n]/g, "<br>") + "<span id='" + options.atId + "'>" + completeTag + "</span>");
        return isMatch;
    }

    function resetDiv() {
        var  self=this,$this = $(self)
            , options = $this.data("_keypopup")
            , offset = $this.offset()
            , size = {
                height: $this.innerHeight(),
                width: $this.innerWidth()
            }
        if (!options._target) {
            options._target = $('<div style="position:absolute;width;z-index:-99999;overflow:hidden;visiblity:hidden"></div>').appendTo("body");
        }
        options._target
            .css("width", self.clientWidth)
            .css("height", self.clientHeight)
            .css("left", offset.left)
            .css("top", offset.top);
    }   
})(jQuery)
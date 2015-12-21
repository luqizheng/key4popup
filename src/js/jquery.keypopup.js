(function ($) {
    $.fn.keypopup = function (opt) {


        var options = $.extend({}, defaultOpt, opt),
            $this = $(this);
        if (typeof opt == "string") {
            switch (opt) {
                case "set":
                    options = $(this).data("_keypopup");
                    setText.call(this, options, arguments[1]);
                    break;
            }
        }
        else {

            $this.click(function () {
                resetDiv.call(this);
            })
                .data("_keypopup", options)
                .mouseup(function (e) {
                    if (renderToLayer.call(this, options)) {
                        fireOnMatch.call(this, options);
                    }
                    else {
                        options.onMiss();
                    }
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                })
                .keyup(function (e) {
                    console.debug("keyup " + e.which);
                    if(e.which==27){
                        options.onMiss.call(this);
                    }
                    var useAtChar = (e.which === 50 && e.shiftKey);
                    if (e.which == 38 || e.which == 39 || e.which == 40 || e.which == 37 || e.which == 8 || useAtChar) {
                        if (renderToLayer.call(this, options, useAtChar)) {
                            fireOnMatch.call(this, options);
                        }
                    }
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }).keydown(function (e) {
                    console.debug("keydown " + e.which);
                    //when the popup panel is showing, it should be focus on the textarea,
                    //user use entier or down key boadrd, it should be insert to the text.
                    if (e.which == 40 && options._state == 1) {  
                        console.log("on focuse the panel.")
                        e.stopPropagation();
                        e.preventDefault();
                        fireOnFocus.call(this, options);
                        return false;
                    }

                });
            resetDiv.call(this);
        }
        return $this;
    }

    function setText(options, strName) {
        var start = $(this).val().substr(0, options._curPos.start);
        var end = $(this).val().substr(options._curPos.end);
        var result = start + "@" + strName + end;
        $(this).val(result);
        setCursor.call(this, options, strName.length);
        options._state = 0;
        options.onMiss.call(this);
    }

    function fireOnMatch(options) {
        var offset = $("#" + options.atId).offset();
        offset.top += $("#" + options.atId).height();
        options._state = 1;
        options.onMatch.call(this, offset);
    }
    function fireOnFocus(options) {
        options._state = 0;
        options.onFocus.call(this);
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
            alert("IE no test.")
        }
        return content;
    }

    function setCursor(options, wordLength) {
        var $self = $(this).focus();
        if (window.getSelection) {
            var newLength = wordLength + options._curPos.start + 1;
            console.debug("end curPos:" + newLength)
            $self[0].selectionEnd = newLength;
            $self[0].selectionStart = newLength;
        }
    }

    function renderToLayer(options, byAtKeyUp) {
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
        else if (byAtKeyUp) // fire by @ keyup, it may no match anything, when cursor in the end of textbox.
        {
            content=content.substring(0,content.length-1);
            //content hasn't any change. 
            completeTag = "@";
        }
        console.debug("content without name:"+content+" complete name:"+completeTag)
        options._curPos = {
            start: content.length,
            end: content.length + completeTag.length
        }
        options._target.html(content + "<span id='" + options.atId + "'>" + completeTag + "</span>");



        return isMatch || byAtKeyUp;
    }

    function resetDiv() {
        var $this = $(this)
            , options = $this.data("_keypopup")
            , offset = $this.offset()
            , size = {
                height: $this.innerHeight(),
                width: $this.innerWidth()
            }
        if (!options._target) {
            options._target = $('<div style="position:absolute;width;background-color:red;z-index:-99999;overflow:hidden"></div>').appendTo("body");
        }
        options._target
            .css("width", $this[0].clientWidth)
            .css("height", $this[0].clientHeight)
            .css("left", offset.left)
            .css("top", offset.top);
    }

    var defaultOpt = {
        onMatch: false, // match pop up condition
        onMiss: false, // missmatch ,
        onFocus: false, //for select start. 
        
        atId: "at",
        _curPos: {
            start: 0,
            end: 0,
        },
        _state: 0 // 0 nothing , 1 onMatch.
    }

    function _shoJson(obj) {
        alert(JSON.stringify(obj))
    }
})(jQuery)
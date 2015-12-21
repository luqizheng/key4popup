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
                        fireEvent.call(fireEvent, options);
                    }
                    else {
                        options.onMiss();
                    }
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                })
                .keyup(function (e) {
                    console.log(e.which + "," + e.shiftKey)
                    if (e.which == 38 || e.which == 39 || e.which == 40 || e.whic == 41 || (e.which === 50 && e.shiftKey)) {
                        if (renderToLayer.call(this, options, (e.which === 50 && e.shiftKey))) {
                            fireEvent.call(fireEvent, options);
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

    function setText(options, strName) {
        var start = $(this).val().substr(0, options._curPos.start);
        var end = $(this).val().substr(options._curPos.end);
        var result = start + strName + end;
        $(this).val(result);
        setCursor.call(this, options);
    }

    function fireEvent(options) {
        var offset = $("#" + options.atId).offset();
        offset.top += $("#" + options.atId).height();
        options.onMatch.call(this, offset);
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

    function setCursor(options) {
        var $self = $(this).focus();        
        if (window.getSelection) {
            console.debug("end curPos:" + options._curPos.end)
            $self[0].selectionEnd = options._curPos.end+1;
            $self[0].selectionStart=options._curPos.end+1;
        }
    }

    function renderToLayer(options, bFocusPopup) {
        //render the text which mouse focus to the layout behinde the textarea.
        var textarea = this,
            content = getSelection.call(this, options);        
        var matches = content.match(bFocusPopup ? (/@[^@\s]{0,20}$/g) : (/@[^@\s]{1,20}$/g));
        if (matches != null) {
            // try to find complete name.
            // match full char 
            var regx = /.*?[\-,\/,\|,\$,\+,\%,\&,\',\(,\),\*,\x20-\x2f,\x3a-\x40,\x5b-\x60,\x7b-\x7e,\x80-\xff,\u3000-\u3002,\u300a,\u300b,\u300e-\u3011,\u2014,\u2018,\u2019,\u201c,\u201d,\u2026,\u203b,\u25ce,\uff01-\uff5e,\uffe5]/
            var halfName = textarea.value.substr(content.length).match(regx);
            if (halfName != null) {
                halfName = halfName[0].substring(0, halfName[0].length - 1)
            }
            content = content.substring(0, content.length - matches[0].length);
            var completeTag = matches[0] + halfName;

            options._curPos = {
                start: content.length,
                end: content.length + completeTag.length
            }
                        
            options._target.html("<span id='" + options.atId + "'>" + completeTag + "</span>")

            return true;
        }

        return false;
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
        atId: "at",
        _curPos: {
            start: 0,
            end: 0,
        }
    }

    function _shoJson(obj) {
        alert(JSON.stringify(obj))
    }
})(jQuery)
/// <reference path="_cursorMgr.js" />
/// <reference path="_MatchInfo.js" />
var regexMatch = "\\s\\x20-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\x7e\\x80-\\xff\\u3000-\\u3002\\u300a\\u300b\\u300e-\\u3011\\u2014\\u2018\\u2019\\u201c\\u201d\\u2026\\u203b\\u25ce\\uff01-\\uff5e\\uffe5";
var _matcher = { //all matcher fire by it;
    /**
     * fire by cursor in textarea
     * @param  {any} options
     * @param  {any} startLen include 1 charge after the matches[0].start.
     */
    byCursor: function (options, startLen) {
        //render the text which mouse focus to the layout behinde the textarea.
                                    
        var len = startLen === undefined ? 1 : startLen,
            self = this,
            content = _cursorMgr.getSelection.call(self);
        for (var i = 0; i < options.matches.length; i++) {
            var item = options.matches[i];
            var start = item.start;
            var reg = new RegExp(start + "[^" + start + regexMatch + "]{" + len + ",20}$", "gi");
            var matches = content.match(reg);
            if (matches != null) {
                //It should be match.
                var result = new MatchInfo(self, options)
                result.content = content;
                result.key = matches[0];
                result.start = item.start;
                result.end = item.end;
                result.scrollTop = self.scrollTop;

                var atId = _layout.render.call(this, options, result);
                var tagele = document.getElementById(atId);
                var offset = _extendLib.offset(tagele);
                offset.top += _extendLib.height(tagele) - this.scrollTop;
                result.offset = offset;
                return result;
            }
        }
    }
    /*,
    always: function (options, e) {
        for (var i = 0; i < options.matches.length; i++) {
            var item = options.matches[i];
            if (item.isMatch(e)) {
                return {
                    start: item.start,
                    end: item.end,
                    key: item.start,
                    content: _cursorMgr.getSelection.call(this, options)
                }
                //_matcher.always.call(this, options, { start: item.start, end: item.end });
                //matchInfo.content = cursorMgr.getSelection.call(this, options);        
                //_matcher._fire.call(this, options, matchInfo);
                break;
            }
        }
    }*/
    /*_fire: function (options, matchInfo) {
        layout.render.call(this, options, matchInfo);
        fire.match.call(this, options, matchInfo);
    }*/

}
/// <reference path="_cursorMgr.js" />
function matchInfo(){
    this.key;
    this.start;
    this.end,
    this.content,
    this.offset=function(){
        this.left;
        this.top;
    },
    this.set=function(){
        
    }
    this.hide=function(){}
    this.focus=function(){}
}
var _matcher = { //all matcher fire by it;
    /**
     * fire by cursor in textarea
     * @param  {any} options
     * @param  {any} startLen include 1 charge after the matches[0].start.
     */
    byCursor: function (options, startLen) {
        //render the text which mouse focus to the layout behinde the textarea.
                                    
        var len = startLen === undefined ? 1 : startLen,
            content = _cursorMgr.getSelection.call(this);
        for (var i = 0; i < options.matches.length; i++) {
            var item = options.matches[i];
            var start = item.start;
            var reg = new RegExp(start + "[^" + start + "\\s]{" + len + ",20}$", "gi");
            var matches = content.match(reg);
            if (matches != null) {
                return {
                    content: content,
                    key: matches[0],
                    start: item.start,
                    end: item.end
                }
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
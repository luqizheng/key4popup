
var atId;
var _layout = {
    reset: function (options) {
        var self = this, offset = _extendLib.offset(self);
        _extendLib.setSizePos(options._target, {
            width: self.clientWidth,
            height: self.clientHeight,
            left: offset.left,
            top: offset.top
        })
    },    
    /**
     * @param  {any} options
     * @param  {any} matchContent, this value from matcher.checkRange struct is {content:<without key>, key:<key>}
     */
    render: function (options, matchInfo) {

        var content = matchInfo.content.substr(0, matchInfo.content.length - matchInfo.key.length); //内容，不包括                
        var htmlcontent = content.replace(/[\r\n]/g, "<br>").replace(/ /g, "&nbsp;");

        if (!atId) {
            atId = "at" + Math.round(Math.random() * 201) + (new Date()).getTime();
        }      
      

        options._target.innerHTML = htmlcontent + "<span id='" + atId + "'>" + matchInfo.key + "</span>";
        return atId;
    }
}



var _layout = {
    reset: function (options) {

        var offset = _extendLib.offset(this), self = this;
        _extendLib.setSizePos(options._target, {
            width: self.clientWidth,
            height: self.clientHeight,
            left: offset.left,
            top: offset.top
        })
        /*options._target
            .css("width", self.clientWidth)
            .css("height", self.clientHeight)
            .css("left", offset.left)
            .css("top", offset.top);*/
    },    
    /**
     * @param  {any} options
     * @param  {any} matchContent, this value from matcher.checkRange struct is {content:<without key>, key:<key>}
     */
    render: function (options, matchInfo) {

        var content = matchInfo.content.substr(0, matchInfo.content.length - matchInfo.key.length); //内容，不包括
        console.debug("callRender:+ reformat:" + content);
        console.debug(JSON.stringify(matchInfo));
        var htmlcontent = content.replace(/[\r\n]/g, "<br>").replace(/ /g, "&nbsp;");

        if (!options.atId) {
            var date = (new Date()).getTime();
            var rad = Math.round(Math.random() * 201);
            options.atId = "at" + rad + date;
        }

        options.matchInfo = matchInfo;
        options.matchInfo.scrollTop = this.scrollTop;
        /*(content: matchInfo.content,//实际长度，并不包含&space之后的信息
        key: matchInfo.key,
        scrollTop: this.scrollTop
    };//保存实际长度*/

        options._target.innerHTML = htmlcontent + "<span id='" + options.atId + "'>" + matchInfo.key + "</span>";
    }
}

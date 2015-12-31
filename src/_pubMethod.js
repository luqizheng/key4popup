/// <reference path="_cursorMgr.js" />
var _pubMethod = {
    /**
     * @param  {any} options
     * @param  {any} strName
     */
    set: function (options, strName) {

        var self = this
            , matchInfo = options.matchInfo
            , tagName = matchInfo.start + strName + matchInfo.end
            , layoutLength = matchInfo.content.substr(0, matchInfo.content.length - matchInfo.key.length).length
            , srcContent = self.value
            , start = srcContent.substr(0, layoutLength)
            , end = srcContent.substr(layoutLength + matchInfo.key.length)
            , result = start + tagName + end; //add space avoid popup panel again.
        //console.log(JSON.stringify($tag));
        self.value = result;
        options._state = 0;
        options.onMiss.call(self);
        _cursorMgr.setPos.call(self, layoutLength + tagName.length, matchInfo.scrollTop);
    },
    focus: function (options) {
        var matchInfo = options.matchInfo;
        _cursorMgr.setPos.call(this, options, matchInfo.content.length, matchInfo.scrollTop);
    },
    hide: function (options) {
        _eventKey.miss.create().invoke.call(this, options);
        //.miss.call(this,options);
    }

}

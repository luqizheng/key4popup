/// <reference path="_cursorMgr.js" />

function MatchInfo(textarea, options) {
    this.self = textarea
    this.options = options;
    this.key = "";
    this.start = "";
    this.end = "",
    this.content = "",
    this.offset = function () {
        this.left;
        this.top;
    },
    this.bookmark = null; // for ie678
    this.scrollTop = 0;
    this.set = function (strName) {

        var self = this.self,
            options = this.options,
            matchInfo = this,
            tagName = matchInfo.start + strName + matchInfo.end
            , layoutLength = matchInfo.content.substr(0, matchInfo.content.length - matchInfo.key.length).length
            , srcContent = self.value
            , start = srcContent.substr(0, layoutLength)
            , end = srcContent.substr(layoutLength + matchInfo.key.length)
            , result = start + tagName + end; //add space avoid popup panel again.        
        self.value = result;
        options._state = 0;
        options.onMiss.call(self);
        _cursorMgr.setPos.call(self, layoutLength + tagName.length, matchInfo.scrollTop, matchInfo);
    }
    this.hide = function () {
        var options = this.options;
        //var matchInfo = this.options.matchInfo;
        _eventKey.miss.create().invoke.call(this.self, options)
        //_cursorMgr.setPos.call(this.self, matchInfo.content.length,matchInfo.scrollTop);
    }
    this.focus = function () {
        _eventKey.miss.create().invoke.call(this.self, this.options);
    }

}
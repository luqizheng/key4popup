
/// <reference path="./lib/lib.d.ts" />



var _cursorMgr = {
    //this必须是 textarea对象 
    getSelection: function () {
        var content, self = this;
        if (window.getSelection) {								
            //statnd browser;
            content = self.value.substring(0, self.selectionEnd);
        } else {

            var range = document.selection.createRange(),
                dup_range = range.duplicate();
            dup_range.moveToElementText(self);
            dup_range.setEndPoint('EndToEnd', range);
            content = dup_range.text;
        }
        return content;
    },
    setPos: function (newLength, scrollTop) {
        var self = this;
        self.focus();
        self.scrollTop = scrollTop
        if (window.getSelection) {
            self.selectionStart = self.selectionEnd = newLength;
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
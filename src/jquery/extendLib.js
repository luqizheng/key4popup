var _extendLib = {
    offset: function (ele) {
        return $(ele).offset();
    },
    setSizePos: function (ele, info) {
        $(ele).css(info);
    },
    height:function(ele){
        return $(ele).height();
    }

}
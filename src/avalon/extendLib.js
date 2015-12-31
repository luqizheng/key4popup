var _extendLib = {
    offset: function (ele) {
        return avalon(ele).offset();
    },
    setSizePos: function (ele, info) {
        avalon(ele).css(info);
    },
    height:function(ele){
        return avalon(ele).height();
    }

}
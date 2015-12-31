

avalon.library("ora")

avalon.component("ora:keypopup", {

    $posPanel: 0,
    $init: function (vm, ele) {
        console.log("call $init")
        console.debug("oldEle" + ele.innerHTML);
        var a = avalon.parseHTML('<div style="position:absolute;width;z-index:-99999;overflow:hidden;visiblity:hidden;word-wrap:break-word;word-break:normal;"></div>')
        vm._target = document.body.appendChild(a.childNodes[0]);
        //vm._target=a.childNodes[0];
        vm.$template = ele.innerHTML;
        //a.$posPanel = posBg;      
      
    },
    $replace: 1,
    $template: "",
    $$template: function (vm, ol) {
        var events = "<textarea ms-on-keyup='_keyup($event)' ms-on-keydown='_keydown($event)' ms-on-mouseup='_mouseup($event)'";
        return this.$template.replace("<textarea", events);
    },
    $ready: function (vm) {
        vm._keyup = function (e) {
            innerHandler(e, vm)
        };
        vm._keydown = function (e) {
            innerHandler(e, vm)
        };
        vm._mouseup = function (e) {
            innerHandler(e, vm)
        };        
    },    
    _keyup: false,
    _keydown: false,
    _mouseup: false,
    _target: null,
    onMatch: false, // match pop up condition
    onMiss: false, // missmatch ,
    onFocus: false, //for select start.
    onDefault: false, //use press to select the first one. it should  return default one.            
    matches: [{
        start: "@",
        end: " ",
        isMatch: function (e) {
            return e.which === 50 && e.shiftKey;
        }
    },
        {
            start: "#",
            end: "# ",
            isMatch: function (e) {
                return e.which === 51 && e.shiftKey;
            }
        }
    ]
})

function innerHandler(e, vm) {
    var self = e.target;
    var info = _eventHandler[e.type].call(self, e, vm)
    //console.log("event popup called " + info.e);
    info.invoke.call(self, vm, info.matchInfo);
    if (info != undefined && !info.bubby) {
        //console.log("no bubby.")
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
}


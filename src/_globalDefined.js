var layoutId = "_keypopup_"
var layout = '<div id="' + layoutId + '" style="position:absolute;width;z-index:-99999;overflow:hidden;visibility:hidden;word-wrap:break-word;word-break:normal;"/>';
function log() {
    if (window.console) {
        // http://stackoverflow.com/questions/8785624/how-to-safely-wrap-console-log
        Function.apply.call(console.log, console, arguments)
    }
}

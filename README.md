# key4popup
press key and pop up something.

提供jquery 和 avalon js的支持

请看 example 里面的示例。 它并不处理任何和弹出界面的东西。

key4popup只是简单检查textaarea中游标所在位置是否弹出的条件，如 # 或者 @ 或者自定义的符号，如果符合就触发onMatch事件。

##events

onMatch:(matchInfo)， 符合弹出条件就会触发

onCursorChanged(matchInfo), 发现游标改动

onMiss() textarea 收到 space或者esc 就会触发要求弹出框关闭

onFocus() textarea 收到 down 的时候，就会触发，要求弹出框接管focus

default() 要求返回默认值。当在textarea接收到enter，并且弹出框是显示状态下。就会默认支持

##object
matchInfo对象。

* offset{left,top} 定位弹出框的位置，相对于body来说
* scrollTop 现在textarea的scrolltop的值
* set Function ，只是输入值
* hide Function，触发onMiss事件
* focus Function 从弹出框的焦点，focus回textarea上



(function($){
	$.fn.keypopup=function(opt){
		
		var options=$.extend({},defaultOpt,opt),
		
		$this=$(this).click(function(){			
			resetDiv.call(this);
		})
		.data("_keypopup",options);
		
		$this.mouseup(function(){			
			var sel, range,textarea=this;
			if (window.getSelection) {				
				console.debug(textarea.value.substring(0, textarea.selectionEnd));
			} else {				
				var range = document.selection.createRange(),
				dup_range = range.duplicate();				
				dup_range.moveToElementText(textarea);				
				dup_range.setEndPoint('EndToEnd', range);
				alert(dup_range.text);
    }
			
		})
		
		resetDiv.call(this);
	}
	
	
	function resetDiv()
	{
		var $this=$(this)
		,options=$this.data("_keypopup"),
		offset=$this.offset(),		
		size={
			height:$this.innerHeight(),
			width:$this.innerWidth(),
		}		
		if(!options._target)
		{
			options._target=$('<div style="position:absolute;width;background-color:red;z-index:-99999"></div>').appendTo("body")
		}
		
		
		options._target
		       .css("width",size.width)
				.css("height",size.height)
				.css("left",offset.left)
				.css("top",offset.top)
	}
	
	var defaultOpt={
		onMatch:false // 当match 到之后需要马上获得定位
	}
	
	function _shoJson(obj){
		alert(JSON.stringify(obj))
	}
})(jQuery)
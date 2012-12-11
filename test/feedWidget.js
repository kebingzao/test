var feedWidget={
//当前用户的id
userId:'null',
//按顺序输出widget
showWidget:function(){
	$.ajax({
			url: 'showWidgetData.php',
			data:{userid:feedWidget.userId},
			type: 'GET',
			dataType: 'json',
			error: function(json) {
				alert("读取有问题");
			},
			beforeSend: function () {
			},
			success: function(json) {
				if(json.msg=="success"){
					if(json.wleft!==""){
						var leftArr=json.wleft.split('$');
						for(var i=0;i<leftArr.length;i++){
							var uid=leftArr[i].substring(6);
							//alert(uid);
							if(uid.substring(0,3)=="rss"){
								rssMgr.getRssWidget(uid,"rssleft");
							}else if(uid.substring(0,3)=="flk"){
								flkMgr.getFlkWidget(uid,"rssleft");
							}
						}
					}
					if(json.wmid!==""){
						var midArr=json.wmid.split('$');
						for(var i=0;i<midArr.length;i++){
							var uid=midArr[i].substring(6);
							if(uid.substring(0,3)=="rss"){
								rssMgr.getRssWidget(uid,"rssmid");
							}else if(uid.substring(0,3)=="flk"){
								flkMgr.getFlkWidget(uid,"rssmid");
							}
						}
					}
					if(json.wright!==""){
						var rightArr=json.wright.split('$');
						for(var i=0;i<rightArr.length;i++){
							var uid=rightArr[i].substring(6);
							if(uid.substring(0,3)=="rss"){
								rssMgr.getRssWidget(uid,"rssright");
							}else if(uid.substring(0,3)=="flk"){
								flkMgr.getFlkWidget(uid,"rssright");
							}
						}
					}
				}
			}
		});	
},
//得到当前排序的顺序
getSort:function(){
	//左栏的widget
	var leftArr=$(".rsscon").eq(0).sortable("toArray");
	//中栏的widget
	var midArr=$(".rsscon").eq(1).sortable("toArray");
	//右栏的widget
	var rightArr=$(".rsscon").eq(2).sortable("toArray");
	//将widgets合成一个字符串
	//alert(left.join('$'));
	//var leftStr=left.join('$');
	//重新把字符串分解为数组
	//alert(leftStr.split('$').length);
	var leftStr=leftArr.join('$');
	var midStr=midArr.join('$');
	var rightStr=rightArr.join('$');
	$.ajax({
			url: 'changeSort.php',
			data:{user_id:feedWidget.userId,wtype:'1',wleft:leftStr,wmid:midStr,wright:rightStr},
			type: 'GET',
			dataType: 'json',
			error: function(json) {
				alert("保存失败");
			},
			beforeSend: function () {
			},
			success: function(json) {
				if(json.msg=="success"){
					//alert("保存顺序成功");
				}
			}
		});	
},
sort:function(){
		//引用主页面中的所有块
		//var els = ['#rssleft', '#rssmid','#rssright'];
		//var $els = $(els.toString());
		//var els=['.rsscon'];
		//动态添加“增加子项目”、“向上移动”按钮
		//$("h2", $els.slice(0,-1)).append('<span class="options"><a class="add"><img src="add.gif" border="0"></a></span>');
		//$("dt", $els).append('<span class="options"><a class="up"><img src="up.gif" border="0"></a></span>');
		
		//绑定相关事件
		//$("a.add").bind("click", addItem);
		//$("a.up").bind("click", moveUp);
		
		//使用jQuery插件
		$(".rsscon").sortable({
			items: '> div',	//拖拽对象
			cursor: 'move',	//鼠标样式
			handle:'.rsstitle,.flktitle',  //限制拖拽只能在标题栏中拖
			opacity: 0.8,	//拖拽时透明
			revert:true,
			placeholder: "ui-state-highlight",
			scroll:true,
			scrollSpeed:5,
			scrollSensitivity: 20,
			zIndex:20,
			connectWith: '.rsscon',
			start: function(e,ui) {
				$(".ui-state-highlight").css({
					marginTop:"10px",
					width:ui.item.width(),
					height:ui.item.height()
				});
				//alert("11");
			},
			stop:function(e,ui){
				feedWidget.getSort();
			}
		});
}
}
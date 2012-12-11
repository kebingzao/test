var flkMgr={
flkTitle:"null",
//flk的url
flkUrl:"null",
//flk组件的uid值
flkUid:"null",
//判断是否是第一次从flkWidget页面传过来
isFirst:false,
//接下来是item的各种分类数组的值
flkAllTotal:"null",
flkLinkArr:[],
flkTitleArr:[],
flkDescriptionArr:[],
//接下来判断是用何种方法显示，如果gallery的值为true，就用gallery的方式显示，如果是false，就在flk网站中显示,默认false
gallery:false,
//布局方式layout
layout:"Slides",
//判断是否是编辑条件而引起的加载事件
isClickOk:false,
//在生成缩略图的时候要一直调整高度，该属性用来比较
itemsHeight:0,
//该数组存放所有的flk数据，其中键为该flk的键值
flk:[],
//标记用户的id
userId:"null",
//该widget位于的区域块
include:'rssleft',
//创建一个flk外壳
createFlkWidget:function(uid){
  $("#"+flkMgr.include).append('<div class="widget" id="widget'+uid+'" ><div class="flktitle" id="title'+uid+'"></div><div class="flkedit" id="edit'+uid+'"></div><div class="flkitems" id="items'+uid+'"></div>');
},
//将所有的flickr数据保存起来，暂时先保存要作为缩略图的图像
addFlk:function(uid,photo,allTotal,descriptionArr){
		//填充flickr数组
		flkMgr.flk[uid]=new Array();
		flkMgr.flk[uid]['photo']=photo;
		flkMgr.flk[uid]['descriptionArr']=descriptionArr;
		flkMgr.flk[uid]['allTotal']=allTotal;
},
//用php做后台的方式来显示flk条目，以xml的格式返回
showFlkWithPhp:function(uid,url,layout,gallery){
	//如果是由编辑事件引起的加载，就不需要重建widget，如果是正常加载就重建
	if(flkMgr.isClickOk==true){
		//设置为false
		flkMgr.isClickOk=false;
	} else{
		//去掉原来的div
		$("#widget"+uid).remove();
		flkMgr.createFlkWidget(uid);
	}
	
	//赋给属性flkUrl
	flkMgr.flkUrl=url;
	if(flkMgr.isFlk(flkMgr.flkUrl)==false)
	{
		$("#title"+uid).html("此为非法的flickr源地址url，请输入合法的flickr源地址");
		return;
	}
	//if($("body").has("#FlkPhotoContainer").length!==0)
	//if($("body").find("#FlkPhotoContainer").length!==0)
	//{
	//		$("#FlkPhotoContainer").remove()
	//}
    $.ajax({
        url: 'flk.php',
		data:{addr:url},
        type: 'GET',
        dataType: 'xml',
        error: function(xml) {
           $("#widget"+uid).css({
				height:"60px",
				width:$("#"+flkMgr.include).width()
			});
			$("#items"+uid).html("对不起,由于某种原因,加载失败,你可以按刷新或者关闭该widget");
			$("#title"+uid).html("加载失败");
			//增加刷新按钮和关闭按钮
			$("#title"+uid).append('<span class="flkClose" id="close'+uid+'" ><img src="image/clo.jpg" /></span><span class="flkButton"><a id="refreshbtn'+uid+'" href="javascript:void(0)" >刷新</a></span>');
			//绑定刷新按钮事件
			$("#refreshbtn"+uid).bind("click",function(){
				//刷新相当于点击编辑ok键
				flkMgr.isClickOk=true;
				$("#widget"+uid).html('<div class="flktitle" id="title'+uid+'"></div><div class="flkedit" id="edit'+uid+'"></div><div class="flkitems" id="items'+uid+'">');
				flkMgr.showFlkWithPhp(uid,url,layout,gallery);
			});
			//绑定关闭按钮事件
			$("#close"+uid).bind("click",function(){
				if(window.confirm( "要刪除此widget吗? ")==true) 
				{ 
					flkMgr.deleteFlkData(flkMgr.userId,uid);
					$("#widget"+uid).remove();
				}
			});
        },
		beforeSend: function () {
			$("#edit"+uid).html("");
			$("#items"+uid).html("");
            $("#title"+uid).html("加载中，请稍后...");
			$("#widget"+uid).css({
				height:"30px",
				width:$("#"+flkMgr.include).width()
			});
        },
        success: function(xml) {
		        //alert('请求成功');
				//如果channel节点的个数为零，则为非法的flk源地址url
				if($(xml).find("channel").size()==0)
				{
				    $("#title"+uid).html("此为非法的flickr源地址url，请输入合法的flickr源地址");
					return;
				}
				$(xml).find("channel").each(function() {
				//获取总的标题
                var title = $(this).children("title").text();	
				
				//赋给属性flkTitle
				flkMgr.flkTitle=title;			
				
				//解析每个item
				var item_num = $(this).children("item").size();	
                var item_link = new Array();
                var item_title = new Array();
				var item_description=new Array();
				var item_photo=new Array();
				var item = $(this).find("item");
				for (var i=0;i<item_num ;i++) {
                    item_link[i] = item.eq(i).children("link").text();
                    item_title[i] = item.eq(i).children("title").text();
					item_description[i] = item.eq(i).children("description").text();
					item_photo[i]=item.eq(i).children("media\\:content").attr("url");
                }
				//将这些数组都赋给对应的属性值
				//把获取的总个数赋给属性flkAllTotal
				flkMgr.flkAllTotal=item_num;
				flkMgr.flkLinkArr=item_link;
				flkMgr.flkTitleArr=item_title;
				flkMgr.flkDescriptionArr=item_description;
				//将缩略图相片存放到flk数组中
				flkMgr.addFlk(uid,item_photo,item_num,item_description);
				
				var items = $("#items"+uid);	
				//要先清空items
				items.html("");
				
				//判断布局参数layout，如果是Thumbnails则，显示缩略图
				flkMgr.layout=layout;
				if(layout=="Thumbnails")
				{
					for (var j=0;j<item_num ;j++) {
						items.append('<span class="singleitem Thumbnails"><a id="flkimg'+j+'" href="'+flkMgr.flkLinkArr[j]+'" target="_blank"><img src="'+item.eq(j).children("media\\:thumbnail").attr("url")+'" /></a></span>');
						//加载图片完之后，可以再触发一下调整大小的事件
						$("#items"+uid+" .Thumbnails a img").load(function(){
							flkMgr.setBodySize(uid);
							//alert(uid);
						});
					}
					$(items).css({
						textAlign:"left"
					});
					//setInterval(flkMgr.setBodySize,3000,uid);
					//flkMgr.setIntervalBody(uid);
				}
				else if(layout=="Slides"){
					items.append('<div class="nvpager">'+flkMgr.juicePager(uid,0,flkMgr.flkAllTotal)+'</div>');
					items.append('<div class="singleitem Slides">'+flkMgr.flkDescriptionArr[0]+'</div>');
					//增加鼠标移动样式和改变内容里面的a标签的显示方式,并且增加标记id值
					flkMgr.addMouseStyle(uid);
					flkMgr.addTarget(uid,0);
					$(items).css({
						textAlign:"center"
					});					
				}

				//判断显示参数gallery的值，如果是true的话，就用相册的形式来打开，否则就在flk网站上打开
				flkMgr.gallery=gallery;
				
				//根据不同的布局显示相册
				if(gallery==true || gallery=="true"){
					flkMgr.showGallery(uid,0);
				}
            });
			//设置flickr的标题栏
			flkMgr.setTitle(uid);
			//初始化编辑框
			flkMgr.initEdit(uid);
			//根据参数设置编辑条件
			flkMgr.setEdit(uid,layout,gallery);
			//调整rss框的大小
			flkMgr.setBodySize(uid);
			//feedWidget.sort();
			//要重新刷新才行
			$(".rsscon").sortable("refresh");
			//保存到数据库中,其中flkMgr.userId为用户的id，uid为flk的id,接下来将配置信息存储到数据库中 
			flkMgr.saveFlkData(flkMgr.userId,uid,url,layout,gallery);
			//将容器重置为rssleft
			flkMgr.include="rssleft";
			//如果是新建的widget，要把位置保存到数据库中
			feedWidget.getSort();
        }
    })
},
setTitle:function(uid){
	//获取网站的favicon
	$("#title"+uid).html("");
	var fav="http://www.flickr.com/favicon.ico";
	//增加标题
	$("#title"+uid).append('<span class="flkTitle"><img style="width:16px;height:16px" src="'+fav+'" /><a href="'+flkMgr.flkUrl+'" target="_blank" >'+flkMgr.flkTitle+'</a></span>');
	//增加编辑按钮和关闭按钮
	$("#title"+uid).append('<span class="flkClose" id="close'+uid+'" ><img src="image/clo.jpg" /></span><span class="flkButton"><a id="editbtn'+uid+'" href="javascript:void(0)" >编辑</a></span>');
	//绑定编辑按钮事件
	$("#editbtn"+uid).toggle(
		function(){
			$(this).html("关闭编辑");
			$("#edit"+uid).show();
			//重新调整大小
			flkMgr.setBodySize(uid);
		},
		function(){
			$(this).html("编辑");
			$("#edit"+uid).hide();
			//重新调整大小
			flkMgr.setBodySize(uid);
		}
	);
	//绑定关闭按钮事件
	$("#close"+uid).bind("click",function(){
		if(window.confirm( "要刪除此widget吗? ")==true) 
		{ 
			flkMgr.deleteFlkData(flkMgr.userId,uid);
			$("#widget"+uid).remove();
		}
	});
},
//初始化编辑条件
initEdit:function(uid){
	$("#edit"+uid).css({
		display:"none"
	});
	$("#edit"+uid).html("");
	$("#edit"+uid).append('<table style="margin-left: 12px;margin-top: 7px;"><tr>'+
	'<td class="label">feed:</td><td class="editcontent"><input class="editurl" type="text" /></td></tr><tr>'+
	'<td class="label">布局:</td><td class="editcontent"><select class="editlayout"><option value="Slides" selected="selected">Slides</option><option value="Thumbnails">Thumbnails</option></select></td></tr><tr>'+
	'<td class="label">打开图片到:</td><td class="editcontent"><select class="editgallery"><option value="true" selected="selected">gallery</option><option value="false">Flickr site</option></select></td></tr><tr>'+
	'<td class="label"><input class="editok" id="ok'+uid+'" type="button" value="ok" /></td></tr></table>');
	//绑定ok事件
	$("#edit"+uid+" .editok").bind("click",function(){
		//得到编辑参数的值
		var editurl=$("#edit"+uid+" .editurl").val();
		var editlayout=$("#edit"+uid+" .editlayout").val();
		var editgallery=$("#edit"+uid+" .editgallery").val();
		var currentid=$(this).attr("id").toString().substring(2);
		//alert(currentid+".."+editurl+".."+editnum+".."+editdate+".."+editdetial+".."+editopen);
		//设置该事件加载事件是通过ok键引起的
		flkMgr.isClickOk=true;
		flkMgr.showFlkWithPhp(currentid,editurl,editlayout,editgallery);
	});
},
//根据参数设置编辑条件
setEdit:function(uid,layout,gallery){
	$("#edit"+uid+" .editurl").val(flkMgr.flkUrl);
	for(var i=0;i<$("#edit"+uid+" .editlayout option").length;i++){
		if($("#edit"+uid+" .editlayout option").eq(i).val()==layout){
			$("#edit"+uid+" .editlayout option").eq(i).attr("selected","selected");
		}
	}
	for(var i=0;i<$("#edit"+uid+" .editgallery option").length;i++){
		if($("#edit"+uid+" .editgallery option").eq(i).val()==(gallery+"")){
			$("#edit"+uid+" .editgallery option").eq(i).attr("selected","selected");
		}
	}
},
//设置div窗口的大小，动态改变
setBodySize:function(uid){
			//得到拖拉框的宽度
			var width=$("#"+flkMgr.include).width();
			var editHeight=$("#widget"+uid+" .flkedit").height();
			var itemsHeight=$("#widget"+uid+" .flkitems").height();
			//通过判断是否有编辑框来调整大小
			//alert($("#widget"+uid+" .flkedit").css("display"));
			if($("#widget"+uid+" .flkedit").css("display")=="none"){
				var height=itemsHeight+30;
			}else{
				var height=itemsHeight+editHeight+30;
			}
			//通过判断是否有显示细节来调整大小
			//if(rssMgr.showDetail==true){
			//	height=height+25;
			//}
			$("#widget"+uid).css({
					width:width,
					height:height
			});
},
//判断是以何种布局显示的，并根据不同的布局来显示相册
showGallery:function(uid,cnum){
	if(flkMgr.layout=="Slides"){
		//绑定内容里面的a标签中事件，并且该a标签里面要有img标签
		$("#items"+uid+" .Slides a").bind("click",function(event){
			//阻止事件的默认事件		
			//if($(this).has("img").length==1)
			if($(this).find("img").length==1)
			{
				//显示相册
				event.preventDefault();
				if(uid!=flkMgr.flkUid){
					if($("body").find("#FlkPhotoContainer").length!==0)
					{
						$("#FlkPhotoContainer").remove()
					}
					flkMgr.showPhotos(uid);
					flkMgr.flkUid=uid;
				}
				//显示所点击的图片,注意这边有个问题，如果点击之后，就不能再拖动了，这里要解决
				$("#FlkPhotoContainer").trigger('showimg', cnum);
				$("#photo,#FlkPhotoContainer").show();
				flkMgr.showOverLay();
				//$(".rsscon").sortable("refresh");
				//feedWidget.sort();
				//$(".rsscon").sortable("enable");
			}
		});
	}
	if(flkMgr.layout=="Thumbnails"){
		//绑定内容里面的a标签中事件，并且该a标签里面要有img标签
		$("#items"+uid+" .Thumbnails a").bind("click",function(event){
			//阻止事件的默认事件
			event.preventDefault();
			var anum=parseInt($(this).attr("id").substring(6));
			if(uid!=flkMgr.flkUid){
					if($("body").find("#FlkPhotoContainer").length!==0)
					{
						$("#FlkPhotoContainer").remove()
					}
					flkMgr.showPhotos(uid);
					flkMgr.flkUid=uid;
			}	
			$("#FlkPhotoContainer").trigger('showimg', anum);
			$("#photo,#FlkPhotoContainer").show();
			flkMgr.showOverLay();
			//$(".rsscon").sortable("refresh");
		});
	}
},
//为换页链接增加鼠标移动样式
addMouseStyle:function(uid){
		var acolor="#330000";
		$("#items"+uid+" .nvpager a").bind("mouseover",function(e){
		    //得到a链接原来的颜色
		    acolor=$(this).css("color");
			//给a链接改变颜色
			$(this).css({
			color:"#DD408E"
			});
		});
		//为条目的标题添加鼠标移出来的样式
		$("#items"+uid+" .nvpager a").bind("mouseout",function(){
			//还原a标签原来的颜色
			$(this).css({
			color:acolor
			});
		});

},
//根据当前的item的索引值来判断是要显示前一页，后一页
juicePager:function(uid,cnum,totalnum){
	var nvpager="";
	var nnum=cnum+1;
	var pnum=cnum-1;
	var idnum=uid.substring(3);
	if(cnum==0){
		nvpager="<a class='nextpage' href='javascript:void(0)' onclick='flkMgr.displayPage("+idnum+","+nnum+");' >后一页<img src='image/next.jpg' /></a>";
	}
	else if(cnum==totalnum-1){
		nvpager="<a class='prepage' href='javascript:void(0)' onclick='flkMgr.displayPage("+idnum+","+pnum+");' ><img src='image/pre.jpg' style='margin-right:5px'/>前一页</a>";
	} else {
		nvpager="<a class='prepage' href='javascript:void(0)' onclick='flkMgr.displayPage("+idnum+","+pnum+");' ><img src='image/pre.jpg' />前一页</a><a class='nextpage' href='javascript:void(0)' onclick='flkMgr.displayPage("+idnum+","+nnum+");' >后一页<img src='image/next.jpg' /></a>";
	}
	return nvpager;
},
//显示上下页的内容
displayPage:function(idnum,num){
		var uid="flk"+idnum;
		$("#items"+uid+" .nvpager").html("");
		$("#items"+uid+" .nvpager").append(flkMgr.juicePager(uid,num,flkMgr.flk[uid]['allTotal']));
		$("#items"+uid+" .Slides").html("");
		$("#items"+uid+" .Slides").append(flkMgr.flk[uid]['descriptionArr'][num]);
		flkMgr.addMouseStyle(uid);
		flkMgr.addTarget(uid,num);
		//如果是要显示相册，就添加显示相册事件
		if(flkMgr.gallery){
			flkMgr.showGallery(uid,num);
		}
		//动态改变app窗体大小
		flkMgr.setBodySize(uid);
},
//判断该地址是不是从flk过来的flk文件
isFlk:function(url){
		var re=/^http:\/\/api.flickr.com/;
		if(!url.match(re)){
			return false;
		}
		return true;
},
//修改内容里面的A标签，让它另开一个网页，并且显示其id值
addTarget:function(uid,cnum)
{
	if($("#items"+uid+" .Slides a").length!=0)
	{
		$("#items"+uid+" .Slides a").attr("target","_blank");
		//if($("#items"+uid+" .Slides a").has("img").length==1)
		if($("#items"+uid+" .Slides a").find("img").length==1)
		{
			$("#items"+uid+" .Slides a").attr("id","flkimg"+cnum);
			//加载图片完之后，可以再触发一下调整大小的事件
			$("#items"+uid+" .Slides a img").load(function(){
				flkMgr.setBodySize(uid);
				//alert(uid);
			});
		}
	}
},
//用相册的形式来打开，否则就在flk网站上打开
showPhotos:function(uid){
   //jquery如果版本太低的话会不能显示
	var item_photo=flkMgr.flk[uid]['photo'];
	photoflkMgr.showFlkPhoto(item_photo);
	flkMgr.showOverLay();
},
//过滤html标签，并取得里面的内容
replaceHtml:function(str){
	var newstr=str.replace(/<[^>]*>/g, "");
	return newstr;
},
//将对应的flkid的设置参数存放到数据库中保存
saveFlkData:function(userid,uid,url,layout,gallery){
		//暂时不考虑pagerPosition选项
		$.ajax({
        url: 'saveFlkData.php',
		data:{userid:userid,flkid:uid,url:url,layout:layout,gallery:gallery},
        type: 'GET',
        dataType: 'json',
        error: function(json) {
            alert("出错了");
        },
		beforeSend: function () {
        },
        success: function(json) {
			//alert("userid为 " +json.userid+"rssID为"+json.rssid);
			//alert(json.rssid+"save state is"+json.msg);
        }
    });
},
//从数据库中取出flk数据并显示出来，参数就是用户名
showFlkData:function(userid){
		$.ajax({
        url: 'showFlkData.php',
		data:{userid:userid},
        type: 'GET',
        dataType: 'json',
        error: function(json) {
            alert("好像加载不了");
        },
		beforeSend: function () {
        },
        success: function(json) {
			//提取返回的json数据，并显示rss框
			//alert(json.length);
			var length=json.length;
			for(var i=0;i<length;i++){
				//alert(json.data[i].url);
				var uid=json.data[i].uid;
				var url=json.data[i].url;
				var layout=json.data[i].layout;
				var gallery=json.data[i].gallery;
				if(gallery=="false"){
					gallery=false;
				}else{
					gallery=true;
				}
				flkMgr.showFlkWithPhp(uid,url,layout,gallery);
				feedWidget.sort();
			}
        }
    });
},
//根据uid来输出flickr数据生成widget
getFlkWidget:function(uid,include){
	var user_id=flkMgr.userId;
	$.ajax({
        url: 'getFlkWidget.php',
		data:{uid:uid,user_id:user_id},
        type: 'GET',
        dataType: 'json',
        error: function(json) {
            alert("好像加载不了");
        },
		beforeSend: function () {
        },
        success: function(json) {
			//提取返回的json数据，并显示rss框
			var uid=json.uid;
			var url=json.url;
			var layout=json.layout;
			var gallery=json.gallery;
			if(gallery=="false"){
				gallery=false;
			}else{
				gallery=true;
			}
			flkMgr.include=include;
			flkMgr.showFlkWithPhp(uid,url,layout,gallery);
			feedWidget.sort();
        }
    });
},
deleteFlkData:function(userid,uid){
		$.ajax({
        url: 'deleteFlkData.php',
		data:{userid:userid,uid:uid},
        type: 'GET',
        dataType: 'json',
        error: function(json) {
            alert("删除不了");
        },
		beforeSend: function () {
        },
        success: function(json) {
			//alert("userid为 " +json.userid+"rssID为"+json.rssid);
			//alert(json.rssid+"delete is"+json.msg);
        }
    });
},
//在点击相册的时候显示隐藏层
showOverLay:function(){
	var height=$(document).height()+30;
	$("#overlay").css({
		height:height
	});
	$("#overlay").show();
}
}
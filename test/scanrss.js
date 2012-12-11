var scanrssMgr={
rssAllTotal:"null",
rssTitleArr:[],
rssLinkArr:[],
rssPubDateArr:[],
rssDescriptionArr:[],
rssTitle:"null",
//表示当前是否是最大化,默认没有
isMax:false,
//设置最大化的size
MAXSIZE:"700px",
//设置正常的size
NORMAL:"479px",
//当前点击的a标签的num
currentClickNum:0,
//当前的url
cUrl:"null",
//判断当前的url于上一次的url是否相同
sameUrl:true,
//该数组存放所有的rss数据，其中键为该rss的键值
feed:[],
//将新增的feed加入到feed数组中
addFeed:function(uid,allTotal,titleArr,linkArr,pubDateArr,descriptionArr,title,rssUrl){
		//填充feed数组
		scanrssMgr.feed[uid]=new Array();
		scanrssMgr.feed[uid]['allTotal']=allTotal;
		scanrssMgr.feed[uid]['titleArr']=titleArr;
		scanrssMgr.feed[uid]['linkArr']=linkArr;
		scanrssMgr.feed[uid]['pubDateArr']=pubDateArr;
		scanrssMgr.feed[uid]['descriptionArr']=descriptionArr;
		scanrssMgr.feed[uid]['title']=title;
		scanrssMgr.feed[uid]['url']=rssUrl;
},
//初始化参数
initScanMgr:function(uid){
		var rssfeed=scanrssMgr.feed[uid];
		scanrssMgr.rssAllTotal=rssfeed['allTotal'];
		scanrssMgr.rssTitleArr=rssfeed['titleArr'];
		scanrssMgr.rssLinkArr=rssfeed['linkArr'];
		scanrssMgr.rssPubDateArr=rssfeed['pubDateArr'];
		scanrssMgr.rssDescriptionArr=rssfeed['descriptionArr'];
		scanrssMgr.rssTitle=rssfeed['title'];
		var url=rssfeed['url'];
		if(url==scanrssMgr.cUrl){
			scanrssMgr.sameUrl=true;
		}else{
			scanrssMgr.sameUrl=false;
			scanrssMgr.cUrl=url;
		}		
},
createScanWidget:function(){
  $("body").append('<div id="feedReader" dir="ltr" ><div id="feedReaderFrame"><div class="frame"></div><div></div>');
},
showScanRss:function(anum){
        //只有当没有创建的时候，才去创建浏览窗口和条目
		if($("body").find("#feedReader").length==0)
		{
			scanrssMgr.createScanWidget();
			scanrssMgr.createBaseScan();
			//在itemContainer中加入rss条目
			scanrssMgr.PushItemContainer();
		} else {
			//当前后两次的url不一样的时候，要重刷rss条目
			$("#feedReaderHeadlinesFrame .itemContainer").html("");
			scanrssMgr.PushItemContainer();
			//换标题
			$("#feedReaderFrame .frame .header .rssTitle").html(''+scanrssMgr.rssTitle+'( '+scanrssMgr.rssAllTotal+' )');
		}
		//动态设置最大化的高度
		scanrssMgr.MAXSIZE=parseInt($(window).height()-150)+"px";
		//alert(scanrssMgr.MAXSIZE);
		//显示浏览窗口
		$("#feedReader").css({
				display:"block"
		});
		//得到当前点击的a标签的num
		scanrssMgr.currentClickNum=anum;
		//在itemContainer中给对应标题加上样式
		scanrssMgr.AddStyleItemContainer(anum);
		//去掉原来的内容
		//if($("#feedReaderContentFrame").has(".contentInsideFrame").length!==0)
		if($("#feedReaderContentFrame").find(".contentInsideFrame").length!==0)
		{
			$("#feedReaderContentFrame .iframe-container").html("");	 
			$("#feedReaderContentFrame .contentInsideFrame").html("");
		}
		//在contentInsideFrame里面增加标题和内容
		scanrssMgr.createFeedContent(anum);
		//alert(scanrssMgr.rssTitle);
},
//增加浏览窗口的基本构造
createBaseScan:function(){
		//增加浏览窗口的头部
		$("#feedReaderFrame .frame").append('<div class="header"></div>');
		//增加浏览窗口的主体
		$("#feedReaderFrame .frame").append('<div class="feedReaderFrame2"></div>');
		//为头部添加内容
		//标题，切换按钮，关闭按钮，最大最小化按钮
		$("#feedReaderFrame .frame .header").append('<span  class="rssTitle" >'+scanrssMgr.rssTitle+'( '+scanrssMgr.rssAllTotal+' )</span>');
		$("#feedReaderFrame .frame .header").append('<img class="windowclose" title="关闭" alt="关闭" src="image/close.jpg" />');
		$("#feedReaderFrame .frame .header").append('<img class="changesize"  title="最大化" alt="最大化" src="image/max.jpg" />');
		$("#feedReaderFrame .frame .header").append('<a href="#" class="show-website" >显示网站</a>');
		
		//增加主体部分,里面是一个table
		$("#feedReaderFrame .frame .feedReaderFrame2").append('<table id="readerTable"  cellspacing="0" cellpadding="0" ><tbody><tr></tr></tbody></table>');
		//在table增加一行三列
		$("#readerTable tbody tr").append('<td id="headlines" class="tdHeadlines" ></td>');
		$("#readerTable tbody tr").append('<td class="tdSeparator"></td>');
		$("#readerTable tbody tr").append('<td id="content" class="tdContent"></td>');
		//在tdHeadlines中增加内容
		$("#headlines").append('<div id="feedReaderHeadlinesFrame"></div>');
		//在feedReaderHeadlinesFrame中增加内容
		$("#feedReaderHeadlinesFrame").append('<div class="itemContainer"></div>');
		//在tdContent中增加内容
		$("#content").append('<div id="feedReaderContentFrame" ></div>');
		//feedReaderContentFrame中添加feed视图
		$("#feedReaderContentFrame").append('<div class="contentInsideFrame" style="display: block;"></div>');
		//在feedReaderContentFrame中添加显示网站的视图
		$("#feedReaderContentFrame").append('<div class="iframe-container" style="display:none;"></div>');
		//添加样式
		$("#feedReaderContentFrame .iframe-container").css({
			textAlign:"center"
		});	
		//为关闭按钮添加点击事件
		$("#feedReaderFrame .frame .header .windowclose").bind("click",function(){
			$("#feedReader").hide();
			$("#rssContain,.widget").show();
			//最后调整widget框的大小
			$("#rssContain").find("[id^=widget]").each(function(){
				var uid=$(this).attr("id").substring(6);
				if(uid.substring(0,3)=="rss"){
					rssMgr.setBodySize(uid);
				}else if(uid.substring(0,3)=="flk"){
					flkMgr.setBodySize(uid);
					//alert(uid+".."+$(this).height());
					//第二次调整是为了调整
					setTimeout(function(){
						flkMgr.setBodySize(uid);
					}, 200);
				}
			});
		});
		//为显示网站按钮添加点击事件
		$("#feedReaderFrame .frame .header .show-website").toggle(
		function(event){
			event.preventDefault();
			//显示网站，并隐藏feed视图
			scanrssMgr.showIframeWebView(scanrssMgr.currentClickNum);
			$("#feedReaderContentFrame .iframe-container").css({
				display:"block"
			});
			$("#feedReaderContentFrame .contentInsideFrame").css({
				display:"none"
			});
			//最后改变该按钮的值
			$(this).html("返回feed视图");
		},
		function(event){
			//显示feed视图，隐藏原有网站
			event.preventDefault();
			scanrssMgr.showContentInsideFrame(scanrssMgr.currentClickNum);
			$("#feedReaderContentFrame .iframe-container").css({
				display:"none"
			});
			$("#feedReaderContentFrame .contentInsideFrame").css({
				display:"block"
			});
			//最后改变该按钮的值
			$(this).html("显示网站");
		}
		);
		//为最大最小化添加事件
		$("#feedReaderFrame .frame .header .changesize").toggle(
			function(){
				$(this).attr("src","image/min.jpg");
				$(this).attr("title","正常");
				$(this).attr("alt","正常");
				//隐藏rss框
				$("body .widget").hide(); 
				//并把浏览窗口的高度给拉大
				$("#readerTable").css({
					height:scanrssMgr.MAXSIZE
				});
				//把浏览列表框也拉大
				$("#feedReaderHeadlinesFrame").css({
					height:scanrssMgr.MAXSIZE
				});
				//把内容框也拉大
				$("#feedReaderContentFrame,.iframe-container,.iframe-webview").css({
					height:scanrssMgr.MAXSIZE
				});
				//标记现在是最大化状态
				scanrssMgr.isMax=true;
			},
			function(){
				$(this).attr("src","image/max.jpg");
				$(this).attr("title","最大化");
				$(this).attr("alt","最大化");
				//显示rss框
				$("body .widget").show(); 
				//并把浏览窗口的高度给恢复正常
				$("#readerTable").css({
					height:scanrssMgr.NORMAL
				});
				$("#feedReaderHeadlinesFrame").css({
					height:scanrssMgr.NORMAL
				});
				$("#feedReaderContentFrame,.iframe-container,.iframe-webview").css({
					height:scanrssMgr.NORMAL
				});
				//标记现在是正常状态
				scanrssMgr.isMax=false;
				//alert("2");
			}
		);
		
},
//在feedReaderContentFrame中显示原网站页面
showIframeWebView:function(anum){
		$("#feedReaderContentFrame .iframe-container").html(""); 
		var iframestr='<iframe class="iframe-webview" frameborder="0" src="'+scanrssMgr.rssLinkArr[anum]+'"></iframe>';
		$("#feedReaderContentFrame .iframe-container").append(iframestr);
		//alert(scanrssMgr.iframeWidth);
		//如果是放大状态，就调用放大后的尺寸
		if(scanrssMgr.isMax)
		{
				$("#feedReaderContentFrame,.iframe-container,.iframe-webview").css({
					height:scanrssMgr.MAXSIZE,
					width:scanrssMgr.iframeWidth
				});
		}
		else{
				$("#feedReaderContentFrame,.iframe-container,.iframe-webview").css({
					height:scanrssMgr.NORMAL,
					width:scanrssMgr.iframeWidth
				});
		}
		//alert($("#feedReaderContentFrame .iframe-container iframe-webview").css("height"));
		//alert(scanrssMgr.MAXSIZE);
		/*
		$("#feedReaderContentFrame .iframe-container").append('<span style="vertical-align:middle;"><img src="image/loading.gif" alt="正在加载中" /></span>');
		$("#feedReaderContentFrame .iframe-container .iframe-webview").load(function(){
			$("#feedReaderContentFrame .iframe-container").css({
			paddingTop:"0px"
			});	
			$(this).css({
				display:"block"
			});
			$(this).parent().find("span").css({
				display:"none"
			});
		    //alert("加载成功");
		});
		*/
},
//在feedReaderContentFrame中显示feed视图页面
showContentInsideFrame:function(anum){
		$("#feedReaderContentFrame .contentInsideFrame").html("");
		$("#feedReaderContentFrame .contentInsideFrame").append('<div class="title"></div><div class="feedContent"></div>');
		$("#feedReaderContentFrame .contentInsideFrame .title").append('<a target="_blank" href="'+scanrssMgr.rssLinkArr[anum]+'">'+scanrssMgr.rssTitleArr[anum]+'</a><br/>');
		$("#feedReaderContentFrame .contentInsideFrame .title").append('<span>'+scanrssMgr.rssPubDateArr[anum]+'</span>');
		$("#feedReaderContentFrame .contentInsideFrame .feedContent").append(scanrssMgr.rssDescriptionArr[anum]);
},
createFeedContent:function(anum){

		//接下来判断是显示那个
		if($("#feedReaderContentFrame .contentInsideFrame").css("display")!="none")
		{
			scanrssMgr.showContentInsideFrame(anum);
		}
		
		if($("#feedReaderContentFrame .iframe-container").css("display")!="none")
		{
			scanrssMgr.showIframeWebView(anum);
		}
},
//在ItemContainer中给点击的条目加上样式
AddStyleItemContainer:function(anum){
		$("[id^=itemlist]").css({
		border:"none",
		borderBottom:"1px solid #F2F2F2"
		});
		$('#itemlist'+anum+'').css({
		border:"2px solid #008000"
		});
},
//在itemContainer中加入rss条目,并给里面的a标签添加绑定事件和设置移动样式
PushItemContainer:function(){
		var itemlist="";
		for(var i=0;i<scanrssMgr.rssAllTotal;i++)
		{
			itemlist+='<div id="itemlist'+i+'" ><a href="'+scanrssMgr.rssLinkArr[i]+'">'+scanrssMgr.rssTitleArr[i]+'</a></div>';
		}
		//alert(itemlist);
		$("#feedReaderHeadlinesFrame .itemContainer").append(itemlist);
		//为这些div加上样式
		//$("[id^=itemlist]").css({
		//	fontSize:"13px",
		//	backgroundColor:"#ffffff",
		//	borderBottom:"1px solid #F2F2F2",
		//	padding:'3px'
		//});
		//给里面的a标签设置移动样式
		var acolor="#330000";
		$("[id^=itemlist] a").bind("mouseover",function(e){
			//得到a链接原来的颜色
		    acolor=$(this).css("color");
			//给a链接改变颜色
			$(this).css({
			color:"#DC67A3"
			});
		});
		//为条目的标题添加鼠标移出来的样式
		$("[id^=itemlist] a").bind("mouseout",function(){
			//还原a标签原来的颜色
			$(this).css({
			color:acolor
			});
		});
		//添加点击事件
		$("[id^=itemlist] a").bind("click",function(event){
			//阻止a标签的默认事件跳转
			event.preventDefault();
			var anum=parseInt($(this).parent().attr("id").substring(8));
			scanrssMgr.showScanRss(anum);
			//rssMgr.showHere(anum);
		});
}
}
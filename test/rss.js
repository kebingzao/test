var rssMgr={
//每页显示的记录数  
pageSize:8,
//要显示的条目数，默认为10条
num:10,
//分页链接的位置，默认在最小面
pagerPosition:"Bottom",
//是否显示日期(true为显示，false为不显示),默认是true
showDate:"true",
//显示更多细节(true为显示，false为不显示),默认是false
showDetail:"false",
//rss的标题
rssTitle:"null",
//rss的url
rssUrl:"null",
//rss的uid,保存这个页面的所有rss框的uid
rssAllUid:[],
//当前页面的uid
rssUid:0,
//该rss网站的favicon
rssFavicon:"null",
//判断是否是第一次从feedWidget页面传过来
isFirst:false,
//判断是否是编辑条件而引起的加载事件
isClickOk:false,
//一些时间常量
YEAR:31536000000,
MONTH:2592000000,
WEEK:604800000,
DAY:86400000,
HOUR:3600000,
MINUTE:60000,
//接下来是item的各种分类数组的值
rssAllTotal:"null",
rssLinkArr:[],
rssTitleArr:[],
rssPubDateArr:[],
rssDescriptionArr:[],
//当前用户的ID
userId:"null",
//该widget位于的区域块
include:'rssleft',
//创建一个rss外壳
createRssWidget:function(uid){
  $("#"+rssMgr.include).append('<div class="widget" id="widget'+uid+'"><div class="rsstitle" id="title'+uid+'"></div><div class="rssedit" id="edit'+uid+'"></div><div class="rssitems" style="padding-left:17px" id="items'+uid+'"><ul style="list-style-type:square" ></ul></div><div id="itempages'+uid+'" class="rssitemspages"></div></div>');
},
//用php做后台的方式来显示rss条目，以xml的格式返回
showRssWithPhp:function(uid,url,num,pagerPosition,showDate,showDetail,openHere){
	//如果是由编辑事件引起的加载，就不需要重建widget，如果是正常加载就重建
	if(rssMgr.isClickOk==true){
		//设置为false
		rssMgr.isClickOk=false;
	} else{
		//去掉原来的div
		$("#widget"+uid).remove();
		rssMgr.createRssWidget(uid);
	}
	
	//$("#items"+uid).children("ul").html("");
	//$("#itempages"+uid).html("");
	//赋给属性rssUrl
	rssMgr.rssUrl=url
    $.ajax({
        url: 'rss.php',
		data:{addr:url},
        type: 'GET',
        dataType: 'xml',
        error: function(xml) {
            //alert('请求出错'+xml);
			$("#widget"+uid).css({
				height:"60px",
				width:$("#"+rssMgr.include).width()
			});
			$("#items"+uid).html("对不起,由于某种原因,加载失败,你可以按刷新或者关闭该widget");
			$("#title"+uid).html("加载失败");
			//增加刷新按钮和关闭按钮
			$("#title"+uid).append('<span class="rssClose" id="close'+uid+'" ><img src="image/clo.jpg" /></span><span class="rssButton"><a id="refreshbtn'+uid+'" href="javascript:void(0)" >刷新</a></span>');
			//绑定刷新按钮事件
			$("#refreshbtn"+uid).bind("click",function(){
				//刷新相当于点击编辑ok键
				rssMgr.isClickOk=true;
				$("#widget"+uid).html('<div class="rsstitle" id="title'+uid+'"></div><div class="rssedit" id="edit'+uid+'"></div><div class="rssitems" id="items'+uid+'"><ul style="list-style-type:square" ></ul></div><div id="itempages'+uid+'" class="rssitemspages"></div>');
				rssMgr.showRssWithPhp(uid,url,num,pagerPosition,showDate,showDetail,openHere);
			});
			//绑定关闭按钮事件
			$("#close"+uid).bind("click",function(){
				if(window.confirm( "要刪除此widget吗? ")==true) 
				{ 
					rssMgr.deleteRssData(rssMgr.userId,uid);
					$("#widget"+uid).remove();	
				}	
			});
		},
		beforeSend: function () {
			$("#edit"+uid).html("");
			$("#items"+uid).children("ul").html("");
			$("#itempages"+uid).html("");
            $("#title"+uid).html("加载中，请稍后...");
			$("#widget"+uid).css({
				height:"30px",
				width:$("#"+rssMgr.include).width()
			});
        },
        success: function(xml) {
		        //alert('请求成功');
				//如果channel节点的个数为零，则为非法的rss源地址url
				if($(xml).find("channel").size()==0)
				{
				    $("#title"+uid).html("此为非法的rss源地址url，请输入合法的rss源地址");
				}
				$(xml).find("channel").each(function() {
				//获取总的标题
                var title = $(this).children("title").text();
				//赋给属性rssTitle
				rssMgr.rssTitle=title;
				//alert(rssMgr.rssTitle);
				
				
				//解析每个item
				var item_num = $(this).children("item").size();
				//获取指定的文章个数并比较
				//如果传递过来的num为空或者没有传进来，就使用默认值
				if(num+"" == "undefined" || num==null){
				     num=rssMgr.num;
				}
				if(parseInt(num)<parseInt(item_num))
				{
					   item_num=num;
				}
				
                var item_link = new Array();
                var item_title = new Array();
				var item_pubDate=new Array();
				//var item_source=new Array();
				//var item_author=new Array();
				var item_description=new Array();
				for (var i=0;i<item_num ;i++) {
                    var item = $(this).find("item");
                    item_link[i] = item.eq(i).children("link").text();
                    item_title[i] = item.eq(i).children("title").text();
					item_pubDate[i] = item.eq(i).children("pubDate").text();
					//item_source[i] = item.eq(i).children("source").text();
					//item_author[i] = item.eq(i).children("author").text();
					item_description[i] = item.eq(i).children("description").text();
					//alert(item_description[i].replace(/<[^>]*>/g, ""));
                }
				//将这些数组都赋给对应的属性值
				//把获取的总个数赋给属性rssAllTotal
				rssMgr.rssAllTotal=item_num;
				rssMgr.rssLinkArr=item_link;
				rssMgr.rssTitleArr=item_title;
				rssMgr.rssPubDateArr=item_pubDate;
				rssMgr.rssDescriptionArr=item_description;
				
				
				var items = $("#items"+uid);	
				//要先清空items
				items.children("ul").html("");
				//先判断选项是否显示帖子日期
				//如果没有定义或者为空，或者是true，就显示日期
				if(showDate+"" == "undefined" || showDate==null || showDate==true)
				{
					for (var j=0;j<item_num ;j++) {
						items.children("ul").append('<li><div class="singleimg">'+rssMgr.getDescriptionImg(item_description[j])+'</div><div class="singleitem" title="'+rssMgr.subString(rssMgr.replaceHtml(item_description[j]),90,true)+'"><a id="a'+j+'" href="'+item_link[j]+'">'+item_title[j]+'</a>&nbsp;&nbsp;<span>'+rssMgr.getTime(item_pubDate[j])+
						'</span></div><div></div></li>');
					}
				}
				else{
				    //如果不是，则就是不显示日期
					for (var j=0;j<item_num ;j++) {
						items.children("ul").append('<li><div class="singleimg">'+rssMgr.getDescriptionImg(item_description[j])+'</div><div class="singleitem" title="'+rssMgr.subString(rssMgr.replaceHtml(item_description[j]),90,true)+'"><a id="a'+j+'" href="'+item_link[j]+'">'+item_title[j]+'</a></div><div></div></li>');
					}
				}
				//一定要全部加载完之后才能为其添加样式和事件
				//判断是显示更多细节，还是没有，默认是没有，showDetail
				//如果没有定义或者为空，或者是false，就不显示细节
				rssMgr.showDetail=showDetail;
				if(showDetail+"" == "undefined" || showDetail==null || showDetail==false)
				{
					//如果不显示细节，就不要显示分页
					rssMgr.pageSize=25;
					rssMgr.addMouseStyleWithNoDetail(uid);
				}
				else{
				//如果为true就显示细节,显示细节的时候才要显示分页
					rssMgr.pageSize=8;
					rssMgr.displayPage(uid.substring(3),0);
				    rssMgr.addMouseStyleWithDetail(uid);	
				}
				//判断是否直接在这个网站打开的选项
				//如果没有定义或者为空，或者是false，就在自己的网站上来显示，openHere
				//增加feed数据
				scanrssMgr.addFeed(uid,rssMgr.rssAllTotal,rssMgr.rssTitleArr,rssMgr.rssLinkArr,rssMgr.rssPubDateArr,rssMgr.rssDescriptionArr,rssMgr.rssTitle,rssMgr.rssUrl);
				if(openHere+"" == "undefined" || openHere==null || openHere==false)
				{	
					
					//绑定所有的a标签的事件
					$("#items"+uid+" li .singleitem").bind("click",function(event){
						//阻止a标签的默认事件跳转
						event.preventDefault();
						//alert($(this).parent().parent().parent().attr("id").substring(5));
						var cuid=$(this).parent().parent().parent().attr("id").substring(5);
						//初始化scanrssMgr类的参数,要得到当前点击的rss的id
						scanrssMgr.initScanMgr(cuid);
						//点击过后改变a标签的颜色表示已经读过
						$(this).find("a").css({
							color:"#999999"
						});
						var anum=parseInt($(this).find("a").attr("id").substring(1));
						$("#rssContain").css({
							display:"none"
						});						
						scanrssMgr.showScanRss(anum);
					});
					$("#items"+uid+" li .singleimg").bind("click",function(event){
						//初始化scanrssMgr类的参数
						var cuid=$(this).parent().parent().parent().attr("id").substring(5);
						scanrssMgr.initScanMgr(cuid);
						var anum=parseInt($(this).parent().find(".singleitem a").attr("id").substring(1));
						$("#rssContain").css({
							display:"none"
						});
						scanrssMgr.showScanRss(anum);
					});
				}
				else{
				//如果为true，就在它所属的网站打开
					rssMgr.showNotHere(uid);
				}
            });
			
			//设置rss的标题栏
			rssMgr.setTitle(uid);
			//初始化编辑框
			rssMgr.initEdit(uid);
			//根据参数设置编辑条件
			rssMgr.setEdit(uid,url,num,showDate,showDetail,openHere);
			//调整rss框的大小
			rssMgr.setBodySize(uid);
			//feedWidget.sort();
			//要重新刷新才行
			$(".rsscon").sortable("refresh");
			//保存到数据库中,其中rssMgr.userId为用户的id，uid为rss的id,接下来将配置信息存储到数据库中 
			rssMgr.saveRssData(rssMgr.userId,uid,url,num,pagerPosition,showDate,showDetail,openHere);
			//将容器重置为rssleft
			rssMgr.include="rssleft";
			//如果是新建的widget，要把位置保存到数据库中
			feedWidget.getSort();
        }
    })
},
//设置rss的标题栏
setTitle:function(uid){
	//获取网站的favicon
	$("#title"+uid).html("");
	var fav=rssMgr.getFavicon();
	//增加标题
	$("#title"+uid).append('<span class="rssTitle"><img style="width:16px;height:16px" src="'+fav+'" /><span class="rssNum">('+rssMgr.rssAllTotal+')</span><a href="'+rssMgr.rssUrl+'" target="_blank" >'+rssMgr.rssTitle+'</a></span>');
	//增加编辑按钮和关闭按钮
	$("#title"+uid).append('<span class="rssClose" id="close'+uid+'" ><img src="image/clo.jpg" /></span><span class="rssButton"><a id="editbtn'+uid+'" href="javascript:void(0)" >编辑</a></span>');
	//绑定编辑按钮事件
	$("#editbtn"+uid).toggle(
		function(){
			$(this).html("关闭编辑");
			$("#edit"+uid).show();
			//重新调整大小
			rssMgr.setBodySize(uid);
		},
		function(){
			$(this).html("编辑");
			$("#edit"+uid).hide();
			//重新调整大小
			rssMgr.setBodySize(uid);
		}
	);
	//绑定关闭按钮事件
	$("#close"+uid).bind("click",function(){
		if(window.confirm( "要刪除此widget吗? ")==true) 
		{ 
			rssMgr.deleteRssData(rssMgr.userId,uid);
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
	'<td class="label">标题:</td><td class="editcontent"><input class="edittitle" type="text" /></td></tr><tr>'+
	'<td class="label">feed:</td><td class="editcontent"><input class="editurl" type="text" /></td></tr><tr>'+
	'<td class="label">要显示的条目数:</td><td class="editcontent"><select class="editnum"><option value="10" selected="selected">10</option><option value="15">15</option><option value="20">20</option><option value="25">25</option></select></td></tr><tr>'+
	'<td class="label">显示更多细节:</td><td class="editcontent"><input class="editdetial" type="checkbox" /></td></tr><tr>'+
	'<td class="label">显示帖子日期:</td><td class="editcontent"><input class="editdate" type="checkbox" checked="checked"/></td></tr><tr>'+
	'<td class="label">直接在网站上打开:</td><td class="editcontent"><input class="editopen" type="checkbox" /></td></tr><tr>'+
	'<td class="label"><input class="editok" id="ok'+uid+'" type="button" value="ok" /></td></tr></table>');
	//绑定ok事件
	$("#edit"+uid+" .editok").bind("click",function(){
		//得到编辑参数的值
		var editurl=$("#edit"+uid+" .editurl").val();
		var editnum=$("#edit"+uid+" .editnum").val();
		if($("#edit"+uid+" .editdate").attr("checked")=="checked"){
			var editdate=true;
		}else { 
		var editdate=false;}
		if($("#edit"+uid+" .editdetial").attr("checked")=="checked"){
			var editdetial=true;
		}else {
			var editdetial=false;}
		if($("#edit"+uid+" .editopen").attr("checked")=="checked"){
			var editopen=true;
		}else {
			var editopen=false;
		}
		var currentid=$(this).attr("id").toString().substring(2);
		//alert(currentid+".."+editurl+".."+editnum+".."+editdate+".."+editdetial+".."+editopen);
		//设置该事件加载事件是通过ok键引起的
		rssMgr.isClickOk=true;
		rssMgr.showRssWithPhp(currentid,editurl,editnum,null,editdate,editdetial,editopen);
		
	});
},
//根据参数设置编辑条件
setEdit:function(uid,url,num,showDate,showDetail,openHere){
	$("#edit"+uid+" .edittitle").val(rssMgr.rssTitle);
	$("#edit"+uid+" .editurl").val(url);
	for(var i=0;i<$("#edit"+uid+" .editnum option").length;i++){
		if(parseInt($("#edit"+uid+" .editnum option").eq(i).val())==num){
			$("#edit"+uid+" .editnum option").eq(i).attr("selected","selected");
		}
	}
	if(showDetail==true){
		$("#edit"+uid+" .editdetial").attr("checked","checked");
	}else{
		$("#edit"+uid+" .editdetial").removeAttr("checked");
	}
	if(showDate==true){
		$("#edit"+uid+" .editdate").attr("checked","checked");
	}else{
		$("#edit"+uid+" .editdate").removeAttr("checked");
	}
	if(openHere==true){
		$("#edit"+uid+" .editopen").attr("checked","checked");
	}else{
		$("#edit"+uid+" .editopen").removeAttr("checked");
	}
},
//设置div窗口的大小，动态改变
setBodySize:function(uid){
			//var width=$("#widget"+uid).width()+15;
			//得到拖拉框的宽度
			var width=$("#"+rssMgr.include).width();
			var editHeight=$("#widget"+uid+" .rssedit").height()
			var itemsHeight=$("#widget"+uid+" .rssitems").height();
			//通过判断是否有编辑框来调整大小
			if($("#widget"+uid+" .rssedit").css("display")=="none"){
				var height=itemsHeight+45;
			}else{
				var height=itemsHeight+editHeight+45;
			}
			//通过判断是否有显示细节来调整大小
			if(rssMgr.showDetail==true){
				height=height+25;
			}
			$("#widget"+uid).css({
					width:width,
					height:height
			});
},
//根据openHere选项来判断条目在哪里打开，这里是它所属的网站打开
showNotHere:function(uid){
		$("#items"+uid+" li .singleitem").each(function(){
			$(this).find("a").attr('target','_blank');
		});
},
//为rss条目增加鼠标移动样式,选项是不显示细节的
addMouseStyleWithNoDetail:function(uid){
		//首先先把显示图片的div框隐藏
		$("#items"+uid+" li .singleimg").css({
			display:"none"
		});
		
		var mouseon=false;
		var acolor="#330000";
		var bgcolor="#ffffff";
        //为条目的标题添加鼠标移过去的样式
		$("#items"+uid+" li .singleitem").bind("mouseover",function(e){
		    //得到a链接原来的颜色
		    acolor=$(this).find("a").css("color");
			//得到背景色
			bgcolor=$(this).css("background-color");
			$(this).css({
			backgroundColor:"#FFFFE0",
			borderBottom:"1px solid #EFE2BA"
			});
			//给a链接改变颜色
			$(this).find("a").css({
			color:"#FF6600"
			});
			//取得该对象的title属性作为提示信息显示，当然你也可以指定其他属性;
			var tip = $(this).attr('title');
			// 判断当前是否鼠标停留在对象上,可以修正ie6下出现的意外Bug;
			mouseon=true;
			// 清空内容，因为title属性浏览器默认会有提示;
			$(this).attr('title','');
			// 创建提示信息的容器，样式自定;
			$(this).append('<div id="tooltip"><div>' + tip + '</div></div>');
			// 取得鼠标坐标来指定提示容器的位置;
			var y=(e.pageY+10)+"px";
			var x=(e.pageX+15)+"px";
			$('#tooltip').css({
				zIndex:"300",
			    border:"1px solid #EFE2BA",
			    width:"280px",
				padding:"3px",
				color:"#000000",
			    backgroundColor:"#FFFFE0",
				position:"absolute",
				top:y,
				left:x
			}).show();
		});
		//在条目上移动
		$("#items"+uid+" li .singleitem").bind("mousemove",function(e){
			var y=(e.pageY+10)+"px";
			var x=(e.pageX+15)+"px";
			$('#tooltip').css({
			  zIndex:"300",
			  border:"1px solid #EFE2BA",
		      width:"280px",
			  padding:"3px",
			  color:"#000000",
			  backgroundColor:"#FFFFE0",
			  position:"absolute",   
              top:y,
			  left:x
        });
			//alert(e.pageY);
			//alert($('#tooltip').css("top"));
		});
		//为条目的标题添加鼠标移出来的样式
		$("#items"+uid+" li .singleitem").bind("mouseout",function(){
			$(this).css({
			backgroundColor:bgcolor,
			borderBottom:""
			});
			//还原a标签原来的颜色
			$(this).find("a").css({
			color:acolor
			});
			if(mouseon==true){
				$(this).attr('title',$('#tooltip div').html());
				$('#tooltip').remove();
				mouseon=false;
			}
		});

},
//为rss条目增加鼠标移动样式,选项是显示细节的
addMouseStyleWithDetail:function(uid)
{
		//显示图片框
		$("#items"+uid+" li .singleimg").each(function(){
			if($(this).html()=="null")
			{
				$(this).css({
					display:"none"
				});
			} else{
				$(this).css({
					display:"block",
					float:"left",
					marginRight:"20px"
				});
				$(this).find("img").css({
					width:"60px",
					height:"60px"
				});
			}
		});
		//循环遍历条目，并输出内容
		$("#items"+uid+" li .singleitem").each(function(){
			var tip=$(this).attr('title');
			//alert(tip);
			$(this).attr('title','');
			$(this).parent().find("div:last").html(tip);
			$(this).parent().find("div:last").css({
				color:"#444444",
				cursor:"auto"
			});
			$(this).parent().parent().css({
				listStyleType:"none"
			});
			$(this).parent().css({
				padding:"6px",
				height:"61px"
			});
			$(this).find("a").css({
			fontWeight:"bold"
			});
		});
		//隔行换色
		$("#items"+uid+" li:even").css({
		     backgroundColor:"#E5E5E5",
		});
},
addPageStyle:function(uid){
		//为换页链接增加鼠标移动样式
		var acolor="#330000";
		$("#itempages"+uid+" a").bind("mouseover",function(e){
		    //得到a链接原来的颜色
		    acolor=$(this).css("color");
			//给a链接改变颜色
			$(this).css({
			color:"#DD408E"
			});
		});
		//为条目的标题添加鼠标移出来的样式
		$("#itempages"+uid+" a").bind("mouseout",function(){
			//还原a标签原来的颜色
			$(this).css({
			color:acolor
			});
		});
},
//根据当前的item的索引值来判断是要显示前一页，后一页
juicePager:function(uid,cnum){
	//计算页数
	var totalnum=parseInt(($("#items"+uid+" ul li").length-1)/rssMgr.pageSize)+1;//根据记录条数，计算页数     
	var nvpager="";
	var nnum=cnum+1;
	var pnum=cnum-1;
	var idnum=uid.substring(3);
	if(cnum==0){
		nvpager="<a class='nextpage' href='javascript:void(0)' onclick='rssMgr.displayPage("+idnum+","+nnum+");' >后一页<img src='image/next.jpg' /></a>";
	}
	else if(cnum==totalnum-1){
		nvpager="<a class='prepage' href='javascript:void(0)' onclick='rssMgr.displayPage("+idnum+","+pnum+");' ><img src='image/pre.jpg' />前一页</a>";
	} else {
		nvpager="<a class='prepage' href='javascript:void(0)' onclick='rssMgr.displayPage("+idnum+","+pnum+");' ><img src='image/pre.jpg' />前一页</a><a class='nextpage' href='javascript:void(0)' onclick='rssMgr.displayPage("+idnum+","+nnum+");' >后一页<img src='image/next.jpg' /></a>";
	}
	$("#itempages"+uid).html(nvpager);
	rssMgr.addPageStyle(uid);
},
/*
//显示分页控制列表
pageLabel:function(){
		var page=($("#items ul li").length-1)/rssMgr.pageSize+1;//根据记录条数，计算页数      
		//alert($("#items ul li").length);
		var pageLabel='';
		for(i=1;i<=page;i++){      
				pageLabel+="<a href='javascript:void("+i+")' id='p"+i+"' class='page' onclick='rssMgr.displayPage("+i+");'>"+i+"";      
		}
		$("#itempages").html(pageLabel);//显示分页控制列表     
},
*/
//显示分页记录
displayPage:function(idnum,page){ 
		var uid="rss"+idnum;
		rssMgr.juicePager(uid,page);
		var begin=page*rssMgr.pageSize;//起始记录号      
		var end=(page+1)*rssMgr.pageSize;//终止记录号      
		$("#items"+uid+" ul li").hide();      
		$("#items"+uid+" ul li").each(function(i){     
		//显示第page页的记录   
        if(i>=begin && i<end ){
		   $(this).show();      
		}
		});  
		//接下来是根据展示大小来调整APP窗口
		rssMgr.setBodySize(uid);		
},
//判断输入的内容是不是正整数
isNumber:function(elem){
		var str=elem.val();
		var re=/^\d*$/;
		str=str.toString();
		if(!str.match(re)){
			alert("只能输入正整数");
			return false;
		}
		return true;
},
//先转换为时间戳再转换日期格式
getTime:function(str){
		//转换为时间戳
		var timenum=Date.parse(str);
		var re=/^\d*$/;
		//alert(timenum);
		var timenum2=timenum.toString();
		if(!timenum2.match(re)){
			//如果转换时间戳失败，就原样输出
			return str;
		}
		else{
			//当前时间
			var nownum=Date.parse(new Date());
			//得到相差的时间戳
			var diffnum=nownum-timenum;
			var time=new Date(diffnum);
			var year=parseInt(diffnum/rssMgr.YEAR);
			var month=parseInt((diffnum%rssMgr.YEAR)/rssMgr.MONTH);
			var week=parseInt((diffnum%rssMgr.MONTH)/rssMgr.WEEK);
			var day=parseInt((diffnum%rssMgr.WEEK)/rssMgr.DAY);
			var hour=parseInt((diffnum%rssMgr.DAY)/rssMgr.HOUR);
			var minute=parseInt((diffnum%rssMgr.HOUR)/rssMgr.MINUTE);
			//alert((diffnum%rssMgr.WEEK));
			if(year>0)
			{
				return year+"年前";
			} else if (month>0) {
				return month+"月前";
			} else if (week>0) {
				return week+"星期前";
			} else if (day>0){
				return day+"天前";
			} else if (hour>0){
				return hour+"小时前";
			} else if (minute>0){
				return minute+"分钟前";
			} else {
			//由于时间差的关系，可能会会返回一些比当前时间还要大的值
				return "in the future";
			}
		
		}
},
//中文截取字符串长度，len为截取字符串的个数,hasDot是判断是否出现...
subString:function(str, len, hasDot){
		var newLength = 0; 
		var newStr = ""; 
		var chineseRegex = /[^\x00-\xff]/g; 
		var singleChar = ""; 
		var strLength = str.replace(chineseRegex,"**").length; 
		for(var i = 0;i < strLength;i++) 
		{ 
			singleChar = str.charAt(i).toString(); 
			if(singleChar.match(chineseRegex) != null) 
			{ 
				newLength += 2; 
			}     
			else 
			{ 
				newLength++; 
			} 
			if(newLength > len) 
			{ 
				break; 
			} 
			newStr += singleChar; 
		} 
		 
		if(hasDot && strLength > len) 
		{ 
			newStr += "..."; 
		} 
		return newStr; 
},
//过滤html标签，并取得里面的内容
replaceHtml:function(str){
	var newstr=str.replace(/<[^>]*>/g, "");
	return newstr;
},
//获取内容里面的第一张图片，在显示细节的情况下显示
getDescriptionImg:function(str){
	//var re=/<img[^>]* \/>/;
	//注意空格的个数
	var re=/<img[^>]*\s*\/>/;
	var newstr=str.match(re);
	return newstr;
},
//获取该rss网站的favicon.ico
getFavicon:function(){
	var re=/^http:\/\/[^\/]*/;
	var icon=rssMgr.rssUrl.match(re);
	//有点网站的rss链接会没有favicon，这时候就要到首页网站去下载favicon
	var re2=/\..*/;
	var favicon=icon.toString().match(re2);
	var faviconstr="http://www"+favicon+"/favicon.ico";
	rssMgr.rssFavicon=faviconstr;
	return faviconstr;
},
//将对应的rssid的设置参数存放到数据库中保存
saveRssData:function(userid,uid,url,num,pagerPosition,showDate,showDetail,openHere){
//alert(userid);
		//暂时不考虑pagerPosition选项
		$.ajax({
        url: 'saveRssData.php',
		data:{userid:userid,rssid:uid,url:url,num:num,showDate:showDate,showDetail:showDetail,openHere:openHere},
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
//从数据库中取出rss数据并显示出来，参数就是用户名
showRssData:function(userid){
		$.ajax({
        url: 'showRssData.php',
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
				var num=json.data[i].num;
				var showDetail=json.data[i].showDetail;
				if(showDetail=="false"){
					showDetail=false;
				}else{
					showDetail=true;
				}
				var showDate=json.data[i].showDate;
				if(showDate=="false"){
					showDate=false;
				}else{
					showDate=true;
				}
				var openHere=json.data[i].openHere;
				if(openHere=="false"){
					openHere=false;
				}else{
					openHere=true;
				}
				//alert(openHere);
				rssMgr.showRssWithPhp(uid,url,num,"null",showDate,showDetail,openHere);
				feedWidget.sort();
			}
        }
    });
},
//根据uid来输出rss数据生成widget
getRssWidget:function(uid,include){
    var user_id=rssMgr.userId;
	$.ajax({
        url: 'getRssWidget.php',
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
			var num=json.num;
			var showDetail=json.showDetail;
			if(showDetail=="false"){
				showDetail=false;
			}else{
				showDetail=true;
			}
			var showDate=json.showDate;
			if(showDate=="false"){
				showDate=false;
			}else{
				showDate=true;
			}
			var openHere=json.openHere;
			if(openHere=="false"){
				openHere=false;
			}else{
				openHere=true;
			}
				//alert(openHere);
			rssMgr.include=include;
			rssMgr.showRssWithPhp(uid,url,num,"null",showDate,showDetail,openHere);
			feedWidget.sort();
        }
    });
},
deleteRssData:function(userid,uid){
		//暂时不考虑pagerPosition选项
		$.ajax({
        url: 'deleteRssData.php',
		data:{userid:userid,rssid:uid},
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
}
}
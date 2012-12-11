<?php

	include "pdo_rss.php";

    //$userid=$_GET['userid'];
	//$rssid=$_GET['rssid'];
	//$json=array("userid"=>$userid,"rssid"=>$rssid);
	//echo json_encode($json);
	if(isset($_GET['rssid'])){
		$rssid=$_GET['rssid'];
	}
	if(isset($_GET['url'])){
		$url=$_GET['url'];
	}
	if(isset($_GET['num'])){
		$num=$_GET['num'];
	}
	if(isset($_GET['showDate'])){
		$showDate=$_GET['showDate'];
	}
	if(isset($_GET['showDetail'])){
		$showDetail=$_GET['showDetail'];
	}
	if(isset($_GET['openHere'])){
		$openHere=$_GET['openHere'];
	}
	if (isset($_GET['userid']) && isset($_GET['rssid'])) {
		$rss = new Rss();
		$rss->add_widget($_GET['userid'], $_GET['rssid']);
			//如果把该widget_id存放到数据库中了，接下来就把该widget的配置信息也存放到数据库中
		$rss->add_rss_data($_GET['userid'],$rssid,$url,$num,$showDetail,$showDate,$openHere);
		$msg="success";
	} 
	$json=array("msg"=>$msg,"rssid"=>$rssid);
	echo json_encode($json);
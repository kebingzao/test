<?php

	include "pdo_rss.php";
	if (isset($_GET['userid']) && isset($_GET['rssid'])) {
		$rss = new Rss();
		//如果把该widget_id存放到数据库中了，接下来就把该widget的配置信息也存放到数据库中
		$rss->delete_widget($_GET['userid'],$_GET['rssid']);
		$msg="success";
	} 
	$json=array("msg"=>$msg,"rssid"=>$rssid);
	echo json_encode($json);
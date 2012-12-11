<?php

	include "pdo_rss.php";

    //$userid=$_GET['userid'];
	//$rssid=$_GET['rssid'];
	//$json=array("userid"=>$userid,"rssid"=>$rssid);
	//echo json_encode($json);
	if (isset($_GET['userid']) && isset($_GET['rssid'])) {
		$rss = new Rss();
		$rss->add_widget($_GET['userid'], $_GET['rssid']);
		$msg="save success";
	} 
	$json=array("msg"=>$msg);
	echo json_encode($json);
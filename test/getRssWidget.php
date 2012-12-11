<?php

	include "pdo_rss.php";

    //$userid=$_GET['userid'];
	//$rssid=$_GET['rssid'];
	//$json=array("userid"=>$userid,"rssid"=>$rssid);
	//echo json_encode($json);
	if (isset($_GET['uid']) && isset($_GET['user_id'])) {
		$rss = new Rss();
		$result=$rss->get_rss_widget($_GET['uid'],$_GET['user_id']);
		if($result!=="false"){
			echo json_encode($result);
		}
	} else{
		$json=array("msg"=>"false");
		echo json_encode($json);
	}
	
<?php

	include "pdo_flk.php";

    //$userid=$_GET['userid'];
	//$rssid=$_GET['rssid'];
	//$json=array("userid"=>$userid,"rssid"=>$rssid);
	//echo json_encode($json);
	if (isset($_GET['uid']) && isset($_GET['user_id'])) {
		$flk = new Flk();
		$result=$flk->get_flk_widget($_GET['uid'],$_GET['user_id']);
		if($result!=="false"){
			echo json_encode($result);
		}
	} else{
		$json=array("msg"=>"false");
		echo json_encode($json);
	}
	
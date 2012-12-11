<?php

	include "pdo_widget.php";
	
	$data=array();
	$data['user_id']=(isset($_GET['user_id'])) ? $_GET['user_id'] : "null";
	$data['wtype']=(isset($_GET['wtype']))? $_GET['wtype'] : "1";
	$data['wleft']=(isset($_GET['wleft'])) ? $_GET['wleft'] : "null";
	$data['wmid']=(isset($_GET['wmid'])) ? $_GET['wmid'] : "null";
	$data['wright']=(isset($_GET['wright'])) ? $_GET['wright'] : "null";
	$widget = new Widget();
	$result=$widget->changeSort($data);
	if($result!=false){
		$msg="success";
		$json=array("msg"=>$msg);
	}else{
		$msg="false";
		$json=array("msg"=>$msg);
	}
	
	echo json_encode($json);
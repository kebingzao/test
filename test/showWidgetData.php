<?php

	include "pdo_widget.php";

    //$userid=$_GET['userid'];
	//$flkid=$_GET['flkid'];
	//$json=array("userid"=>$userid,"flkid"=>$flkid);
	//echo json_encode($json);
	if (isset($_GET['userid'])) {
		$widget = new Widget();
		$result=$widget->show_widget($_GET['userid']);
		if($result!=="false"){
			$json=json_encode($result);
			echo $json;
		}
	} else{
		$json=array("msg"=>"false");
		echo json_encode($json);
	}
	
<?php

	include "pdo_flk.php";

    //$userid=$_GET['userid'];
	//$flkid=$_GET['flkid'];
	//$json=array("userid"=>$userid,"flkid"=>$flkid);
	//echo json_encode($json);
	if(isset($_GET['flkid'])){
		$flkid=$_GET['flkid'];
	}
	if(isset($_GET['url'])){
		$url=$_GET['url'];
	}
	if(isset($_GET['layout'])){
		$layout=$_GET['layout'];
	}
	if(isset($_GET['gallery'])){
		$gallery=$_GET['gallery'];
	}
	if (isset($_GET['userid']) && isset($_GET['flkid'])) {
		$flk = new Flk();
		$flk->add_widget($_GET['userid'], $_GET['flkid']);
		//如果把该widget_id存放到数据库中了，接下来就把该widget的配置信息也存放到数据库中
		$flk->add_flk_data($_GET['userid'],$flkid,$url,$layout,$gallery);
		$msg="success";
	} 
	$json=array("msg"=>$msg,"flkid"=>$flkid);
	echo json_encode($json);
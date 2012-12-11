<?php

	include "pdo_rss.php";
	if (isset($_GET['userid'])) {
		$rss = new Rss();
		//得到该用户订阅的widget的索引的最大值
		$maxcount=$rss->get_max_count($_GET['userid']);
		$msg="success";
	
		$json=array("msg"=>$msg,"maxcount"=>$maxcount);
		echo json_encode($json);
	}
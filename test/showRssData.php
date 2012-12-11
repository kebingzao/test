<?php

	include "pdo_rss.php";

    //$userid=$_GET['userid'];
	//$rssid=$_GET['rssid'];
	//$json=array("userid"=>$userid,"rssid"=>$rssid);
	//echo json_encode($json);
	if (isset($_GET['userid'])) {
		$rss = new Rss();
		$result=$rss->show_rss($_GET['userid']);
		if($result!=="false"){
			//$json=array("msg"=>"success","data"=>json_encode($result));
			//echo json_encode($json);
			$length=count($result);
			$data='{"length":'.$length.',"data":[';
			for($i=0;$i<$length;$i++){
				$data.=$result[$i].",";
			}
			$json=substr($data,0,-1)."]}";
			echo $json;
		}
	} else{
		$json=array("msg"=>"false");
		echo json_encode($json);
	}
	
<?php

	include "pdo_flk.php";

    //$userid=$_GET['userid'];
	//$flkid=$_GET['flkid'];
	//$json=array("userid"=>$userid,"flkid"=>$flkid);
	//echo json_encode($json);
	if (isset($_GET['userid'])) {
		$flk = new Flk();
		$result=$flk->show_flk($_GET['userid']);
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
	
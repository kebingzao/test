<?php
    $xmlurl=$_GET['addr'];
    //$xmlurl = "http://news.baidu.com/n?cmd=1&class=internews&tn=rss&sub=0";
    header('Content-type:application/xml');
    $fp = file_get_contents($xmlurl) or die("can not open $xmlurl");
    echo $fp;
	//echo $xmlurl;
<?php

// Set these values to your database access info
define("PDO_DSN", "mysql:dbname=widget;host=localhost");
define("PDO_USER", "root");
define("PDO_PASS", "111589");


class Rss{
    private $db;

    public function __construct() {
        try {
            $this->db = new PDO(PDO_DSN, PDO_USER, PDO_PASS);
        } catch (PDOException $e) {
            die('Connection failed: ' . $e->getMessage());
        }
    }

    function __destruct() {
        $this->db = null; // Release db connection
    }

    private function handle_exception($e) {
        echo "Database error: " . $e->getMessage();
        exit;
    }

	//该表的主键有两个，为user_id,uid
	//ALTER TABLE  `rssinfo` DROP PRIMARY KEY ,
	//ADD PRIMARY KEY (  `user_id` ,  `uid` )
	
	//将用户的id和widget的id插入到表中
    public function add_widget($user_id, $widget_id) {
        try {
        	//首先判断该用户存不存在
        	if($this->user_id_exist($user_id)===true){
        	//如果该widget_id不存在才插入
				if($this->widget_id_exist($widget_id,$user_id)===false){
					$sql = "insert into widgets (user_id, widget_id) values (:user_id, :widget_id)";
					$stmt = $this->db->prepare($sql);
					$stmt->bindParam(":user_id", $user_id, PDO::PARAM_STR);
					$stmt->bindParam(":widget_id", $widget_id, PDO::PARAM_STR);
					$stmt->execute();
					return true;
				}
        	}
        	return false;
        } catch (PDOException $e) {
            $this->handle_exception($e);
        }
    }

	//判断widget_id有没有已经在widgets表中存在
	protected function widget_id_exist($widget_id,$user_id) {
        try {
            $sql = "select widget_id from widgets where widget_id = :widget_id and user_id = :user_id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(":widget_id", $widget_id, PDO::PARAM_STR);
            $stmt->bindParam(":user_id", $user_id, PDO::PARAM_STR);
            $stmt->execute();

            $result = $stmt->fetch(PDO::FETCH_ASSOC);
			//如果不存在，就返回false
            if ($result === false){
                return false;
			}
			return true;
        } catch (PDOException $e) {
            $this->handle_exception($e);
        }
    }
	//将rss的配置信息加入到数据库中，先判断该rssid是否存在，如果存在，就更新，如果不存在，就插入
	public function add_rss_data($user_id,$uid,$url,$num,$showDetail,$showDate,$openHere) {
        try {
			//如果该widget_id不存在才插入
			if($this->rssinfo_id_exist($uid,$user_id)===false){
				$sql = "insert into rssinfo (user_id,uid,url,num,showDetail,showDate,openHere) values (:user_id,:uid,:url,:num,:showDetail,:showDate,:openHere)";
			}else{
			//如果存在就更新
				$sql="update rssinfo set url=:url,num=:num,showDetail=:showDetail,showDate=:showDate,openHere=:openHere where uid=:uid and user_id=:user_id";
			}
			$stmt = $this->db->prepare($sql);
			$stmt->bindParam(":user_id", $user_id, PDO::PARAM_STR);
			$stmt->bindParam(":uid", $uid, PDO::PARAM_STR);
			$stmt->bindParam(":url", $url, PDO::PARAM_STR);
			$stmt->bindParam(":num", $num, PDO::PARAM_STR);
			$stmt->bindParam(":showDetail", $showDetail, PDO::PARAM_STR);
			$stmt->bindParam(":showDate", $showDate, PDO::PARAM_STR);
			$stmt->bindParam(":openHere", $openHere, PDO::PARAM_STR);
			$stmt->execute();
        } catch (PDOException $e) {
            $this->handle_exception($e);
        }
    }
	//判断uid有没有已经在rssinfo表中存在
	protected function rssinfo_id_exist($uid,$user_id) {
        try {
            $sql = "select uid from rssinfo where uid = :uid and user_id=:user_id";
            $stmt = $this->db->prepare($sql);
			$stmt->bindParam(":user_id", $user_id, PDO::PARAM_STR);
            $stmt->bindParam(":uid", $uid, PDO::PARAM_STR);
            $stmt->execute();

            $result = $stmt->fetch(PDO::FETCH_ASSOC);
			//如果不存在，就返回false
            if ($result === false){
                return false;
			}
			return true;
        } catch (PDOException $e) {
            $this->handle_exception($e);
        }
    }
	//通过用户名来判断用户名在user表中是否存在
	protected function user_id_exist($username) {
        try {
            $sql = "select user_id from user where username = :username";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(":username", $username, PDO::PARAM_STR);
            $stmt->execute();

            $result = $stmt->fetch(PDO::FETCH_ASSOC);
			//如果不存在，就返回false
            if ($result === false){
                return false;
			}
			return true;
        } catch (PDOException $e) {
            $this->handle_exception($e);
        }
    }
	//通过userid来找到该用户订阅的rss
	public function show_rss($userid) {
        try {
			//只有该用户存在的时候才会去查询
			//存放rss数据的二维数组
			$rssData=array();
			if($this->user_id_exist($userid)===true){
				$reg="rss%";
				$sql = "select widget_id from widgets where user_id = :userid and widget_id like :reg";
				$stmt = $this->db->prepare($sql);
				$stmt->bindParam(":userid", $userid, PDO::PARAM_STR);
				$stmt->bindParam(":reg",$reg, PDO::PARAM_STR);
				$stmt->execute();
				//表示该用户订阅的rss的个数
				$count=0;
				while($row = $stmt->fetch(PDO::FETCH_ASSOC))
				{
					$uid=$row['widget_id'];
					$sql2 = "select * from rssinfo where uid = :uid and user_id=:userid";
					$stmt2 = $this->db->prepare($sql2);
					$stmt2->bindParam(":userid", $userid, PDO::PARAM_STR);
					$stmt2->bindParam(":uid", $uid, PDO::PARAM_STR);
					$stmt2->execute();
					$row2 = $stmt2->fetch(PDO::FETCH_ASSOC);
					$arr=array();
					$arr["uid"]=$row2['uid'];
					$arr["url"]=$row2['url'];
					$arr["num"]=$row2['num'];
					$arr["showDetail"]=$row2['showDetail'];
					$arr["showDate"]=$row2['showDate'];
					$arr["openHere"]=$row2['openHere'];
					$rssData[$count]=json_encode($arr);
					$count=$count+1;
				}
				//最后设置一个字段表示rss的个数，并传递过去
				return $rssData;
			} else{
				return "false";
			}
        } catch (PDOException $e) {
            $this->handle_exception($e);
        }
    }
	//根据uid来提前rss数据
	public function get_rss_widget($uid,$user_id){
		try {
			//只有该用户存在的时候才会去查询
			//存放rss数据的二维数组
			$rssData=array();
			if($this->rssinfo_id_exist($uid,$user_id)===true){
				
				$sql2 = "select * from rssinfo where uid = :uid and user_id=:user_id";
				$stmt2 = $this->db->prepare($sql2);
				$stmt2->bindParam(":user_id", $user_id, PDO::PARAM_STR);
				$stmt2->bindParam(":uid", $uid, PDO::PARAM_STR);
				$stmt2->execute();
				$row2 = $stmt2->fetch(PDO::FETCH_ASSOC);
				$rssData["uid"]=$row2['uid'];
				$rssData["url"]=$row2['url'];
				$rssData["num"]=$row2['num'];
				$rssData["showDetail"]=$row2['showDetail'];
				$rssData["showDate"]=$row2['showDate'];
				$rssData["openHere"]=$row2['openHere'];
				return $rssData;
			} else{
				return "false";
			}
        } catch (PDOException $e) {
            $this->handle_exception($e);
        }
	}
	//删除操作，将该用户的widget_id对应的widget的信息删除掉
    public function delete_widget($user_id, $widget_id) {
        try {
			//只有该widget_id存在才需要删除，以后要根据widget_id的前三个字符来判断是flickr还是rss
			if($this->widget_id_exist($widget_id,$user_id)===true){
				$name=substr($widget_id,0,3);
				if($name=="rss"){
					$sql = "delete from rssinfo where uid=:uid and user_id=:user_id";
					$stmt = $this->db->prepare($sql);
					$stmt->bindParam(":user_id", $user_id, PDO::PARAM_STR);
					$stmt->bindParam(":uid", $widget_id, PDO::PARAM_STR);
					$stmt->execute();
					$sql = "delete from widgets where user_id=:user_id and widget_id=:widget_id";
					$stmt = $this->db->prepare($sql);
					$stmt->bindParam(":user_id", $user_id, PDO::PARAM_STR);
					$stmt->bindParam(":widget_id", $widget_id, PDO::PARAM_STR);
					$stmt->execute();
				}
			}
        } catch (PDOException $e) {
            $this->handle_exception($e);
        }
    }
	//从数据库中获取该用户所订阅的widget的索引最高值
	public function get_max_count($user_id) {
        try {
			$sql = "select widget_id from widgets where user_id = :user_id";
			$stmt = $this->db->prepare($sql);
			$stmt->bindParam(":user_id", $user_id, PDO::PARAM_STR);
			$stmt->execute();
			$max_count=0;
			while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
					$count=substr($row['widget_id'],3);
					//取得索引的最大值
					if($count>$max_count){
						$max_count=$count;
					}
			}
			return $max_count;
        } catch (PDOException $e) {
            $this->handle_exception($e);
        }
    }
}

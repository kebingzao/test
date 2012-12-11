<?php

// Set these values to your database access info
define("PDO_DSN", "mysql:dbname=widget;host=localhost");
define("PDO_USER", "root");
define("PDO_PASS", "111589");


class Widget{
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

	//将拖拽的顺序存入到数据库中
    public function changeSort($data) {
        try {
			//只有当该用户存在时，并且如果该widget_id不存在才插入
        	if($this->user_id_exist($data['user_id'])===true){
        		if($this->widget_type_exist($data['wtype'],$data['user_id'])==false){
					$sql = "insert into sort (user_id,wtype,wleft,wmid,wright) values (:user_id, :wtype, :wleft, :wmid, :wright)";
				}else{
					//如果存在就修改
					$sql="update sort set wtype=:wtype,wleft=:wleft,wmid=:wmid,wright=:wright where user_id=:user_id";
				}
				$stmt = $this->db->prepare($sql);
				$stmt->bindParam(":user_id", $data['user_id'], PDO::PARAM_STR);
				$stmt->bindParam(":wtype", $data['wtype'], PDO::PARAM_STR);
				$stmt->bindParam(":wleft", $data['wleft'], PDO::PARAM_STR);
				$stmt->bindParam(":wmid", $data['wmid'], PDO::PARAM_STR);
				$stmt->bindParam(":wright", $data['wright'], PDO::PARAM_STR);
				$stmt->execute();
        	}
			return true;
        } catch (PDOException $e) {
            $this->handle_exception($e);
        }
    }

	//判断sort有没有该类型的排序
	protected function widget_type_exist($wtype,$user_id) {
        try {
            $sql = "select wtype from sort where wtype = :wtype and user_id=:user_id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(":wtype", $wtype, PDO::PARAM_STR);
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
	//通过user_id来找到该用户订阅的所有widget，并返回该widget的顺序
	public function show_widget($user_id) {
        try {
			//只有该用户存在的时候才会去查询
			//存放flk数据的二维数组
			$widgetData=array();
			//echo "dd";
			if($this->user_id_exist($user_id)===true){
				$sql = "select wleft,wmid,wright from sort where user_id = :user_id";
				$stmt = $this->db->prepare($sql);
				$stmt->bindParam(":user_id", $user_id, PDO::PARAM_STR);
				$stmt->execute();
				//表示该用户订阅的flk的个数
				while($row = $stmt->fetch(PDO::FETCH_ASSOC))
				{
					$widgetData["wleft"]=$row['wleft'];
					$widgetData["wmid"]=$row['wmid'];
					$widgetData["wright"]=$row['wright'];			
				}
				$widgetData["msg"]="success";
				//最后设置一个字段表示flk的个数，并传递过去
				return $widgetData;
			} else{
				//如果还没有该用户，就新建一个用户的个性化
				$this->create_user($user_id);
				return "false";
			}
        } catch (PDOException $e) {
            $this->handle_exception($e);
        }
    }
    //创建一个新用户
    public function create_user($username){
    	$sql = "insert into user (username) values (:username)";
		$stmt = $this->db->prepare($sql);
		$stmt->bindParam(":username", $username, PDO::PARAM_STR);
		$stmt->execute();
		return true;
    }
}

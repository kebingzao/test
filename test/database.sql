CREATE TABLE `widgets` (
`id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
`user_id` VARCHAR( 20 ) NOT NULL COMMENT '用户的id',
`widget_id` VARCHAR( 20 ) NOT NULL COMMENT 'widget的id'
) ENGINE = MYISAM ;




CREATE TABLE `rssInfo` (
`uid` VARCHAR( 20 ) NOT NULL COMMENT 'rss的uid',
`url` VARCHAR( 300 ) NOT NULL COMMENT 'rss的url',
`num` VARCHAR( 20 ) NOT NULL COMMENT 'rss的条目数',
`showDetail` VARCHAR( 10 ) NOT NULL COMMENT '是否显示细节',
`showDate` VARCHAR( 10 ) NOT NULL COMMENT '是否显示日期',
`openHere` VARCHAR( 10 ) NOT NULL COMMENT '是否在本网站打开',
PRIMARY KEY ( `uid` )
) ENGINE = MYISAM ;


CREATE TABLE `flkinfo` (
`uid` VARCHAR( 10 ) NOT NULL COMMENT 'flickr的uid',
`url` VARCHAR( 300 ) NOT NULL COMMENT 'flickr的url',
`layout` VARCHAR( 50 ) NOT NULL COMMENT 'flickr的布局',
`gallery` VARCHAR( 50 ) NOT NULL COMMENT 'flickr的展示方式',
PRIMARY KEY ( `uid` )
) ENGINE = MYISAM COMMENT = 'flickr的配置信息';


//建立一个表存储排序的值
CREATE TABLE `sort` (
`user_id` VARCHAR( 20 ) NOT NULL COMMENT '用户的id',
`wtype` VARCHAR( 10 ) NOT NULL DEFAULT '1' COMMENT '排序的类型',
`wleft` VARCHAR( 100 ) NULL COMMENT '左边栏的widget排序',
`wmid` VARCHAR( 100 ) NULL COMMENT '中栏的widget排序',
`wright` VARCHAR( 100 ) NULL COMMENT '中栏的widget排序'
) ENGINE = MYISAM ;
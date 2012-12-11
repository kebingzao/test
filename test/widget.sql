-- phpMyAdmin SQL Dump
-- version 2.10.3
-- http://www.phpmyadmin.net
-- 
-- 主机: localhost
-- 生成日期: 2012 年 04 月 14 日 10:56
-- 服务器版本: 5.0.51
-- PHP 版本: 5.2.6

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

-- 
-- 数据库: `widget`
-- 

-- --------------------------------------------------------

-- 
-- 表的结构 `flkinfo`
-- 

CREATE TABLE `flkinfo` (
  `user_id` varchar(100) NOT NULL,
  `uid` varchar(10) NOT NULL COMMENT 'flickr的uid',
  `url` varchar(300) NOT NULL COMMENT 'flickr的url',
  `layout` varchar(50) NOT NULL COMMENT 'flickr的布局',
  `gallery` varchar(50) NOT NULL COMMENT 'flickr的展示方式',
  PRIMARY KEY  (`user_id`,`uid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='flickr的配置信息';

-- 
-- 导出表中的数据 `flkinfo`
-- 

INSERT INTO `flkinfo` VALUES ('gsting3', 'flk2', 'http://api.flickr.com/services/feeds/photos_public.gne?id=26907150@N08&lang=zh-hk&format=rss_200', 'Slides', 'true');
INSERT INTO `flkinfo` VALUES ('kebingzao', 'flk2', 'http://api.flickr.com/services/feeds/photos_public.gne?id=26907150@N08&lang=zh-hk&format=rss_200', 'Slides', 'true');
INSERT INTO `flkinfo` VALUES ('gsting3', 'flk3', 'http://api.flickr.com/services/feeds/photos_public.gne?id=26907150@N08&lang=zh-hk&format=rss_200', 'Thumbnails', 'true');

-- --------------------------------------------------------

-- 
-- 表的结构 `rssinfo`
-- 

CREATE TABLE `rssinfo` (
  `user_id` varchar(100) NOT NULL,
  `uid` varchar(20) NOT NULL COMMENT 'rss的uid',
  `url` varchar(300) NOT NULL COMMENT 'rss的url',
  `num` varchar(20) NOT NULL COMMENT 'rss的条目数',
  `showDetail` varchar(10) NOT NULL COMMENT '是否显示细节',
  `showDate` varchar(10) NOT NULL COMMENT '是否显示日期',
  `openHere` varchar(10) NOT NULL COMMENT '是否在本网站打开',
  PRIMARY KEY  (`user_id`,`uid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- 
-- 导出表中的数据 `rssinfo`
-- 

INSERT INTO `rssinfo` VALUES ('gsting3', 'rss1', 'http://news.163.com/special/00011K6L/rss_newstop.xml', '10', 'false', 'true', 'false');
INSERT INTO `rssinfo` VALUES ('kebingzao', 'rss3', 'http://news.163.com/special/00011K6L/rss_newstop.xml', '10', 'false', 'true', 'false');
INSERT INTO `rssinfo` VALUES ('kebingzao', 'rss4', 'http://news.163.com/special/00011K6L/rss_newstop.xml', '10', 'false', 'true', 'false');

-- --------------------------------------------------------

-- 
-- 表的结构 `sort`
-- 

CREATE TABLE `sort` (
  `user_id` varchar(20) NOT NULL COMMENT '用户的id',
  `wtype` varchar(10) NOT NULL default '1' COMMENT '排序的类型',
  `wleft` varchar(100) default NULL COMMENT '左边栏的widget排序',
  `wmid` varchar(100) default NULL COMMENT '中栏的widget排序',
  `wright` varchar(100) default NULL COMMENT '中栏的widget排序'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- 
-- 导出表中的数据 `sort`
-- 

INSERT INTO `sort` VALUES ('kebingzao', '1', 'widgetflk2$widgetrss4', '', 'widgetrss3');
INSERT INTO `sort` VALUES ('gsting3', '1', 'widgetflk2$widgetflk3', 'widgetrss1', '');

-- --------------------------------------------------------

-- 
-- 表的结构 `user`
-- 

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL auto_increment,
  `username` varchar(100) NOT NULL,
  PRIMARY KEY  (`user_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10 ;

-- 
-- 导出表中的数据 `user`
-- 

INSERT INTO `user` VALUES (9, 'kebingzao');
INSERT INTO `user` VALUES (8, 'gsting3');

-- --------------------------------------------------------

-- 
-- 表的结构 `widgets`
-- 

CREATE TABLE `widgets` (
  `id` int(11) NOT NULL auto_increment COMMENT '主键',
  `user_id` varchar(20) NOT NULL COMMENT '用户的id',
  `widget_id` varchar(20) NOT NULL COMMENT 'widget的id',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=38 ;

-- 
-- 导出表中的数据 `widgets`
-- 

INSERT INTO `widgets` VALUES (37, 'kebingzao', 'rss4');
INSERT INTO `widgets` VALUES (36, 'gsting3', 'flk3');
INSERT INTO `widgets` VALUES (35, 'kebingzao', 'flk2');
INSERT INTO `widgets` VALUES (34, 'kebingzao', 'rss3');
INSERT INTO `widgets` VALUES (31, 'gsting3', 'rss1');
INSERT INTO `widgets` VALUES (32, 'gsting3', 'flk2');

/*
Navicat MySQL Data Transfer

Source Server         : TF_system
Source Server Version : 50169
Source Host           : deployment.pp.ua:3306
Source Database       : tf_db

Target Server Type    : MYSQL
Target Server Version : 50169
File Encoding         : 65001

Date: 2013-09-19 18:01:08
*/

SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Table structure for `brands`
-- ----------------------------
DROP TABLE IF EXISTS `brands`;
CREATE TABLE `brands` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `brand_id` int(11) NOT NULL,
  `brand_name` varchar(255) NOT NULL,
  `brand_url` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `brand_id_key` (`brand_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of brands
-- ----------------------------
INSERT INTO `brands` VALUES ('1', '2', 'OptionFair', 'www.optionfair.com');
INSERT INTO `brands` VALUES ('2', '3', '24option', 'www.24option.com');

-- ----------------------------
-- Table structure for `brand_features`
-- ----------------------------
DROP TABLE IF EXISTS `brand_features`;
CREATE TABLE `brand_features` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `feature_name` varchar(255) NOT NULL,
  `version_id` int(11) NOT NULL,
  `feature_is_default` int(11) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `feature_name_key` (`feature_name`),
  KEY `version_id_key` (`version_id`),
  CONSTRAINT `version_id_key` FOREIGN KEY (`version_id`) REFERENCES `brand_versions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of brand_features
-- ----------------------------
INSERT INTO `brand_features` VALUES ('1', 'Forex (6)', '3', '0');
INSERT INTO `brand_features` VALUES ('2', 'Fixed Strikes (6)', '3', '0');
INSERT INTO `brand_features` VALUES ('9', 'Trading Statistic (5)', '4', '0');
INSERT INTO `brand_features` VALUES ('10', 'Credit Cards (4)', '5', '1');
INSERT INTO `brand_features` VALUES ('11', 'Test (6)', '3', '0');
INSERT INTO `brand_features` VALUES ('12', 'Test (7)', '7', '0');

-- ----------------------------
-- Table structure for `brand_feature_rel`
-- ----------------------------
DROP TABLE IF EXISTS `brand_feature_rel`;
CREATE TABLE `brand_feature_rel` (
  `brand_id` int(11) NOT NULL DEFAULT '0',
  `feature_id` int(11) NOT NULL DEFAULT '0',
  `feature_is_checked` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`brand_id`,`feature_id`),
  KEY `fa_feature_key` (`feature_id`),
  CONSTRAINT `fa_feature_key` FOREIGN KEY (`feature_id`) REFERENCES `brand_features` (`id`),
  CONSTRAINT `fa_brand_key` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of brand_feature_rel
-- ----------------------------

-- ----------------------------
-- Table structure for `brand_langs`
-- ----------------------------
DROP TABLE IF EXISTS `brand_langs`;
CREATE TABLE `brand_langs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lang_name` varchar(255) DEFAULT NULL,
  `lang code` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `lang_name_key` (`lang_name`) USING BTREE,
  UNIQUE KEY `lang_code_key` (`lang code`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of brand_langs
-- ----------------------------
INSERT INTO `brand_langs` VALUES ('4', 'English', 'EN');
INSERT INTO `brand_langs` VALUES ('5', 'Franch', 'FR');
INSERT INTO `brand_langs` VALUES ('6', 'Spanish', 'ES');

-- ----------------------------
-- Table structure for `brand_lang_rel`
-- ----------------------------
DROP TABLE IF EXISTS `brand_lang_rel`;
CREATE TABLE `brand_lang_rel` (
  `brand_id` int(11) NOT NULL,
  `lang_id` int(11) NOT NULL,
  PRIMARY KEY (`brand_id`,`lang_id`),
  KEY `bl_lang_key` (`lang_id`) USING BTREE,
  CONSTRAINT `bl_brand_key` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `bl_lang_key` FOREIGN KEY (`lang_id`) REFERENCES `brand_langs` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=FIXED;

-- ----------------------------
-- Records of brand_lang_rel
-- ----------------------------

-- ----------------------------
-- Table structure for `brand_member_role_rel`
-- ----------------------------
DROP TABLE IF EXISTS `brand_member_role_rel`;
CREATE TABLE `brand_member_role_rel` (
  `brand_id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  PRIMARY KEY (`brand_id`,`member_id`,`role_id`),
  KEY `bmr_member_key` (`member_id`),
  KEY `bmr_role_key` (`role_id`),
  CONSTRAINT `bmr_brand_key` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `bmr_member_key` FOREIGN KEY (`member_id`) REFERENCES `tf_members` (`id`),
  CONSTRAINT `bmr_role_key` FOREIGN KEY (`role_id`) REFERENCES `tf_member_roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of brand_member_role_rel
-- ----------------------------
INSERT INTO `brand_member_role_rel` VALUES ('2', '2', '1');
INSERT INTO `brand_member_role_rel` VALUES ('2', '2', '2');
INSERT INTO `brand_member_role_rel` VALUES ('1', '3', '3');

-- ----------------------------
-- Table structure for `brand_types`
-- ----------------------------
DROP TABLE IF EXISTS `brand_types`;
CREATE TABLE `brand_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `type_name_key` (`type_name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of brand_types
-- ----------------------------
INSERT INTO `brand_types` VALUES ('1', 'basic');
INSERT INTO `brand_types` VALUES ('2', 'standart');

-- ----------------------------
-- Table structure for `brand_type_rel`
-- ----------------------------
DROP TABLE IF EXISTS `brand_type_rel`;
CREATE TABLE `brand_type_rel` (
  `brand_id` int(11) NOT NULL,
  `type_id` int(11) NOT NULL,
  PRIMARY KEY (`brand_id`,`type_id`),
  UNIQUE KEY `bt_brand_key` (`brand_id`) USING BTREE,
  KEY `bt_type_key` (`type_id`) USING BTREE,
  CONSTRAINT `bt_brand_key` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `bt_type_key` FOREIGN KEY (`type_id`) REFERENCES `brand_types` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of brand_type_rel
-- ----------------------------
INSERT INTO `brand_type_rel` VALUES ('1', '1');
INSERT INTO `brand_type_rel` VALUES ('2', '2');

-- ----------------------------
-- Table structure for `brand_versions`
-- ----------------------------
DROP TABLE IF EXISTS `brand_versions`;
CREATE TABLE `brand_versions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `version_name` varchar(255) NOT NULL,
  `version_order_index` int(3) NOT NULL,
  PRIMARY KEY (`id`,`version_order_index`),
  UNIQUE KEY `version_name_key` (`version_name`),
  UNIQUE KEY `version_order_key` (`version_order_index`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of brand_versions
-- ----------------------------
INSERT INTO `brand_versions` VALUES ('5', '4 version', '1');
INSERT INTO `brand_versions` VALUES ('4', '5 version', '2');
INSERT INTO `brand_versions` VALUES ('3', '6 version', '3');
INSERT INTO `brand_versions` VALUES ('7', '7 version', '4');

-- ----------------------------
-- Table structure for `brand_version_rel`
-- ----------------------------
DROP TABLE IF EXISTS `brand_version_rel`;
CREATE TABLE `brand_version_rel` (
  `brand_id` int(11) NOT NULL,
  `version_id` int(11) NOT NULL,
  PRIMARY KEY (`brand_id`,`version_id`),
  UNIQUE KEY `bv_brand_key` (`brand_id`) USING BTREE,
  KEY `bv_version_key` (`version_id`),
  CONSTRAINT `bv_version_key` FOREIGN KEY (`version_id`) REFERENCES `brand_versions` (`id`),
  CONSTRAINT `bv_brand_key` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of brand_version_rel
-- ----------------------------
INSERT INTO `brand_version_rel` VALUES ('1', '3');
INSERT INTO `brand_version_rel` VALUES ('2', '4');

-- ----------------------------
-- Table structure for `tf_members`
-- ----------------------------
DROP TABLE IF EXISTS `tf_members`;
CREATE TABLE `tf_members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `member_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tf_members
-- ----------------------------
INSERT INTO `tf_members` VALUES ('1', 'Adva');
INSERT INTO `tf_members` VALUES ('2', 'Gilad');
INSERT INTO `tf_members` VALUES ('3', 'Yakov');

-- ----------------------------
-- Table structure for `tf_member_roles`
-- ----------------------------
DROP TABLE IF EXISTS `tf_member_roles`;
CREATE TABLE `tf_member_roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_name_key` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tf_member_roles
-- ----------------------------
INSERT INTO `tf_member_roles` VALUES ('1', 'Account manager');
INSERT INTO `tf_member_roles` VALUES ('3', 'Content manager');
INSERT INTO `tf_member_roles` VALUES ('2', 'Developer');

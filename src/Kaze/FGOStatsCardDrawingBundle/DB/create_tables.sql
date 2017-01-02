CREATE SCHEMA `fgo_stats` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `card_drawing_group`;
CREATE TABLE `card_drawing_group` (
  `id` bigint(16) NOT NULL AUTO_INCREMENT,
  `server_id` smallint(5) NOT NULL COMMENT '1: B站（安卓）, 2: B站（iOS）, 3: 九游, 4: 百度, 5: 豌豆荚',
  `drawing_time` datetime NOT NULL,
  `pool_id` int(9) NOT NULL,
  `master_level` int(9),
  `is_deleted` char(1) NOT NULL DEFAULT 'N',
  `created_by` bigint(16) NOT NULL,
  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` bigint(16) NOT NULL,
  `updated_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `server_id` (`server_id`),
  KEY `drawing_time` (`drawing_time`),
  KEY `pool_id` (`pool_id`)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `card_drawing_unit`;
CREATE TABLE `card_drawing_unit` (
  `id` bigint(16) NOT NULL AUTO_INCREMENT,
  `group_id` bigint(16) NOT NULL,
  `type` smallint(5) NOT NULL COMMENT '1: 单抽, 2: 十连',
  `cost_charms` int(9) NOT NULL,
  `cost_free_stones` int(9) NOT NULL,
  `cost_paid_stones` int(9) NOT NULL,
  `is_deleted` char(1) NOT NULL DEFAULT 'N',
  `created_by` bigint(16) NOT NULL,
  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` bigint(16) NOT NULL,
  `updated_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `group_id` (`group_id`)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `card_drawing_award`;
CREATE TABLE `card_drawing_award` (
  `id` bigint(16) NOT NULL AUTO_INCREMENT,
  `unit_id` bigint(16) NOT NULL,
  `card_id` int(9),
  `is_deleted` char(1) NOT NULL DEFAULT 'N',
  `created_by` bigint(16) NOT NULL,
  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` bigint(16) NOT NULL,
  `updated_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `unit_id` (`unit_id`)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `card_pool`;
CREATE TABLE `card_pool` (
  `id` int(9) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `begin_time` datetime,
  `end_time` datetime,
  `is_deleted` char(1) NOT NULL DEFAULT 'N',
  `created_by` bigint(16) NOT NULL,
  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` bigint(16) NOT NULL,
  `updated_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `available_time` (`begin_time`, `end_time`)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `card`;
CREATE TABLE `card` (
  `id` int(9) NOT NULL AUTO_INCREMENT,
  `type` smallint(5) NOT NULL COMMENT '1: 从者, 2: 礼装, 3: 种火, 4: 芙芙',
  `order` int(9) NOT NULL,
  `name` varchar(45) NOT NULL,
  `star` smallint(5) NOT NULL,
  `class` smallint(5) COMMENT '1: shielder, 2: saber, ...',
  `url` varchar(255) NOT NULL,
  `is_deleted` char(1) NOT NULL DEFAULT 'N',
  `created_by` bigint(16) NOT NULL,
  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` bigint(16) NOT NULL,
  `updated_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`type`, `order`),
  KEY `type_and_star` (`type`, `star`)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

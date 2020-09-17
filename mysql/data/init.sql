CREATE DATABASE IF NOT EXISTS `default_database`;

USE `default_database`;

CREATE TABLE IF NOT EXISTS `customers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `customers` VALUES
(NULL, 'paniom', 'paniom@example.com', '255300238');
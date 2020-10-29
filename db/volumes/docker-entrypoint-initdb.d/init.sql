/*
** This file is for declaring the tables' structure of the database, will be modified if needed.
** Reference: https://www.mysqltutorial.org/mysql-sample-database.aspx/
*/

DROP DATABASE IF EXISTS `mydb`;
CREATE DATABASE IF NOT EXISTS `mydb`;
USE `mydb`;

DROP TABLE IF EXISTS `driverLogs`;
DROP TABLE IF EXISTS `orderLogs`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `addresses`;
DROP TABLE IF EXISTS `users`;
-- DROP TABLE IF EXISTS `employees`;
-- DROP TABLE IF EXISTS `customerAddresses`;
-- DROP TABLE IF EXISTS `customers`;

DROP TRIGGER IF EXISTS `orderLogsUpdateTrigger`;
DROP TRIGGER IF EXISTS `orderLogsInsertTrigger`;
DROP PROCEDURE IF EXISTS `orderLogsProcedure`;

-- CREATE TABLE IF NOT EXISTS `customers` (
--   `customerId`  INT(11) NOT NULL AUTO_INCREMENT,
--   `firstName`   VARCHAR(255) NOT NULL,
--   `lastName`    VARCHAR(255) NOT NULL,
--   `email`       VARCHAR(255) NOT NULL,
--   `username`    VARCHAR(32) NOT NULL,
--   `password`    VARCHAR(255) NOT NULL,
--   `phone`       VARCHAR(24) NULL,
--   `createdAt`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   `updatedAt`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   PRIMARY KEY (`customerId`),
--   CONSTRAINT `UC_Email` UNIQUE (`email`)
-- );

CREATE TABLE IF NOT EXISTS `users` (
  `userId`    INT(11) NOT NULL AUTO_INCREMENT,
  `firstName` VARCHAR(255) NOT NULL,
  `lastName`  VARCHAR(255) NOT NULL,
  `email`     VARCHAR(255) NULL,
  `phone`     VARCHAR(24) NULL,
  `username`  VARCHAR(255) NOT NULL,
  `password`  VARCHAR(255) NOT NULL,
  `role`      ENUM('customer', 'admin', 'driver') NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` TIMESTAMP NULL,
  PRIMARY KEY (`userId`),
  CONSTRAINT `UC_Email` UNIQUE (`email`),
  CONSTRAINT `UC_Username` UNIQUE (`username`)
);

CREATE TABLE IF NOT EXISTS `addresses` (
  `addressId`     INT(11) NOT NULL AUTO_INCREMENT,
  `customerId`    INT(11) NOT NULL,
  `addressLine1`  TEXT NULL,
  `addressLine2`  TEXT NULL,
  `latitude`      FLOAT(10, 7) NULL,
  `longitude`     FLOAT(10, 7) NULL,
  `createdAt`     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt`     TIMESTAMP NULL,
  PRIMARY KEY (`addressId`),
  CONSTRAINT `FK_Customer` FOREIGN KEY (`customerId`) REFERENCES `users`(`userId`)
);

CREATE TABLE IF NOT EXISTS `orders` (
  `orderId`           VARCHAR(255) NOT NULL,
  `senderId`          INT(11) NOT NULL,
  `sendAddressId`     INT(11) NOT NULL,
  `receiverId`        INT(11) NOT NULL,
  `receiveAddressId`  INT(11) NOT NULL,
  `driverId`          INT(11) NULL,
  `status`            TEXT NULL,
  `signUrl`           TEXT NULL,
  `comments`          TEXT NULL,
  `createdAt`         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt`         TIMESTAMP NULL,
  PRIMARY KEY (`orderId`),
  CONSTRAINT `FK_Sender` FOREIGN KEY (`senderId`) REFERENCES `users`(`userId`),
  CONSTRAINT `FK_SendAddress` FOREIGN KEY (`sendAddressId`) REFERENCES `addresses`(`addressId`),
  CONSTRAINT `FK_Receiver` FOREIGN KEY (`receiverId`) REFERENCES `users`(`userId`),
  CONSTRAINT `FK_ReceiveAddress` FOREIGN KEY (`receiveAddressId`) REFERENCES `addresses`(`addressId`),
  CONSTRAINT `FK_OrderDriver` FOREIGN KEY (`driverId`) REFERENCES `users`(`userId`)
);

CREATE TABLE IF NOT EXISTS `orderLogs` (
  `orderLogId`  INT(11) NOT NULL AUTO_INCREMENT,
  `orderId`     VARCHAR(255) NOT NULL,
  `status`      TEXT NULL,
  `comments`    TEXT NULL,
  `createdAt`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt`   TIMESTAMP NULL,
  PRIMARY KEY (`orderLogId`),
  CONSTRAINT `FK_Order` FOREIGN KEY (`orderId`) REFERENCES `orders`(`orderId`)
);

-- TODO: need to determine the level of importance of table `driverLogs`
-- CREATE TABLE IF NOT EXISTS `driverLogs` (
--   `driverLogId`       INT(11) NOT NULL AUTO_INCREMENT,
--   `driverId`          INT(11) NOT NULL,
--   `startTime`         TIMESTAMP NOT NULL,
--   `endTime`           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   `suggestedPolygons` LONGTEXT NULL,
--   `actualPolygons`    LONGTEXT NULL,
--   `createdAt`         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   `updatedAt`         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   PRIMARY KEY (`driverLogId`),
--   CONSTRAINT `FK_DriverLogDriver` FOREIGN KEY (`driverId`) REFERENCES `employees`(`employeeId`)
-- );

DELIMITER //

CREATE PROCEDURE `orderLogsProcedure`
(IN orderId VARCHAR(255), IN status TEXT, IN comments TEXT)
BEGIN
  INSERT INTO `orderLogs`(`orderId`, `status`, `comments`) VALUES
  (orderId, status, comments);
END//

CREATE TRIGGER `orderLogsInsertTrigger`
  AFTER INSERT ON `orders`
  FOR EACH ROW
BEGIN
  CALL orderLogsProcedure(NEW.orderId, NEW.status, NEW.comments);
END//

CREATE TRIGGER `orderLogsUpdateTrigger`
  AFTER UPDATE ON `orders`
  FOR EACH ROW
BEGIN
  CALL orderLogsProcedure(NEW.orderId, NEW.status, NEW.comments);
END//

DELIMITER ;

INSERT INTO `users`(`firstName`, `lastName`, `email`, `role`, `username`, `password`) VALUES
('nimda', 'nim', 'admin@example.com', 'admin', 'admin1', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3');

-- For Testing Order Logs Trigger
-- INSERT INTO `users`(`firstName`, `lastName`, `email`, `username`, `password`, `role`) VALUES
-- ('tin lok', 'law', 'tinloklaw@example.com', 'paniom', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'customer');

-- INSERT INTO `addresses`(`customerId`) VALUES
-- (2);

-- INSERT INTO `orders` VALUES
-- ('abc123', 2, 1, 2, 1, NULL, 'created', NULL, 'just created an order', NULL, NULL);

-- UPDATE `orders` 
-- SET `status`='delivering', `comments`='order is delivering' 
-- WHERE `orderId`='abc123';

/*
** This file is for declaring the tables' structure of the database, will be modified if needed.
** This file will be used by @/db/volumes/docker-entrypoint-initdb.d/init.sql to generate data
** Reference: https://www.mysqltutorial.org/mysql-sample-database.aspx/
*/

DROP TABLE IF EXISTS `mydb`;
CREATE DATABASE IF NOT EXISTS `mydb`;
USE `mydb`;

DROP TABLE IF EXISTS `driverLogs`;
DROP TABLE IF EXISTS `orderLogs`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `employees`;
DROP TABLE IF EXISTS `customerAddresses`;
DROP TABLE IF EXISTS `customers`;

CREATE TABLE IF NOT EXISTS `customers` (
  `customerId`  INT(11) NOT NULL AUTO_INCREMENT,
  `firstName`   VARCHAR(255) NOT NULL,
  `lastName`    VARCHAR(255) NOT NULL,
  `email`       VARCHAR(255) NOT NULL,
  `username`    VARCHAR(32) NOT NULL,
  `password`    VARCHAR(255) NOT NULL,
  `phone`       VARCHAR(24) NULL,
  `createdAt`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`customerId`),
  CONSTRAINT `UC_Email` UNIQUE (`email`)
);

CREATE TABLE IF NOT EXISTS `customerAddresses` (
  `customerAddressId` INT(11) NOT NULL AUTO_INCREMENT,
  `customerId`        INT(11) NOT NULL,
  `addressLine1`      TEXT NULL,
  `addresssLine2`     TEXT NULL,
  `latitude`          FLOAT(10, 7) NULL,
  `longitude`         FLOAT(10, 7) NULL,
  `createdAt`         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`customerAddressId`),
  CONSTRAINT `FK_Customer` FOREIGN KEY (`customerId`) REFERENCES `customers`(`customerId`)
);

CREATE TABLE IF NOT EXISTS `employees` (
  `employeeId`  INT(11) NOT NULL AUTO_INCREMENT,
  `firstName`   VARCHAR(255) NOT NULL,
  `lastName`    VARCHAR(255) NOT NULL,
  `email`       VARCHAR(255) NULL,
  `phone`       VARCHAR(24) NULL,
  `jobTitle`    ENUM('admin', 'driver') NULL DEFAULT 'driver',
  `username`    VARCHAR(255) NULL,
  `password`    VARCHAR(255) NULL DEFAULT '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
  `createdAt`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`employeeId`),
  CONSTRAINT `UC_Email` UNIQUE (`email`)
);

CREATE TABLE IF NOT EXISTS `orders` (
  `orderId`                   VARCHAR(255) NOT NULL,
  `sendCustomerId`            INT(11) NOT NULL,
  `sendCustomerAddressId`     INT(11) NOT NULL,
  `receiveCustomerId`         INT(11) NOT NULL,
  `receiveCustomerAddressId`  INT(11) NOT NULL,
  `status`                    TEXT NULL,
  `signUrl`                   TEXT NULL,
  `comments`                  TEXT NULL,
  `createdAt`                 TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`                 TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`orderId`),
  CONSTRAINT `FK_SendCustomer` FOREIGN KEY (`sendCustomerId`) REFERENCES `customers`(`customerId`),
  CONSTRAINT `FK_SendCustomerAddress` FOREIGN KEY (`sendCustomerAddressId`) REFERENCES `customerAddresses`(`customerAddressId`),
  CONSTRAINT `FK_ReceiveCustomer` FOREIGN KEY (`receiveCustomerId`) REFERENCES `customers`(`customerId`),
  CONSTRAINT `FK_ReceiveCustomerAddress` FOREIGN KEY (`receiveCustomerAddressId`) REFERENCES `customerAddresses`(`customerAddressId`)
);

-- TODO: Actually should add table `orderLogs` to log the order important status breakpoints, 
-- with removing necessary columns in table `orders`
CREATE TABLE IF NOT EXISTS `orderLogs` (
  `orderLogId`  INT(11) NOT NULL AUTO_INCREMENT,
  `orderId`     VARCHAR(255) NOT NULL,
  `status`      TEXT NULL,
  `comments`    TEXT NULL,
  `createdAt`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`orderLogId`),
  CONSTRAINT `FK_Order` FOREIGN KEY (`orderId`) REFERENCES `orders`(`orderId`)
);

CREATE TABLE IF NOT EXISTS `driverLogs` (
  `driverLogId`       INT(11) NOT NULL AUTO_INCREMENT,
  `driverId`          INT(11) NOT NULL,
  `startTime`         TIMESTAMP NOT NULL,
  `endTime`           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `suggestedPolygons` LONGTEXT NULL,
  `actualPolygons`    LONGTEXT NULL,
  `createdAt`         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`driverLogId`),
  CONSTRAINT `FK_Driver` FOREIGN KEY (`driverId`) REFERENCES `employees`(`employeeId`)
);

INSERT INTO `employees`(`firstName`, `lastName`, `email`, `jobTitle`, `username`) VALUES
('nimda', 'nim', 'admin@example.com', 'admin', 'admin1');

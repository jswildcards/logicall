/*
** This file is for declaring the tables' structure of the database, will be modified if needed.
** This file will be used by @/db/volumes/docker-entrypoint-initdb.d/init.sql to generate data
** Reference: https://www.mysqltutorial.org/mysql-sample-database.aspx/
*/

CREATE TABLE IF NOT EXISTS `customers` (
  `customerId` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(32) NOT NULL,
  `password` varchar(255) NOT NULL DEFAULT 'password',
  `phone` varchar(24) NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`customerId`),
  CONSTRAINT `UC_Email` UNIQUE (`email`)
);

CREATE TABLE IF NOT EXISTS `customerAddresses` (
  `customerAddressId` int(11) NOT NULL AUTO_INCREMENT,
  `customerId` int(11) NOT NULL,
  `addressLine1` text NULL,
  `addresssLine2` text NULL,
  `latitude` float(10, 7) NULL,
  `longitude` float(10, 7) NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`employeeId`),
  CONSTRAINT `FK_Customer` FOREIGN KEY (`customerId`) REFERENCES `customers`(`customerId`)
);

CREATE TABLE IF NOT EXISTS `employees` (
  `employeeId` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NULL,
  `username` varchar(255) NULL,
  `password` varchar(255) DEFAULT 'password',
  `phone` varchar(24) NULL,
  `jobTitle` enum('admin', 'driver') NULL DEFAULT 'driver',
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`employeeId`)
);

CREATE TABLE IF NOT EXISTS `orders` (
  `orderId` varchar(255) NOT NULL,
  `status` text NOT NULL DEFAULT 'created',
  `sendCustomerId` int(11) NOT NULL,
  `sendCustomerAddressId` int(11) NOT NULL,
  `receiveCustomerId` int(11) NOT NULL,
  `receiveCustomerAddressId` int(11) NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `signUrl` text NULL,
  `comments` text NULL,
  PRIMARY KEY (`orderId`),
  CONSTRAINT `FK_SendCustomer` FOREIGN KEY (`sendCustomerId`) REFERENCES `customers`(`customerId`),
  CONSTRAINT `FK_SendCustomerAddress` FOREIGN KEY (`sendCustomerAddressId`) REFERENCES `customerAddresses`(`customerAddressId`),
  CONSTRAINT `FK_ReceiveCustomer` FOREIGN KEY (`receiveCustomerId`) REFERENCES `customers`(`customerId`),
  CONSTRAINT `FK_ReceiveCustomerAddress` FOREIGN KEY (`receiveCustomerAddressId`) REFERENCES `customerAddresses`(`customerAddressId`)
);

-- TODO: Actually should add table `orderTraces` to log the order trend, 
-- with removing necessary columns in table `orders`

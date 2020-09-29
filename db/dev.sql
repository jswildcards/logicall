/*
** This file is for declaring the tables' structure of the database, will be modified if needed.
** This file will be used by @/db/volumes/docker-entrypoint-initdb.d/init.sql to generate data
** Reference: https://www.mysqltutorial.org/mysql-sample-database.aspx/
*/

CREATE TABLE IF NOT EXISTS `products` (
  `productId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT '',
  `price` float(23, 2) DEFAULT 0.00,
  `imageUrl` varchar(255) DEFAULT '',
  PRIMARY KEY (`productId`)
);

CREATE TABLE IF NOT EXISTS `customers` (
  `customerId` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(32) NOT NULL,
  `password` varchar(32) DEFAULT 'password',
  `phone` varchar(24) NULL,
  PRIMARY KEY (`customerId`),
  UNIQUE KEY `email` (`email`)
);

CREATE TABLE IF NOT EXISTS `orders` (
  `orderId` varchar(255) NOT NULL,
  `customerId` int(11) NOT NULL,
  `orderDate` date NOT NULL,
  `shippedDate` date DEFAULT NULL,
  `status` varchar(15) NOT NULL,
  `comments` text DEFAULT NULL,
  PRIMARY KEY (`orderId`),
  CONTRAINT `FK_Customer` FOREIGN KEY (`customerId`) REFERENCES `customers`(`customerId`)
);

CREATE TABLE IF NOT EXISTS `orderdetails` (
  `orderId` varchar(255) NOT NULL,
  `productId` int(11) NOT NULL,
  `quantity` float(23, 2) NOT NULL,
  `priceEach` float(23, 2) NOT NULL,
  PRIMARY KEY (`orderId`, `productId`),
  CONTRAINT `FK_Order` FOREIGN KEY (`orderId`) REFERENCES `orders`(`orderId`),
  CONTRAINT `FK_Product` FOREIGN KEY (`productId`) REFERENCES `products`(`productId`)
);

-- TODO: Implement tables `offices` and `lockers`

-- CREATE TABLE IF NOT EXISTS `offices` (
--   `officeId` int(11) NOT NULL AUTO_INCREMENT,
--   `addressLine1`,
--   `addresssLine2`,
--   `latitude`,
--   `longitude`,
--   `phone`,
--   PRIMARY KEY (`officeId`)
-- );

-- CREATE TABLE IF NOT EXISTS `lockers` (
--   `lockerId`,
--   `addressLine1`,
--   `addressLine2`,
--   `latitude`,
--   `longitude`,
--   `status`,
-- );

CREATE TABLE IF NOT EXISTS `employees` (
  `employeeId` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NULL,
  `username` varchar(255) NULL,
  `jobTitle` varchar(50) NULL,
  `officeId` int(11) NULL,
  PRIMARY KEY (`employeeId`),
  CONTRAINT `FK_Office` FOREIGN KEY (`officeId`) REFERENCES `offices`(`officeId`)
);

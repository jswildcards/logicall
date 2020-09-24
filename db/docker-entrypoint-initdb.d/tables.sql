/*
** This file is for declaring the tables of the database, will be modified on needed.
** Reference: https://www.mysqltutorial.org/mysql-sample-database.aspx/
*/

CREATE TABLE `products` (
  `productId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT '',
  `price` float(23, 2) DEFAULT 0.00,
  `imageUrl` varchar(255) DEFAULT '',
  PRIMARY KEY (`productId`)
);

CREATE TABLE `customers` (
  `customerId` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(32) NOT NULL,
  `password` varchar(32) DEFAULT 'password',
  PRIMARY KEY (`customerId`),
  UNIQUE KEY `email` (`email`)
);

CREATE TABLE `orders` (
  `orderId` varchar(255) NOT NULL,
  `customerId` int(11) NOT NULL,
  PRIMARY KEY (`orderId`),
  CONTRAINT `FK_Customer` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`)
);

CREATE TABLE `orderdetails` (
  `orderId` varchar(255) NOT NULL,
  `productId` int(11) NOT NULL,
  `quantity` float(23, 2) NOT NULL,
  PRIMARY KEY (`orderId`, `productId`),
  CONTRAINT `FK_Order` FOREIGN KEY (`orderId`) REFERENCES `orders`(`orderId`),
  CONTRAINT `FK_Product` FOREIGN KEY (`productId`) REFERENCES `products`(`productId`)
);
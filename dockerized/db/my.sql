/*
** This file is for declaring the tables' structure of the database, will be modified if needed.
** Reference: https://www.mysqltutorial.org/mysql-sample-database.aspx/
*/

DROP DATABASE IF EXISTS `mydb`;
CREATE DATABASE IF NOT EXISTS `mydb`;
USE `mydb`;

-- DROP TABLE IF EXISTS `driverLogs`;
DROP TABLE IF EXISTS `OrderLog`;
DROP TABLE IF EXISTS `Order`;
DROP TABLE IF EXISTS `Address`;
DROP TABLE IF EXISTS `Follow`;
DROP TABLE IF EXISTS `User`;
-- DROP TABLE IF EXISTS `employees`;
-- DROP TABLE IF EXISTS `customerAddresses`;
-- DROP TABLE IF EXISTS `customers`;

DROP TRIGGER IF EXISTS `OrderLogUpdateTrigger`;
DROP TRIGGER IF EXISTS `OrderLogInsertTrigger`;
DROP PROCEDURE IF EXISTS `OrderLogProcedure`;

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

CREATE TABLE IF NOT EXISTS `User` (
  `userId`    INT(11) NOT NULL AUTO_INCREMENT,
  `firstName` VARCHAR(255) NULL,
  `lastName`  VARCHAR(255) NULL,
  `email`     VARCHAR(255) NOT NULL,
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

CREATE TABLE IF NOT EXISTS `Follow` (
  `followId`    INT(11) NOT NULL AUTO_INCREMENT,
  `followerId`  INT(11) NOT NULL,
  `followeeId` INT(11) NOT NULL,
  `createdAt`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt`   TIMESTAMP NULL,
  PRIMARY KEY(`followId`),
  CONSTRAINT `UC_Friend_Follower_Followee` UNIQUE (`followerId`, `followeeId`),
  CONSTRAINT `FK_Friend_Follower` FOREIGN KEY (`followerId`) REFERENCES `User`(`userId`),
  CONSTRAINT `FK_Friend_Followee` FOREIGN KEY (`followeeId`) REFERENCES `User`(`userId`)
);

CREATE TABLE IF NOT EXISTS `Address` (
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
  CONSTRAINT `FK_Address_Customer` FOREIGN KEY (`customerId`) REFERENCES `User`(`userId`)
);

CREATE TABLE IF NOT EXISTS `Order` (
  `orderId`           VARCHAR(255) NOT NULL,
  `senderId`          INT(11) NOT NULL,
  `sendAddressId`     INT(11) NOT NULL,
  `receiverId`        INT(11) NOT NULL,
  `receiveAddressId`  INT(11) NOT NULL,
  `driverId`          INT(11) NULL,
  `status`            TEXT NULL,
  `qrcode`           TEXT NULL,
  `comments`          TEXT NULL,
  `createdAt`         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt`         TIMESTAMP NULL,
  PRIMARY KEY (`orderId`),
  CONSTRAINT `FK_Order_Sender` FOREIGN KEY (`senderId`) REFERENCES `User`(`userId`),
  CONSTRAINT `FK_Order_SendAddress` FOREIGN KEY (`sendAddressId`) REFERENCES `Address`(`addressId`),
  CONSTRAINT `FK_Order_Receiver` FOREIGN KEY (`receiverId`) REFERENCES `User`(`userId`),
  CONSTRAINT `FK_Order_ReceiveAddress` FOREIGN KEY (`receiveAddressId`) REFERENCES `Address`(`addressId`),
  CONSTRAINT `FK_Order_OrderDriver` FOREIGN KEY (`driverId`) REFERENCES `User`(`userId`)
);

CREATE TABLE IF NOT EXISTS `OrderLog` (
  `orderLogId`  INT(11) NOT NULL AUTO_INCREMENT,
  `orderId`     VARCHAR(255) NOT NULL,
  `status`      TEXT NULL,
  `comments`    TEXT NULL,
  `createdAt`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt`   TIMESTAMP NULL,
  PRIMARY KEY (`orderLogId`),
  CONSTRAINT `FK_OrderLog_Order` FOREIGN KEY (`orderId`) REFERENCES `Order`(`orderId`)
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

CREATE PROCEDURE `OrderLogProcedure`
(IN orderId VARCHAR(255), IN status TEXT, IN comments TEXT)
BEGIN
  INSERT INTO `OrderLog`(`orderId`, `status`, `comments`) VALUES
  (orderId, status, comments);
END//

CREATE TRIGGER `OrderLogInsertTrigger`
  AFTER INSERT ON `Order`
  FOR EACH ROW
BEGIN
  CALL OrderLogProcedure(NEW.orderId, NEW.status, NEW.comments);
END//

CREATE TRIGGER `OrderLogUpdateTrigger`
  AFTER UPDATE ON `Order`
  FOR EACH ROW
BEGIN
  CALL OrderLogProcedure(NEW.orderId, NEW.status, NEW.comments);
END//

DELIMITER ;

INSERT INTO `User`(`firstName`, `lastName`, `email`, `role`, `username`, `password`, `phone`) VALUES
('nimda', 'nim', 'admin@example.com', 'admin', 'admin1', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '00000000'),
("Willard", "Bradley", "willard.bradley@example.com", "customer", "sadduck219", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "75206715"),
("Julia", "Freeman", "julia.freeman@example.com", "customer", "yellowostrich547", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "09114140"),
("Elena", "Guerrero", "elena.guerrero@example.com", "customer", "bluefish254", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "83127220"),
("Delphine", "Denys", "delphine.denys@example.com", "customer", "bigzebra383", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "22467529"),
("Eleanor", "Smith", "eleanor.smith@example.com", "customer", "whitegoose631", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "78441453"),
("Austin", "Lopez", "austin.lopez@example.com", "customer", "greenbird908", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "14290391"),
("Andrea", "Jørgensen", "andrea.jorgensen@example.com", "customer", "silvergoose106", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "32340298"),
("Akseli", "Justi", "akseli.justi@example.com", "customer", "goldenbird731", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "08041938"),
("Monica", "Thomas", "monica.thomas@example.com", "customer", "greensnake940", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "57988820"),
("Silvia", "Bravo", "silvia.bravo@example.com", "customer", "silverrabbit231", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "19868143"),
("Eden", "White", "eden.white@example.com", "customer", "angrygoose140", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "17889351"),
("Jordi", "Carmona", "jordi.carmona@example.com", "customer", "redmeercat604", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "75931473"),
("Kimi", "Buijs", "kimi.buijs@example.com", "customer", "blueleopard415", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "00812787"),
("Barry", "Marshall", "barry.marshall@example.com", "customer", "beautifulpeacock849", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "61238516"),
("Umut", "Akşit", "umut.aksit@example.com", "customer", "heavyladybug473", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "29601296"),
("Sofia", "Ellis", "sofia.ellis@example.com", "customer", "heavyladybug306", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "49156984"),
("Sarah", "Harcourt", "sarah.harcourt@example.com", "customer", "yellowleopard202", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "48263277"),
("Patric", "Colin", "patric.colin@example.com", "customer", "sadlion859", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "20827408"),
("Rochella", "Akdeniz", "rochella.akdeniz@example.com", "customer", "silverladybug956", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "63909170"),
("طاها", "سلطانی نژاد", "th.sltnynjd@example.com", "customer", "beautifulrabbit580", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "05574588"),
("Juliette", "Novak", "juliette.novak@example.com", "customer", "ticklishgoose466", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "50013580"),
("Giuseppina", "Lefebvre", "giuseppina.lefebvre@example.com", "customer", "lazymouse950", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "06267878"),
("Albin", "Duivenvoorde", "albin.duivenvoorde@example.com", "customer", "greenbird478", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "70974713"),
("Marcos", "Rojas", "marcos.rojas@example.com", "customer", "ticklishfrog615", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "42431730"),
("Serge", "Rousseau", "serge.rousseau@example.com", "customer", "brownkoala533", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "17839906"),
("Rose", "Stone", "rose.stone@example.com", "customer", "purpletiger864", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "26671007"),
("Alfred", "Poulsen", "alfred.poulsen@example.com", "customer", "bigzebra328", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "28414229"),
("Cilli", "Sack", "cilli.sack@example.com", "customer", "goldensnake456", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "72786006"),
("Jara", "Colin", "jara.colin@example.com", "customer", "orangesnake831", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "75349354"),
("Joe", "Meyer", "joe.meyer@example.com", "customer", "redelephant502", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "75977317"),
("Gaël", "Nguyen", "gael.nguyen@example.com", "customer", "redwolf687", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "47720845"),
("Brayden", "Long", "brayden.long@example.com", "customer", "purplegoose597", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "38795150"),
("Eileen", "Lane", "eileen.lane@example.com", "customer", "biggoose520", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "42801709"),
("اميرعلي", "علیزاده", "myraaly.aalyzdh@example.com", "customer", "redzebra830", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "94858999"),
("Rosa", "Gerard", "rosa.gerard@example.com", "customer", "beautifulmeercat968", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "93126659"),
("Gloria", "Garcia", "gloria.garcia@example.com", "customer", "brownostrich344", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "61259106"),
("محیا", "موسوی", "mhy.mwswy@example.com", "customer", "bigfrog476", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "34333356"),
("Juliette", "Chan", "juliette.chan@example.com", "customer", "blackswan503", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "37780233"),
("Tidemann", "Schanke", "tidemann.schanke@example.com", "customer", "yellowmouse934", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "86399102"),
("Juho", "Heikkinen", "juho.heikkinen@example.com", "customer", "yellowtiger498", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "28846334"),
("Chris", "Campbell", "chris.campbell@example.com", "customer", "brownleopard463", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "39230978"),
("Ülkü", "Ayverdi", "ulku.ayverdi@example.com", "customer", "greenlion235", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "49703526"),
("Mestan", "Koç", "mestan.koc@example.com", "customer", "bigwolf277", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "09236482"),
("Martina", "Lamm", "martina.lamm@example.com", "customer", "orangesnake813", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "55077864"),
("Tristan", "Johansen", "tristan.johansen@example.com", "customer", "silverfrog793", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "31415357"),
("Luukas", "Wainio", "luukas.wainio@example.com", "customer", "goldenfrog208", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "88000790"),
("Valdemar", "Petersen", "valdemar.petersen@example.com", "customer", "goldenrabbit196", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "58159137"),
("Joona", "Ollila", "joona.ollila@example.com", "customer", "orangesnake537", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "40795369"),
("James", "Sims", "james.sims@example.com", "customer", "lazybutterfly217", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "86341636"),
("Lucas", "Christiansen", "lucas.christiansen@example.com", "customer", "sadmeercat283", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "05852668"),
("Lucien", "Leclerc", "lucien.leclerc@example.com", "customer", "blackmeercat114", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "71831247"),
("Benjamin", "Kühne", "benjamin.kuhne@example.com", "customer", "brownpanda614", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "11033936"),
("Ray", "Frazier", "ray.frazier@example.com", "customer", "silverostrich507", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "68628628"),
("محمدعلی", "كامياران", "mhmdaaly.kmyrn@example.com", "customer", "sadpanda672", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "31587973"),
("Leana", "Caron", "leana.caron@example.com", "customer", "whitekoala111", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "00390295"),
("Paul", "Fox", "paul.fox@example.com", "customer", "bluecat575", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "43883619"),
("Ayla", "White", "ayla.white@example.com", "customer", "angryfrog220", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "09653696"),
("Donna", "King", "donna.king@example.com", "customer", "blackfish282", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "49031824"),
("Ayşe", "Eliçin", "ayse.elicin@example.com", "customer", "organicduck998", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "65069598"),
("Kayla", "Sandvik", "kayla.sandvik@example.com", "customer", "happykoala308", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "70488636"),
("Juliane", "Stenseth", "juliane.stenseth@example.com", "customer", "beautifulpanda793", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "47994156"),
("Esma", "Çapanoğlu", "esma.capanoglu@example.com", "customer", "goldenduck992", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "36524230"),
("Macit", "Çevik", "macit.cevik@example.com", "customer", "bluewolf371", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "45425412"),
("Pedro", "Ortega", "pedro.ortega@example.com", "customer", "yellowswan720", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "58582140"),
("Jamie", "Harvey", "jamie.harvey@example.com", "customer", "angrymouse215", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "29427281"),
("Andrea", "Sanz", "andrea.sanz@example.com", "customer", "bluefish573", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "85407711"),
("محیا", "سهيلي راد", "mhy.shylyrd@example.com", "customer", "blueladybug909", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "73167230"),
("Elli", "Lepisto", "elli.lepisto@example.com", "customer", "redzebra144", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "82272941"),
("Tristan", "Olivier", "tristan.olivier@example.com", "customer", "bigleopard434", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "17472516"),
("Megan", "Hart", "megan.hart@example.com", "customer", "crazybutterfly331", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "82897565"),
("Vanessa", "Roberts", "vanessa.roberts@example.com", "customer", "sadsnake795", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "50249922"),
("Mina", "Opstad", "mina.opstad@example.com", "customer", "goldenbird864", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "84560747"),
("Tristan", "Martin", "tristan.martin@example.com", "customer", "crazyrabbit561", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "34519117"),
("Georgia", "Wang", "georgia.wang@example.com", "customer", "bigsnake862", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "69065416"),
("Bernard", "Carpenter", "bernard.carpenter@example.com", "customer", "angrybird110", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "86304360"),
("Nathanael", "De Weerd", "nathanael.deweerd@example.com", "customer", "sadfish374", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "33863743"),
("Chris", "Laurent", "chris.laurent@example.com", "customer", "silverostrich843", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "96967828"),
("Orlanda", "Rezende", "orlanda.rezende@example.com", "customer", "blackostrich904", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "29242423"),
("Cameron", "Chen", "cameron.chen@example.com", "customer", "tinydog377", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "32529155"),
("Bertha", "Bryant", "bertha.bryant@example.com", "customer", "crazydog884", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "46276890"),
("Francisco", "Elliott", "francisco.elliott@example.com", "customer", "goldenzebra325", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "76308001"),
("Ide", "Van den Boorn", "ide.vandenboorn@example.com", "customer", "blackfrog994", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "36649448"),
("Greg", "Holt", "greg.holt@example.com", "customer", "greenmouse149", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "75854296"),
("Natã", "Almeida", "nata.almeida@example.com", "customer", "greenrabbit532", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "84321879"),
("Natan", "Tvete", "natan.tvete@example.com", "customer", "blackladybug135", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "72410198"),
("Hannelore", "Francois", "hannelore.francois@example.com", "customer", "smallmouse772", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "85050435"),
("Emre", "Tanrıkulu", "emre.tanrikulu@example.com", "customer", "bigzebra167", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "69554479"),
("Jim", "Reynolds", "jim.reynolds@example.com", "customer", "angryfrog754", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "73934991"),
("Friedrich-Wilhelm", "Mengel", "friedrich-wilhelm.mengel@example.com", "customer", "crazycat354", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "91010694"),
("Heinz Dieter", "Kunzmann", "heinzdieter.kunzmann@example.com", "customer", "bluepanda752", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "64624470"),
("Jake", "Mitchell", "jake.mitchell@example.com", "customer", "bigduck593", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "62144291"),
("Sean", "Hunter", "sean.hunter@example.com", "customer", "whiteswan960", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "68701205"),
("Jeppe", "Christensen", "jeppe.christensen@example.com", "customer", "beautifulgoose531", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "05654236"),
("Beverly", "Craig", "beverly.craig@example.com", "customer", "bluemeercat720", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "68978546"),
("Sarah", "Rhodes", "sarah.rhodes@example.com", "customer", "tinykoala450", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "39705878"),
("Xavier", "Zhang", "xavier.zhang@example.com", "customer", "smallbird600", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "56757984"),
("Louis", "Addy", "louis.addy@example.com", "customer", "whiteleopard673", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "78009893"),
("Asta", "Møller", "asta.moller@example.com", "customer", "organicmeercat473", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "85478470"),
("کوروش", "زارعی", "khwrwsh.zraay@example.com", "customer", "heavybutterfly271", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "97555762"),
("Ted", "Mitchelle", "ted.mitchelle@example.com", "customer", "lazyladybug806", "e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3", "46794851");

-- For Testing Order Logs Trigger
-- INSERT INTO `User`(`firstName`, `lastName`, `email`, `username`, `password`, `role`) VALUES
-- ('tin lok', 'law', 'tinloklaw@example.com', 'paniom', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'customer');

-- INSERT INTO `Address`(`customerId`) VALUES
-- (2);

-- INSERT INTO `Order` VALUES
-- ('abc123', 2, 1, 2, 1, NULL, 'created', NULL, 'just created an order', NULL, NULL);

-- UPDATE `Order` 
-- SET `status`='delivering', `comments`='order is delivering' 
-- WHERE `orderId`='abc123';

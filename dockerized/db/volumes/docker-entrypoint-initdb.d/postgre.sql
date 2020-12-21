CREATE TYPE role AS ENUM ('customer', 'admin', 'driver');
CREATE TYPE status AS ENUM('Pending', 'Approved', 'Rejected', 'Cancelled', 'Assigned', 'Collecting', 'Collected', 'Delivering', 'Delivered', 'Verified');
CREATE TYPE shift AS ENUM('AM', 'PM');

CREATE TABLE "User" (
  "userId"    SERIAL PRIMARY KEY NOT NULL,
  "firstName" VARCHAR(255) NULL,
  "lastName"  VARCHAR(255) NULL,
  "email"     VARCHAR(255) NOT NULL UNIQUE,
  "phone"     VARCHAR(24) NULL,
  "username"  VARCHAR(255) NOT NULL UNIQUE,
  "password"  VARCHAR(255) NOT NULL,
  "role"      ROLE NOT NULL,
  "avatarUri" VARCHAR(255) NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP NULL
);

CREATE TABLE "Follow" (
  "followId"    SERIAL PRIMARY KEY NOT NULL,
  "followerId"  INTEGER NOT NULL REFERENCES "User"("userId"),
  "followeeId"  INTEGER NOT NULL REFERENCES "User"("userId"),
  "createdAt"   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt"   TIMESTAMP NULL,
  UNIQUE ("followerId", "followeeId")
);

CREATE TABLE "Address" (
  "addressId"     SERIAL PRIMARY KEY NOT NULL,
  "customerId"    INTEGER NOT NULL REFERENCES "User"("userId"),
  "address"       TEXT NULL,
  "district"      TEXT NULL,
  "latitude"      REAL NULL,
  "longitude"     REAL NULL,
  "createdAt"     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt"     TIMESTAMP NULL
);

CREATE TABLE "Depot" (
  "depotId"       SERIAL PRIMARY KEY NOT NULL,
  "district"      VARCHAR(255) NULL,
  "createdAt"     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt"     TIMESTAMP NULL
);

CREATE TABLE "Order" (
  "orderId"           VARCHAR(255) PRIMARY KEY NOT NULL,
  "senderId"          INTEGER NOT NULL REFERENCES "User"("userId"),
  "sendAddressId"     INTEGER NOT NULL REFERENCES "Address"("addressId"),
  "receiverId"        INTEGER NOT NULL REFERENCES "User"("userId"),
  "receiveAddressId"  INTEGER NOT NULL REFERENCES "Address"("addressId"),
  "driverId"          INTEGER NULL REFERENCES "User"("userId"),
  "weight"            REAL NULL,
  "depotId"           INTEGER NULL REFERENCES "Depot"("depotId"),
  "status"            STATUS NULL,
  "qrcode"            TEXT NULL,
  "comments"          TEXT NULL,
  "createdAt"         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt"         TIMESTAMP NULL
);

CREATE TABLE "OrderLog" (
  "orderLogId"  SERIAL PRIMARY KEY NOT NULL,
  "orderId"     VARCHAR(255) NOT NULL REFERENCES "Order"("orderId"),
  "status"      TEXT NULL,
  "comments"    TEXT NULL,
  "createdAt"   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt"   TIMESTAMP NULL
);

CREATE TABLE "Job" (
  "jobId"           SERIAL PRIMARY KEY NOT NULL,
  "driverId"        INTEGER NOT NULL REFERENCES "User"("userId"),
  "shift"           SHIFT NULL,
  "district"        VARCHAR(255) NULL,
  "totalWeight"     REAL NOT NULL DEFAULT 0,
  "createdAt"       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt"       TIMESTAMP NULL
);

CREATE FUNCTION "OrderLogProcedure"() RETURNS TRIGGER AS $OrderLog$
  BEGIN
    INSERT INTO "OrderLog"("orderId", "status", "comments") VALUES
    (NEW."orderId", NEW."status", NEW."comments");
    RETURN NEW;
  END;

$OrderLog$ LANGUAGE plpgsql;

CREATE FUNCTION "UpdateTimestamp"() RETURNS TRIGGER AS $$
  BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
  END;
  
$$ LANGUAGE plpgsql;

CREATE TRIGGER "OrderLogInsertTrigger"
  AFTER INSERT ON "Order"
  FOR EACH ROW
EXECUTE PROCEDURE "OrderLogProcedure"();

CREATE TRIGGER "OrderLogUpdateTrigger"
  AFTER UPDATE ON "Order"
  FOR EACH ROW
EXECUTE PROCEDURE "OrderLogProcedure"();

CREATE TRIGGER "OrderBeforeUpdateTrigger"
  BEFORE UPDATE ON "Order"
  FOR EACH ROW
EXECUTE PROCEDURE "UpdateTimestamp"();

CREATE TRIGGER "AddressBeforeUpdateTrigger"
  BEFORE UPDATE ON "Address"
  FOR EACH ROW
EXECUTE PROCEDURE "UpdateTimestamp"();

CREATE TRIGGER "UserBeforeUpdateTrigger"
  BEFORE UPDATE ON "User"
  FOR EACH ROW
EXECUTE PROCEDURE "UpdateTimestamp"();

INSERT INTO "User"("avatarUri", "firstName", "lastName", "email", "role", "username", "password", "phone") VALUES
('https://picsum.photos/id/1/200', 'Tim', 'Law', 'admin1@example.com', 'admin', 'admin1', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '00000000'),
('https://picsum.photos/id/2/200', 'Willard', 'Bradley', 'willard.bradley@example.com', 'customer', 'sadduck219', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '75206715'),
('https://picsum.photos/id/3/200', 'Julia', 'Freeman', 'julia.freeman@example.com', 'customer', 'yellowostrich547', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '09114140'),
('https://picsum.photos/id/4/200', 'Elena', 'Guerrero', 'elena.guerrero@example.com', 'customer', 'bluefish254', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '83127220'),
('https://picsum.photos/id/5/200', 'Delphine', 'Denys', 'delphine.denys@example.com', 'customer', 'bigzebra383', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '22467529'),
('https://picsum.photos/id/6/200', 'Eleanor', 'Smith', 'eleanor.smith@example.com', 'customer', 'whitegoose631', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '78441453'),
('https://picsum.photos/id/7/200', 'Austin', 'Lopez', 'austin.lopez@example.com', 'customer', 'greenbird908', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '14290391'),
('https://picsum.photos/id/8/200', 'Andrea', 'Jørgensen', 'andrea.jorgensen@example.com', 'customer', 'silvergoose106', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '32340298'),
('https://picsum.photos/id/9/200', 'Akseli', 'Justi', 'akseli.justi@example.com', 'customer', 'goldenbird731', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '08041938'),
('https://picsum.photos/id/10/200', 'Monica', 'Thomas', 'monica.thomas@example.com', 'customer', 'greensnake940', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '57988820'),
('https://picsum.photos/id/11/200', 'Silvia', 'Bravo', 'silvia.bravo@example.com', 'customer', 'silverrabbit231', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '19868143'),
('https://picsum.photos/id/12/200', 'Eden', 'White', 'eden.white@example.com', 'customer', 'angrygoose140', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '17889351'),
('https://picsum.photos/id/13/200', 'Jordi', 'Carmona', 'jordi.carmona@example.com', 'customer', 'redmeercat604', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '75931473'),
('https://picsum.photos/id/14/200', 'Kimi', 'Buijs', 'kimi.buijs@example.com', 'customer', 'blueleopard415', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '00812787'),
('https://picsum.photos/id/15/200', 'Barry', 'Marshall', 'barry.marshall@example.com', 'customer', 'beautifulpeacock849', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '61238516'),
('https://picsum.photos/id/16/200', 'Umut', 'Akşit', 'umut.aksit@example.com', 'customer', 'heavyladybug473', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '29601296'),
('https://picsum.photos/id/17/200', 'Sofia', 'Ellis', 'sofia.ellis@example.com', 'customer', 'heavyladybug306', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '49156984'),
('https://picsum.photos/id/18/200', 'Sarah', 'Harcourt', 'sarah.harcourt@example.com', 'customer', 'yellowleopard202', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '48263277'),
('https://picsum.photos/id/19/200', 'Patric', 'Colin', 'patric.colin@example.com', 'customer', 'sadlion859', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '20827408'),
('https://picsum.photos/id/20/200', 'Rochella', 'Akdeniz', 'rochella.akdeniz@example.com', 'customer', 'silverladybug956', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '63909170'),
('https://picsum.photos/id/21/200', 'طاها', 'سلطانی نژاد', 'th.sltnynjd@example.com', 'customer', 'beautifulrabbit580', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '05574588'),
('https://picsum.photos/id/22/200', 'Juliette', 'Novak', 'juliette.novak@example.com', 'customer', 'ticklishgoose466', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '50013580'),
('https://picsum.photos/id/23/200', 'Giuseppina', 'Lefebvre', 'giuseppina.lefebvre@example.com', 'customer', 'lazymouse950', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '06267878'),
('https://picsum.photos/id/24/200', 'Albin', 'Duivenvoorde', 'albin.duivenvoorde@example.com', 'customer', 'greenbird478', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '70974713'),
('https://picsum.photos/id/25/200', 'Marcos', 'Rojas', 'marcos.rojas@example.com', 'customer', 'ticklishfrog615', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '42431730'),
('https://picsum.photos/id/26/200', 'Serge', 'Rousseau', 'serge.rousseau@example.com', 'customer', 'brownkoala533', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '17839906'),
('https://picsum.photos/id/27/200', 'Rose', 'Stone', 'rose.stone@example.com', 'customer', 'purpletiger864', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '26671007'),
('https://picsum.photos/id/28/200', 'Alfred', 'Poulsen', 'alfred.poulsen@example.com', 'customer', 'bigzebra328', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '28414229'),
('https://picsum.photos/id/29/200', 'Cilli', 'Sack', 'cilli.sack@example.com', 'customer', 'goldensnake456', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '72786006'),
('https://picsum.photos/id/30/200', 'Jara', 'Colin', 'jara.colin@example.com', 'customer', 'orangesnake831', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '75349354'),
('https://picsum.photos/id/31/200', 'Joe', 'Meyer', 'joe.meyer@example.com', 'customer', 'redelephant502', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '75977317'),
('https://picsum.photos/id/32/200', 'Gaël', 'Nguyen', 'gael.nguyen@example.com', 'customer', 'redwolf687', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '47720845'),
('https://picsum.photos/id/33/200', 'Brayden', 'Long', 'brayden.long@example.com', 'customer', 'purplegoose597', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '38795150'),
('https://picsum.photos/id/34/200', 'Eileen', 'Lane', 'eileen.lane@example.com', 'customer', 'biggoose520', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '42801709'),
('https://picsum.photos/id/35/200', 'اميرعلي', 'علیزاده', 'myraaly.aalyzdh@example.com', 'customer', 'redzebra830', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '94858999'),
('https://picsum.photos/id/36/200', 'Rosa', 'Gerard', 'rosa.gerard@example.com', 'customer', 'beautifulmeercat968', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '93126659'),
('https://picsum.photos/id/37/200', 'Gloria', 'Garcia', 'gloria.garcia@example.com', 'customer', 'brownostrich344', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '61259106'),
('https://picsum.photos/id/38/200', 'محیا', 'موسوی', 'mhy.mwswy@example.com', 'customer', 'bigfrog476', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '34333356'),
('https://picsum.photos/id/39/200', 'Juliette', 'Chan', 'juliette.chan@example.com', 'customer', 'blackswan503', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '37780233'),
('https://picsum.photos/id/40/200', 'Tidemann', 'Schanke', 'tidemann.schanke@example.com', 'customer', 'yellowmouse934', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '86399102'),
('https://picsum.photos/id/41/200', 'Juho', 'Heikkinen', 'juho.heikkinen@example.com', 'customer', 'yellowtiger498', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '28846334'),
('https://picsum.photos/id/42/200', 'Chris', 'Campbell', 'chris.campbell@example.com', 'customer', 'brownleopard463', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '39230978'),
('https://picsum.photos/id/43/200', 'Ülkü', 'Ayverdi', 'ulku.ayverdi@example.com', 'customer', 'greenlion235', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '49703526'),
('https://picsum.photos/id/44/200', 'Mestan', 'Koç', 'mestan.koc@example.com', 'customer', 'bigwolf277', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '09236482'),
('https://picsum.photos/id/45/200', 'Martina', 'Lamm', 'martina.lamm@example.com', 'customer', 'orangesnake813', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '55077864'),
('https://picsum.photos/id/46/200', 'Tristan', 'Johansen', 'tristan.johansen@example.com', 'customer', 'silverfrog793', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '31415357'),
('https://picsum.photos/id/47/200', 'Luukas', 'Wainio', 'luukas.wainio@example.com', 'customer', 'goldenfrog208', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '88000790'),
('https://picsum.photos/id/48/200', 'Valdemar', 'Petersen', 'valdemar.petersen@example.com', 'customer', 'goldenrabbit196', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '58159137'),
('https://picsum.photos/id/49/200', 'Joona', 'Ollila', 'joona.ollila@example.com', 'customer', 'orangesnake537', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '40795369'),
('https://picsum.photos/id/50/200', 'James', 'Sims', 'james.sims@example.com', 'customer', 'lazybutterfly217', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '86341636'),
('https://picsum.photos/id/51/200', 'Lucas', 'Christiansen', 'lucas.christiansen@example.com', 'customer', 'sadmeercat283', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '05852668'),
('https://picsum.photos/id/52/200', 'Lucien', 'Leclerc', 'lucien.leclerc@example.com', 'driver', 'blackmeercat114', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '71831247'),
('https://picsum.photos/id/53/200', 'Benjamin', 'Kühne', 'benjamin.kuhne@example.com', 'driver', 'brownpanda614', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '11033936'),
('https://picsum.photos/id/54/200', 'Ray', 'Frazier', 'ray.frazier@example.com', 'driver', 'silverostrich507', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '68628628'),
('https://picsum.photos/id/55/200', 'محمدعلی', 'كامياران', 'mhmdaaly.kmyrn@example.com', 'driver', 'sadpanda672', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '31587973'),
('https://picsum.photos/id/56/200', 'Leana', 'Caron', 'leana.caron@example.com', 'driver', 'whitekoala111', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '00390295'),
('https://picsum.photos/id/57/200', 'Paul', 'Fox', 'paul.fox@example.com', 'driver', 'bluecat575', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '43883619'),
('https://picsum.photos/id/58/200', 'Ayla', 'White', 'ayla.white@example.com', 'driver', 'angryfrog220', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '09653696'),
('https://picsum.photos/id/59/200', 'Donna', 'King', 'donna.king@example.com', 'driver', 'blackfish282', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '49031824'),
('https://picsum.photos/id/60/200', 'Ayşe', 'Eliçin', 'ayse.elicin@example.com', 'driver', 'organicduck998', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '65069598'),
('https://picsum.photos/id/61/200', 'Kayla', 'Sandvik', 'kayla.sandvik@example.com', 'driver', 'happykoala308', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '70488636'),
('https://picsum.photos/id/62/200', 'Juliane', 'Stenseth', 'juliane.stenseth@example.com', 'driver', 'beautifulpanda793', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '47994156'),
('https://picsum.photos/id/63/200', 'Esma', 'Çapanoğlu', 'esma.capanoglu@example.com', 'driver', 'goldenduck992', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '36524230'),
('https://picsum.photos/id/64/200', 'Macit', 'Çevik', 'macit.cevik@example.com', 'driver', 'bluewolf371', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '45425412'),
('https://picsum.photos/id/65/200', 'Pedro', 'Ortega', 'pedro.ortega@example.com', 'driver', 'yellowswan720', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '58582140'),
('https://picsum.photos/id/66/200', 'Jamie', 'Harvey', 'jamie.harvey@example.com', 'driver', 'angrymouse215', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '29427281'),
('https://picsum.photos/id/67/200', 'Andrea', 'Sanz', 'andrea.sanz@example.com', 'driver', 'bluefish573', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '85407711'),
('https://picsum.photos/id/68/200', 'محیا', 'سهيلي راد', 'mhy.shylyrd@example.com', 'driver', 'blueladybug909', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '73167230'),
('https://picsum.photos/id/69/200', 'Elli', 'Lepisto', 'elli.lepisto@example.com', 'driver', 'redzebra144', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '82272941'),
('https://picsum.photos/id/70/200', 'Tristan', 'Olivier', 'tristan.olivier@example.com', 'driver', 'bigleopard434', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '17472516'),
('https://picsum.photos/id/71/200', 'Megan', 'Hart', 'megan.hart@example.com', 'driver', 'crazybutterfly331', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '82897565'),
('https://picsum.photos/id/72/200', 'Vanessa', 'Roberts', 'vanessa.roberts@example.com', 'driver', 'sadsnake795', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '50249922'),
('https://picsum.photos/id/73/200', 'Mina', 'Opstad', 'mina.opstad@example.com', 'driver', 'goldenbird864', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '84560747'),
('https://picsum.photos/id/74/200', 'Tristan', 'Martin', 'tristan.martin@example.com', 'driver', 'crazyrabbit561', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '34519117'),
('https://picsum.photos/id/75/200', 'Georgia', 'Wang', 'georgia.wang@example.com', 'driver', 'bigsnake862', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '69065416'),
('https://picsum.photos/id/76/200', 'Bernard', 'Carpenter', 'bernard.carpenter@example.com', 'driver', 'angrybird110', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '86304360'),
('https://picsum.photos/id/77/200', 'Nathanael', 'De Weerd', 'nathanael.deweerd@example.com', 'driver', 'sadfish374', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '33863743'),
('https://picsum.photos/id/78/200', 'Chris', 'Laurent', 'chris.laurent@example.com', 'driver', 'silverostrich843', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '96967828'),
('https://picsum.photos/id/79/200', 'Orlanda', 'Rezende', 'orlanda.rezende@example.com', 'driver', 'blackostrich904', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '29242423'),
('https://picsum.photos/id/80/200', 'Cameron', 'Chen', 'cameron.chen@example.com', 'driver', 'tinydog377', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '32529155'),
('https://picsum.photos/id/81/200', 'Bertha', 'Bryant', 'bertha.bryant@example.com', 'driver', 'crazydog884', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '46276890'),
('https://picsum.photos/id/82/200', 'Francisco', 'Elliott', 'francisco.elliott@example.com', 'customer', 'goldenzebra325', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '76308001'),
('https://picsum.photos/id/83/200', 'Ide', 'Van den Boorn', 'ide.vandenboorn@example.com', 'customer', 'blackfrog994', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '36649448'),
('https://picsum.photos/id/84/200', 'Greg', 'Holt', 'greg.holt@example.com', 'customer', 'greenmouse149', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '75854296'),
('https://picsum.photos/id/85/200', 'Natã', 'Almeida', 'nata.almeida@example.com', 'customer', 'greenrabbit532', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '84321879'),
('https://picsum.photos/id/86/200', 'Natan', 'Tvete', 'natan.tvete@example.com', 'customer', 'blackladybug135', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '72410198'),
('https://picsum.photos/id/87/200', 'Hannelore', 'Francois', 'hannelore.francois@example.com', 'customer', 'smallmouse772', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '85050435'),
('https://picsum.photos/id/88/200', 'Emre', 'Tanrıkulu', 'emre.tanrikulu@example.com', 'customer', 'bigzebra167', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '69554479'),
('https://picsum.photos/id/89/200', 'Jim', 'Reynolds', 'jim.reynolds@example.com', 'customer', 'angryfrog754', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '73934991'),
('https://picsum.photos/id/90/200', 'Friedrich-Wilhelm', 'Mengel', 'friedrich-wilhelm.mengel@example.com', 'customer', 'crazycat354', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '91010694'),
('https://picsum.photos/id/91/200', 'Heinz Dieter', 'Kunzmann', 'heinzdieter.kunzmann@example.com', 'customer', 'bluepanda752', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '64624470'),
('https://picsum.photos/id/92/200', 'Jake', 'Mitchell', 'jake.mitchell@example.com', 'customer', 'bigduck593', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '62144291'),
('https://picsum.photos/id/93/200', 'Sean', 'Hunter', 'sean.hunter@example.com', 'customer', 'whiteswan960', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '68701205'),
('https://picsum.photos/id/94/200', 'Jeppe', 'Christensen', 'jeppe.christensen@example.com', 'customer', 'beautifulgoose531', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '05654236'),
('https://picsum.photos/id/95/200', 'Beverly', 'Craig', 'beverly.craig@example.com', 'customer', 'bluemeercat720', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '68978546'),
('https://picsum.photos/id/96/200', 'Sarah', 'Rhodes', 'sarah.rhodes@example.com', 'customer', 'tinykoala450', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '39705878'),
('https://picsum.photos/id/97/200', 'Xavier', 'Zhang', 'xavier.zhang@example.com', 'customer', 'smallbird600', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '56757984'),
('https://picsum.photos/id/98/200', 'Louis', 'Addy', 'louis.addy@example.com', 'customer', 'whiteleopard673', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '78009893'),
('https://picsum.photos/id/99/200', 'Asta', 'Møller', 'asta.moller@example.com', 'customer', 'organicmeercat473', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '85478470'),
('https://picsum.photos/id/100/200', 'کوروش', 'زارعی', 'khwrwsh.zraay@example.com', 'customer', 'heavybutterfly271', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '97555762'),
('https://picsum.photos/id/101/200', 'Ted', 'Mitchelle', 'ted.mitchelle@example.com', 'customer', 'lazyladybug806', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '46794851');

INSERT INTO "Address"("customerId", "address", "district", "latitude", "longitude") VALUES
(2, '西貢污水處理廠, 華福街, 大湖角, 西貢, 西貢區, 新界', '西貢區', 22.3738015, 114.2738993846842),
(3, '青山公路－汀九段, 汀九, 深井新村, 荃灣區, 新界', '荃灣區', 22.366364375883908, 114.07307598507671),
(4, 'M176, 麥理浩徑第10段, 小欖, 屯門區, 新界', '屯門區', 22.3974452, 114.0393574),
(5, '吐露港公路, 山頂花園, 下碗窰, 半山洲, 大埔區, 新界', '大埔區', 22.440864572170405, 114.15927139540524),
(6, '尖山隧道, 六合村, 顯田村, 沙田區, 新界', '沙田區', 22.349233096195544, 114.1555541300462),
(7, '大埔鐵路碼頭, 大埔區單車主幹綫, 山頂花園, 大埔滘老圍, 大埔, 大埔區, 新界', '大埔區', 22.442411999999997, 114.18389208233043),
(8, 'Lower Ho Pui Bike Trail, 河背, 元朗區, 新界', '元朗區', 22.4088609, 114.0751933),
(9, '北港路, 北港, 西貢, 西貢區, 新界', '西貢區', 22.379806275220048, 114.25482610362396),
(10, '麥理浩徑第5段, 下徑口, 沙田區, 新界', '沙田區', 22.3555748, 114.191102),
(11, '躉場路, 躉場上村, 西貢, 西貢區, 新界', '西貢區', 22.3834783, 114.267807),
(12, '牛欄咀, 珀麗路, 馬灣 Ma Wan, 深井村, 荃灣區, 新界', '荃灣區', 22.3557608, 114.0650375),
(13, '麥理浩徑第2段, 赤徑, 大埔區, 新界', '大埔區', 22.422099, 114.347628),
(14, '鹽田梓, 西貢區, 新界', '西貢區', 22.3774597, 114.3022444),
(15, '和合石路, 和合石, 和合石村, 北區, 新界', '北區', 22.478046942920255, 114.14805669869797),
(16, '深涌灣, 荔枝莊地質步道, 荔枝莊, 大埔區, 新界', '大埔區', 22.442169, 114.2819753),
(17, '禾萬古道, 梧桐寨, 大埔頭, 大埔區, 新界', '大埔區', 22.4314111, 114.1311112),
(18, '望后脊, 望后石谷, 沙埔崗, 屯門區, 新界', '屯門區', 22.385422710924495, 113.94075359790367),
(19, '大埔滘林道－滘鉛段, 打鐵屻, 半山洲, 大埔區, 新界', '大埔區', 22.4210714, 114.1708445),
(20, 'Landslide bypass, 搖斗坪, 九肚, 沙田區, 新界', '沙田區', 22.4075916, 114.1859346),
(21, '圓墩郊遊徑, 青龍頭, 深井村, 荃灣區, 新界', '荃灣區', 22.37516433339478, 114.03894418193569),
(22, '黃石家樂徑, 土瓜坪, 大埔區, 新界', '大埔區', 22.430404799999998, 114.3340032253233),
(23, '元荃古道, 油柑頭村, 荃灣, 荃灣區, 新界', '荃灣區', 22.386935521803657, 114.07524682851744),
(24, '翠柏路, 加州花園, 新田, 元朗區, 新界', '元朗區', 22.48410971609101, 114.05084053813971),
(25, '康富路, 蕉坑, 西貢, 西貢區, 新界', '西貢區', 22.3740973, 114.2698918),
(26, '南丫, 西貢, 西貢區, 新界', '西貢區', 22.396691570297083, 114.278910313437),
(27, '掃管笏村, 小秀, 屯門區, 新界', '屯門區', 22.377877, 114.0058246),
(28, '鹿湖郊遊徑, 大埔區, 新界', '大埔區', 22.4063128, 114.350795),
(29, '邊境路, 天水圍, 元朗區, 新界', '元朗區', 22.473569716100656, 114.02763298577068),
(30, '四城林徑, 荃灣區, 新界', '荃灣區', 22.4030646, 114.1474831),
(31, '荃灣鐵路站, 西樓角路, 木棉下村, 荃灣, 荃灣區, 新界', '荃灣區', 22.37374805, 114.11643754882215),
(32, '月牙谷, 花朗古道 Fa Long Ancient Trail, 大冷水, 龍鼓灘, 北朗, 屯門區, 新界', '屯門區', 22.3996021, 113.9410732),
(33, '大灘郊遊徑, 大灘, 大埔區, 新界', '大埔區', 22.4550241, 114.3341275),
(34, '青山公路－青龍頭段, 青龍頭, 深井村, 荃灣區, 新界', '荃灣區', 22.358455179065146, 114.03880926880502),
(35, '屏會中心, 13-17, 屏會街, 水田村, 水邊村, 元朗, 元朗區, 新界', '元朗區', 22.446585900000002, 114.02205019908428),
(36, '道風山路, 銅鑼灣, 友愛村, 銅鑼灣, 沙田區, 新界', '沙田區', 22.3867467, 114.177078),
(37, '清水灣, 清水灣樹木研習徑, 大環頭, 將軍澳, 西貢區, 新界', '西貢區', 22.28467135, 114.29627147255921),
(38, '北朗, 屯門區, 新界', '屯門區', 22.3921149, 113.9205937),
(39, '麥理浩徑第10段, 小欖, 屯門區, 新界', '屯門區', 22.3919976, 114.020093),
(40, '楊家村, 大棠村, 元朗區, 新界', '元朗區', 22.4074231, 114.0239131),     
(41, '觀音脊, 布心排, 大埔區, 新界', '大埔區', 22.479229622214604, 114.203611492832),
(42, '大欖涌郊遊徑, 錦田, 元朗, 元朗區, 新界', '元朗區', 22.426202060613264, 114.05882023755612),
(43, '上禾坑, 北區, 新界', '北區', 22.5235303, 114.1954245),
(44, '大埔滘林道－乾坑段, 半山洲, 大埔區, 新界', '大埔區', 22.4161909, 114.1830539),
(45, '城門下村垃圾收集站, 和宜合道, 城門下村, 葵涌, 葵青區, 新界', '葵青區', 22.37722035, 114.13748579965659),
(46, '糧船灣, 西貢區, 新界', '西貢區', 22.358805, 114.3544763),
(47, '20, 林錦公路, 林村谷, 大埔頭, 大埔區, 新界', '大埔區', 22.44944505, 114.13492777460763),
(48, 'C3108, 大坳門路, 布袋澳, 將軍澳, 西貢區, 新界', '西貢區', 22.2853631, 114.2837371),
(49, '北潭路, 北潭凹, 大埔區, 新界', '大埔區', 22.410138667289317, 114.32582873929607),
(50, '橫七古道, 下七木橋, 北區, 新界', '北區', 22.5094308, 114.2162006),
(51, '北潭路, 高塘下洋, 大埔區, 新界', '大埔區', 22.434828022026597, 114.32977350527922),
(52, '城門標本林, 城門林道－標本林段, 荃灣區, 新界', '荃灣區', 22.4054425, 114.1566057),
(53, '錦龍橋, 大涌橋路, 圓洲角, 多石村, 沙田區, 新界', '沙田區', 22.388052199999997, 114.20030737434249),
(54, '加多利灣泳灘, 青茵街, 三聖, 屯門南, 屯門, 屯門區, 新界', '屯門區', 22.3765703, 113.9815756926868),
(55, '大刀屻徑, 上村, 元朗區, 新界', '元朗區', 22.4460356, 114.1134684),
(56, 'C3308, 馬鞍山郊遊徑, 馬鞍山, 沙田區, 新界', '沙田區', 22.3854287, 114.2584528),
(57, '打鐵屻脊, 打鐵屻, 半山洲, 大埔區, 新界', '大埔區', 22.4205642, 114.1625769),
(58, '衞奕信徑第八段, 鳳園, 大埔, 大埔區, 新界', '大埔區', 22.4750973, 114.1691655),
(59, '龍璣閣 (D座）, 大磡道, 大磡, 竹園聯合村, 九龍, 黃大仙區', '黃大仙區', 22.34249165, 114.19964366213276),
(60, '屯門徑, 紅橋, 新墟村, 屯門, 屯門區, 新界', '屯門區', 22.400073981106427, 113.98457641778185),
(61, '麥理浩徑第10段, 屯門, 屯門區, 新界', '屯門區', 22.3952082, 114.0275313),
(62, '麥理浩夫人度假村, 榕北走廊, 榕樹澳, 大埔區, 新界', '大埔區', 22.407477649999997, 114.32193530867607),
(63, '冠發街, 樂安排, 小欖新村, 小欖, 屯門區, 新界', '屯門區', 22.368418761682747, 114.00756403551082),
(64, '藝滿至大刀刃, 打石湖石塘, 元朗區, 新界', '元朗區', 22.452745265085554, 114.1128361931511),
(65, '明愛小塘營, 荔枝莊地質步道, 荔枝莊, 大埔區, 新界', '大埔區', 22.4575925, 114.3046054),
(66, '鳳崗, 上水, 北區, 新界', '北區', 22.50898291838572, 114.09689010694804),
(67, 'Trailhead, 馬鞍山郊遊徑, 黃竹山新村, 西貢, 西貢區, 新界', '西貢區', 22.3856446, 114.260749),
(68, '亞公角山路, 亞公角, 大水坑村, 沙田區, 新界', '沙田區', 22.39504385, 114.21865173101756),
(69, '沙頭角公路－禾坑段, 上禾坑, 南涌, 北區, 新界', '北區', 22.524573984842185, 114.18849059188004),
(70, '秋楓樹, 鯽魚湖, 西貢區, 新界', '西貢區', 22.4064401, 114.3272454),
(71, 'Robin''s Nest Jeep Track, 塘肚山村, 北區, 新界', '北區', 22.536414, 114.18501),
(72, '踏石角渡頭, 龍輝街, 龍鼓灘, 沙埔崗, 屯門區, 新界', '屯門區', 22.3787612, 113.91665650590211),
(73, '東華三院馮黃鳳亭中學, 3-5, 瀝源街, 沙田市中心, 沙田, 沙田區, 新界', '沙田區', 22.3848561, 114.19288676379787),
(74, '梧桐河 River Indus (Ng Tung River), 虎地坳道 Fu Tei Au Road, 虎地坳 Fu Tei Au, 上水圍, 北區, 新界', '北區', 22.51521555, 114.1228615840009),
(75, '楊家村, 大棠村, 元朗區, 新界', '元朗區', 22.4101916, 114.0207629),
(76, '吉田大廈(第二及三期), 2, 新力街, 屯門工業區, 屯門舊墟, 青山村, 屯門區, 新界', '屯門區', 22.3935973, 113.96835512277664),
(77, '大網仔路, 鯽魚湖, 西貢區, 新界', '西貢區', 22.3959586, 114.3277031),
(78, '鹹田, 西貢區, 新界', '西貢區', 22.4115987, 114.3756965),
(79, '66, 多石村, 插桅杆村, 沙田, 沙田區, 新界', '沙田區', 22.377067599999997, 114.2035010467851),
(80, '大網仔路, 斬竹灣, 西貢, 西貢區, 新界', '西貢區', 22.39253545134506, 114.3091861224257),
(81, '大埔滘林道－乾坑段, 半山洲, 大埔區, 新界', '大埔區', 22.4208533, 114.1850693),
(82, '粉錦公路, 橫台山, 上輋, 元朗區, 新界', '元朗區', 22.457681293905175, 114.09961664565354),
(83, 'Firing Range, 比昂大道, 葡萄園, 新田, 元朗區, 新界', '元朗區', 22.4814073, 114.0670569),
(84, '馬灣漁民新村, 深井村, 荃灣區, 新界', '荃灣區', 22.3496903, 114.055865),
(85, 'Block A Tai Lung Veterinary Laboratory, 粉錦公路, 安圃村, 丙崗, 北區, 新界', '北區', 22.48228675, 114.11624474037839),
(86, '清快塘喜香農莊, 大欖隧道, 清快塘, 深井新村, 荃灣區, 新界', '荃灣區', 22.3814726, 114.0619584),
(87, '麒麟山食水缸, 水務道路 Water Supplied Trail, 長瀝, 蕉徑, 北區, 新界', '北區', 22.49137085, 114.09239423032383),
(88, '望發街, 望后石谷, 沙埔崗, 屯門區, 新界', '屯門區', 22.378773770656174, 113.94440686824534),
(89, '將軍澳, 貓頭鷹脊, 調景嶺, 將軍澳, 西貢區, 新界', '西貢區', 22.29235405, 114.25775726431843),
(90, '東風路, 五源村, 半山洲, 大埔區, 新界', '大埔區', 22.4472536, 114.1280976),
(91, '聯益漁村, 汀角, 大埔區, 新界', '大埔區', 22.4555385, 114.2149011),
(92, '福僑大樓, 143-145, 福華街, 元洲, 深水埗, 深水埗區, 九龍', '深水埗區', 22.331182300000002, 114.16251993890859),
(93, '西貢西灣路, 爛泥灣, 西貢區, 新界', '西貢區', 22.394915957879935, 114.33162061060031),
(94, '上山雞乙, 坪輋, 北區, 新界', '北區', 22.520092671875126, 114.15040773640852),
(95, '衛奕信徑第8段, 山頂花園, 上碗窰, 半山洲, 大埔區, 新界', '大埔區', 22.4363739, 114.1564946),
(96, '22, 百和路, 吳屋村, 上水, 北區, 新界', '北區', 22.49621925, 114.1274592),
(97, '清水灣半島, 駿昇街, 將軍澳工業邨, 大赤沙, 將軍澳, 西貢區, 新界', '西貢區', 22.2921291, 114.2807959),
(98, '粉嶺繞道, 安樂村工業區, 崇謙堂村, 龍躍頭, 北區, 新界', '北區', 22.506376790449327, 114.14554113657121),
(99, '十八鄉, 洪水橋, 元朗區, 新界', '元朗區', 22.41124571116594, 114.04697540394162),
(100, '深涌, 大埔區, 新界', '大埔區', 22.4411059, 114.288209),
(101, '大藍湖路, 牛寮, 井欄樹, 西貢區, 新界', '西貢區', 22.3560987, 114.2346486);

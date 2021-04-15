CREATE TYPE role AS ENUM ('customer', 'admin', 'driver');
CREATE TYPE status AS ENUM('Pending', 'Approved', 'Rejected', 'Cancelled', 'Collecting', 'Delivering', 'Delivered');
CREATE TYPE job_status AS ENUM('Processing', 'Finished');

CREATE TABLE "User" (
  "userId"    SERIAL PRIMARY KEY NOT NULL,
  "firstName" VARCHAR(255) NULL,
  "lastName"  VARCHAR(255) NULL,
  "email"     VARCHAR(255) NOT NULL UNIQUE,
  "phone"     VARCHAR(24) NULL,
  "username"  VARCHAR(255) NOT NULL UNIQUE,
  "password"  VARCHAR(255) NOT NULL,
  "role"      ROLE NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP NULL
);

CREATE TABLE "Order" (
  "orderId"               VARCHAR(255) PRIMARY KEY NOT NULL,
  "creatorId"             INTEGER NOT NULL REFERENCES "User"("userId"),
  "senderId"              INTEGER NOT NULL REFERENCES "User"("userId"),
  "sendAddress"           TEXT NULL,
  "sendLatLng"            TEXT NULL,
  "receiverId"            INTEGER NOT NULL REFERENCES "User"("userId"),
  "receiveAddress"        TEXT NULL,
  "receiveLatLng"         TEXT NULL,
  "suggestedPolylines"    TEXT NULL,
  "status"                STATUS NULL,
  "comments"              TEXT NULL,
  "estimatedDuration"     INTEGER NULL,
  "expectedCollectedTime" INTEGER NULL,
  "expectedDeliveredTime" INTEGER NULL,
  "createdAt"             TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"             TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt"             TIMESTAMP NULL
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
  "jobId"       SERIAL PRIMARY KEY NOT NULL,
  "driverId"    INTEGER NOT NULL REFERENCES "User"("userId"),
  "orderId"     VARCHAR(255) NOT NULL REFERENCES "Order"("orderId"),
  "status"      JOB_STATUS NULL,
  "polylines"   TEXT NULL,
  "duration"    INTEGER NULL,
  "createdAt"   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt"   TIMESTAMP NULL
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

CREATE TRIGGER "UserBeforeUpdateTrigger"
  BEFORE UPDATE ON "User"
  FOR EACH ROW
EXECUTE PROCEDURE "UpdateTimestamp"();

CREATE TRIGGER "JobBeforeUpdateTrigger"
  BEFORE UPDATE ON "Job"
  FOR EACH ROW
EXECUTE PROCEDURE "UpdateTimestamp"();

INSERT INTO "User"("firstName", "lastName", "email", "role", "username", "password", "phone") VALUES
('Ted', 'Mitchelle', 'ted.mitchelle@example.com', 'customer', 'lazyladybug806', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '46794851'),
('Willard', 'Bradley', 'willard.bradley@example.com', 'customer', 'sadduck219', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '75206715'),
('Julia', 'Freeman', 'julia.freeman@example.com', 'customer', 'yellowostrich547', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '09114140'),
('Elena', 'Guerrero', 'elena.guerrero@example.com', 'customer', 'bluefish254', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '83127220'),
('Delphine', 'Denys', 'delphine.denys@example.com', 'customer', 'bigzebra383', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '22467529'),
('Eleanor', 'Smith', 'eleanor.smith@example.com', 'customer', 'whitegoose631', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '78441453'),
('Austin', 'Lopez', 'austin.lopez@example.com', 'customer', 'greenbird908', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '14290391'),
('Andrea', 'Jørgensen', 'andrea.jorgensen@example.com', 'customer', 'silvergoose106', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '32340298'),
('Akseli', 'Justi', 'akseli.justi@example.com', 'customer', 'goldenbird731', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '08041938'),
('Monica', 'Thomas', 'monica.thomas@example.com', 'customer', 'greensnake940', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '57988820'),
('Silvia', 'Bravo', 'silvia.bravo@example.com', 'customer', 'silverrabbit231', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '19868143'),
('Eden', 'White', 'eden.white@example.com', 'customer', 'angrygoose140', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '17889351'),
('Jordi', 'Carmona', 'jordi.carmona@example.com', 'customer', 'redmeercat604', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '75931473'),
('Kimi', 'Buijs', 'kimi.buijs@example.com', 'customer', 'blueleopard415', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '00812787'),
('Barry', 'Marshall', 'barry.marshall@example.com', 'customer', 'beautifulpeacock849', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '61238516'),
('Umut', 'Akşit', 'umut.aksit@example.com', 'customer', 'heavyladybug473', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '29601296'),
('Sofia', 'Ellis', 'sofia.ellis@example.com', 'customer', 'heavyladybug306', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '49156984'),
('Sarah', 'Harcourt', 'sarah.harcourt@example.com', 'customer', 'yellowleopard202', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '48263277'),
('Patric', 'Colin', 'patric.colin@example.com', 'customer', 'sadlion859', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '20827408'),
('Rochella', 'Akdeniz', 'rochella.akdeniz@example.com', 'customer', 'silverladybug956', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '63909170'),
('طاها', 'سلطانی نژاد', 'th.sltnynjd@example.com', 'customer', 'beautifulrabbit580', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '05574588'),
('Juliette', 'Novak', 'juliette.novak@example.com', 'customer', 'ticklishgoose466', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '50013580'),
('Giuseppina', 'Lefebvre', 'giuseppina.lefebvre@example.com', 'customer', 'lazymouse950', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '06267878'),
('Albin', 'Duivenvoorde', 'albin.duivenvoorde@example.com', 'customer', 'greenbird478', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '70974713'),
('Marcos', 'Rojas', 'marcos.rojas@example.com', 'customer', 'ticklishfrog615', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '42431730'),
('Serge', 'Rousseau', 'serge.rousseau@example.com', 'customer', 'brownkoala533', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '17839906'),
('Rose', 'Stone', 'rose.stone@example.com', 'customer', 'purpletiger864', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '26671007'),
('Alfred', 'Poulsen', 'alfred.poulsen@example.com', 'customer', 'bigzebra328', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '28414229'),
('Cilli', 'Sack', 'cilli.sack@example.com', 'customer', 'goldensnake456', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '72786006'),
('Jara', 'Colin', 'jara.colin@example.com', 'customer', 'orangesnake831', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '75349354'),
('Joe', 'Meyer', 'joe.meyer@example.com', 'customer', 'redelephant502', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '75977317'),
('Gaël', 'Nguyen', 'gael.nguyen@example.com', 'customer', 'redwolf687', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '47720845'),
('Brayden', 'Long', 'brayden.long@example.com', 'customer', 'purplegoose597', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '38795150'),
('Eileen', 'Lane', 'eileen.lane@example.com', 'customer', 'biggoose520', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '42801709'),
('اميرعلي', 'علیزاده', 'myraaly.aalyzdh@example.com', 'customer', 'redzebra830', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '94858999'),
('Rosa', 'Gerard', 'rosa.gerard@example.com', 'customer', 'beautifulmeercat968', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '93126659'),
('Gloria', 'Garcia', 'gloria.garcia@example.com', 'customer', 'brownostrich344', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '61259106'),
('محیا', 'موسوی', 'mhy.mwswy@example.com', 'customer', 'bigfrog476', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '34333356'),
('Juliette', 'Chan', 'juliette.chan@example.com', 'customer', 'blackswan503', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '37780233'),
('Tidemann', 'Schanke', 'tidemann.schanke@example.com', 'customer', 'yellowmouse934', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '86399102'),
('Juho', 'Heikkinen', 'juho.heikkinen@example.com', 'customer', 'yellowtiger498', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '28846334'),
('Chris', 'Campbell', 'chris.campbell@example.com', 'customer', 'brownleopard463', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '39230978'),
('Ülkü', 'Ayverdi', 'ulku.ayverdi@example.com', 'customer', 'greenlion235', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '49703526'),
('Mestan', 'Koç', 'mestan.koc@example.com', 'customer', 'bigwolf277', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '09236482'),
('Martina', 'Lamm', 'martina.lamm@example.com', 'customer', 'orangesnake813', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '55077864'),
('Tristan', 'Johansen', 'tristan.johansen@example.com', 'customer', 'silverfrog793', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '31415357'),
('Luukas', 'Wainio', 'luukas.wainio@example.com', 'customer', 'goldenfrog208', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '88000790'),
('Valdemar', 'Petersen', 'valdemar.petersen@example.com', 'customer', 'goldenrabbit196', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '58159137'),
('Joona', 'Ollila', 'joona.ollila@example.com', 'customer', 'orangesnake537', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '40795369'),
('James', 'Sims', 'james.sims@example.com', 'customer', 'lazybutterfly217', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '86341636'),
('Lucas', 'Christiansen', 'lucas.christiansen@example.com', 'customer', 'sadmeercat283', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '05852668'),
('Lucien', 'Leclerc', 'lucien.leclerc@example.com', 'customer', 'blackmeercat114', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '71831247'),
('Benjamin', 'Kühne', 'benjamin.kuhne@example.com', 'customer', 'brownpanda614', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '11033936'),
('Ray', 'Frazier', 'ray.frazier@example.com', 'customer', 'silverostrich507', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '68628628'),
('محمدعلی', 'كامياران', 'mhmdaaly.kmyrn@example.com', 'customer', 'sadpanda672', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '31587973'),
('Leana', 'Caron', 'leana.caron@example.com', 'customer', 'whitekoala111', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '00390295'),
('Paul', 'Fox', 'paul.fox@example.com', 'customer', 'bluecat575', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '43883619'),
('Ayla', 'White', 'ayla.white@example.com', 'customer', 'angryfrog220', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '09653696'),
('Donna', 'King', 'donna.king@example.com', 'customer', 'blackfish282', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '49031824'),
('Ayşe', 'Eliçin', 'ayse.elicin@example.com', 'customer', 'organicduck998', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '65069598'),
('Kayla', 'Sandvik', 'kayla.sandvik@example.com', 'customer', 'happykoala308', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '70488636'),
('Juliane', 'Stenseth', 'juliane.stenseth@example.com', 'customer', 'beautifulpanda793', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '47994156'),
('Esma', 'Çapanoğlu', 'esma.capanoglu@example.com', 'customer', 'goldenduck992', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '36524230'),
('Macit', 'Çevik', 'macit.cevik@example.com', 'customer', 'bluewolf371', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '45425412'),
('Pedro', 'Ortega', 'pedro.ortega@example.com', 'customer', 'yellowswan720', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '58582140'),
('Jamie', 'Harvey', 'jamie.harvey@example.com', 'customer', 'angrymouse215', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '29427281'),
('Andrea', 'Sanz', 'andrea.sanz@example.com', 'customer', 'bluefish573', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '85407711'),
('محیا', 'سهيلي راد', 'mhy.shylyrd@example.com', 'customer', 'blueladybug909', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '73167230'),
('Elli', 'Lepisto', 'elli.lepisto@example.com', 'customer', 'redzebra144', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '82272941'),
('Tristan', 'Olivier', 'tristan.olivier@example.com', 'customer', 'bigleopard434', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '17472516'),
('Megan', 'Hart', 'megan.hart@example.com', 'customer', 'crazybutterfly331', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '82897565'),
('Vanessa', 'Roberts', 'vanessa.roberts@example.com', 'driver', 'sadsnake795', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '50249922'),
('Mina', 'Opstad', 'mina.opstad@example.com', 'driver', 'goldenbird864', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '84560747'),
('Tristan', 'Martin', 'tristan.martin@example.com', 'driver', 'crazyrabbit561', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '34519117'),
('Georgia', 'Wang', 'georgia.wang@example.com', 'driver', 'bigsnake862', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '69065416'),
('Bernard', 'Carpenter', 'bernard.carpenter@example.com', 'driver', 'angrybird110', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '86304360'),
('Nathanael', 'De Weerd', 'nathanael.deweerd@example.com', 'driver', 'sadfish374', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '33863743'),
('Chris', 'Laurent', 'chris.laurent@example.com', 'driver', 'silverostrich843', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '96967828'),
('Orlanda', 'Rezende', 'orlanda.rezende@example.com', 'driver', 'blackostrich904', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '29242423'),
('Cameron', 'Chen', 'cameron.chen@example.com', 'driver', 'tinydog377', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '32529155'),
('Bertha', 'Bryant', 'bertha.bryant@example.com', 'driver', 'crazydog884', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '46276890'),
('Francisco', 'Elliott', 'francisco.elliott@example.com', 'driver', 'goldenzebra325', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '76308001'),
('Ide', 'Van den Boorn', 'ide.vandenboorn@example.com', 'driver', 'blackfrog994', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '36649448'),
('Greg', 'Holt', 'greg.holt@example.com', 'driver', 'greenmouse149', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '75854296'),
('Natã', 'Almeida', 'nata.almeida@example.com', 'driver', 'greenrabbit532', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '84321879'),
('Natan', 'Tvete', 'natan.tvete@example.com', 'driver', 'blackladybug135', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '72410198'),
('Hannelore', 'Francois', 'hannelore.francois@example.com', 'driver', 'smallmouse772', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '85050435'),
('Emre', 'Tanrıkulu', 'emre.tanrikulu@example.com', 'driver', 'bigzebra167', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '69554479'),
('Jim', 'Reynolds', 'jim.reynolds@example.com', 'driver', 'angryfrog754', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '73934991'),
('Friedrich-Wilhelm', 'Mengel', 'friedrich-wilhelm.mengel@example.com', 'driver', 'crazycat354', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '91010694'),
('Heinz Dieter', 'Kunzmann', 'heinzdieter.kunzmann@example.com', 'driver', 'bluepanda752', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '64624470'),
('Jake', 'Mitchell', 'jake.mitchell@example.com', 'driver', 'bigduck593', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '62144291'),
('Sean', 'Hunter', 'sean.hunter@example.com', 'driver', 'whiteswan960', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '68701205'),
('Jeppe', 'Christensen', 'jeppe.christensen@example.com', 'driver', 'beautifulgoose531', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '05654236'),
('Beverly', 'Craig', 'beverly.craig@example.com', 'driver', 'bluemeercat720', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '68978546'),
('Sarah', 'Rhodes', 'sarah.rhodes@example.com', 'driver', 'tinykoala450', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '39705878'),
('Xavier', 'Zhang', 'xavier.zhang@example.com', 'driver', 'smallbird600', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '56757984'),
('Louis', 'Addy', 'louis.addy@example.com', 'admin', 'whiteleopard673', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '78009893'),
('Asta', 'Møller', 'asta.moller@example.com', 'admin', 'organicmeercat473', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '85478470'),
('کوروش', 'زارعی', 'khwrwsh.zraay@example.com', 'admin', 'heavybutterfly271', 'e1f3ed9c4fd35d621584356eff577be55e1025b7b18a6a09a7e06b28fcff7ad3', '97555762');

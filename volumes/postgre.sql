CREATE TYPE role AS ENUM ('customer', 'admin', 'driver');
CREATE TYPE status AS ENUM('Pending', 'Approved', 'Rejected', 'Cancelled', 'Collecting', 'Delivering', 'Delivered');
CREATE TYPE job_status AS ENUM('Created', 'Processing', 'Finished');

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
  "orderId"           VARCHAR(255) PRIMARY KEY NOT NULL,
  "senderId"          INTEGER NOT NULL REFERENCES "User"("userId"),
  "sendAddress"       TEXT NULL,
  "sendLatLng"        TEXT NULL,
  "receiverId"        INTEGER NOT NULL REFERENCES "User"("userId"),
  "receiveAddress"    TEXT NULL,
  "receiveLatLng"     TEXT NULL,
  "status"            STATUS NULL,
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
  "jobId"       SERIAL PRIMARY KEY NOT NULL,
  "driverId"    INTEGER NOT NULL REFERENCES "User"("userId"),
  "orderId"     VARCHAR(255) NOT NULL REFERENCES "Order"("orderId"),
  "status"      JOB_STATUS NULL,
  "polylines"   TEXT NULL,
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

-- INSERT INTO "Address"("customerId", "address", "district", "latitude", "longitude") VALUES
-- (1, 'C3308, 馬鞍山郊遊徑, 馬鞍山, Sha Tin, 新界', 'Sha Tin', 22.3854287, 114.2584528),
-- (2, '西貢污水處理廠, 華福街, 大湖角, 西貢, Sai Kung, 新界', 'Sai Kung', 22.3738015, 114.2738993846842),
-- (3, '青山公路－汀九段, 汀九, 深井新村, Tsuen Wan, 新界', 'Tsuen Wan', 22.366364375883908, 114.07307598507671),
-- (4, 'M176, 麥理浩徑第10段, 小欖, Tuen Mun, 新界', 'Tuen Mun', 22.3974452, 114.0393574),
-- (5, '吐露港公路, 山頂花園, 下碗窰, 半山洲, Tai Po, 新界', 'Tai Po', 22.440864572170405, 114.15927139540524),
-- (6, '尖山隧道, 六合村, 顯田村, Sha Tin, 新界', 'Sha Tin', 22.349233096195544, 114.1555541300462),
-- (7, '大埔鐵路碼頭, Tai Po單車主幹綫, 山頂花園, 大埔滘老圍, 大埔, Tai Po, 新界', 'Tai Po', 22.442411999999997, 114.18389208233043),
-- (8, 'Lower Ho Pui Bike Trail, 河背, Yuen Long, 新界', 'Yuen Long', 22.4088609, 114.0751933),
-- (9, '北港路, 北港, 西貢, Sai Kung, 新界', 'Sai Kung', 22.379806275220048, 114.25482610362396),
-- (10, '麥理浩徑第5段, 下徑口, Sha Tin, 新界', 'Sha Tin', 22.3555748, 114.191102),
-- (11, '躉場路, 躉場上村, 西貢, Sai Kung, 新界', 'Sai Kung', 22.3834783, 114.267807),
-- (12, '牛欄咀, 珀麗路, 馬灣 Ma Wan, 深井村, Tsuen Wan, 新界', 'Tsuen Wan', 22.3557608, 114.0650375),
-- (13, '麥理浩徑第2段, 赤徑, Tai Po, 新界', 'Tai Po', 22.422099, 114.347628),
-- (14, '鹽田梓, Sai Kung, 新界', 'Sai Kung', 22.3774597, 114.3022444),
-- (15, '和合石路, 和合石, 和合石村, North, 新界', 'North', 22.478046942920255, 114.14805669869797),
-- (16, '深涌灣, 荔枝莊地質步道, 荔枝莊, Tai Po, 新界', 'Tai Po', 22.442169, 114.2819753),
-- (17, '禾萬古道, 梧桐寨, 大埔頭, Tai Po, 新界', 'Tai Po', 22.4314111, 114.1311112),
-- (18, '望后脊, 望后石谷, 沙埔崗, Tuen Mun, 新界', 'Tuen Mun', 22.385422710924495, 113.94075359790367),
-- (19, '大埔滘林道－滘鉛段, 打鐵屻, 半山洲, Tai Po, 新界', 'Tai Po', 22.4210714, 114.1708445),
-- (20, 'Landslide bypass, 搖斗坪, 九肚, Sha Tin, 新界', 'Sha Tin', 22.4075916, 114.1859346),
-- (21, '圓墩郊遊徑, 青龍頭, 深井村, Tsuen Wan, 新界', 'Tsuen Wan', 22.37516433339478, 114.03894418193569),
-- (22, '黃石家樂徑, 土瓜坪, Tai Po, 新界', 'Tai Po', 22.430404799999998, 114.3340032253233),
-- (23, '元荃古道, 油柑頭村, 荃灣, Tsuen Wan, 新界', 'Tsuen Wan', 22.386935521803657, 114.07524682851744),
-- (24, '翠柏路, 加州花園, 新田, Yuen Long, 新界', 'Yuen Long', 22.48410971609101, 114.05084053813971),
-- (25, '康富路, 蕉坑, 西貢, Sai Kung, 新界', 'Sai Kung', 22.3740973, 114.2698918),
-- (26, '南丫, 西貢, Sai Kung, 新界', 'Sai Kung', 22.396691570297083, 114.278910313437),
-- (27, '掃管笏村, 小秀, Tuen Mun, 新界', 'Tuen Mun', 22.377877, 114.0058246),
-- (28, '鹿湖郊遊徑, Tai Po, 新界', 'Tai Po', 22.4063128, 114.350795),
-- (29, '邊境路, 天水圍, Yuen Long, 新界', 'Yuen Long', 22.473569716100656, 114.02763298577068),
-- (30, '四城林徑, Tsuen Wan, 新界', 'Tsuen Wan', 22.4030646, 114.1474831),
-- (31, '荃灣鐵路站, 西樓角路, 木棉下村, 荃灣, Tsuen Wan, 新界', 'Tsuen Wan', 22.37374805, 114.11643754882215),
-- (32, '月牙谷, 花朗古道 Fa Long Ancient Trail, 大冷水, 龍鼓灘, 北朗, Tuen Mun, 新界', 'Tuen Mun', 22.3996021, 113.9410732),
-- (33, '大灘郊遊徑, 大灘, Tai Po, 新界', 'Tai Po', 22.4550241, 114.3341275),
-- (34, '青山公路－青龍頭段, 青龍頭, 深井村, Tsuen Wan, 新界', 'Tsuen Wan', 22.358455179065146, 114.03880926880502),
-- (35, '屏會中心, 13-17, 屏會街, 水田村, 水邊村, 元朗, Yuen Long, 新界', 'Yuen Long', 22.446585900000002, 114.02205019908428),
-- (36, '道風山路, 銅鑼灣, 友愛村, 銅鑼灣, Sha Tin, 新界', 'Sha Tin', 22.3867467, 114.177078),
-- (37, '清水灣, 清水灣樹木研習徑, 大環頭, 將軍澳, Sai Kung, 新界', 'Sai Kung', 22.28467135, 114.29627147255921),
-- (38, '北朗, Tuen Mun, 新界', 'Tuen Mun', 22.3921149, 113.9205937),
-- (39, '麥理浩徑第10段, 小欖, Tuen Mun, 新界', 'Tuen Mun', 22.3919976, 114.020093),
-- (40, '楊家村, 大棠村, Yuen Long, 新界', 'Yuen Long', 22.4074231, 114.0239131),     
-- (41, '觀音脊, 布心排, Tai Po, 新界', 'Tai Po', 22.479229622214604, 114.203611492832),
-- (42, '大欖涌郊遊徑, 錦田, 元朗, Yuen Long, 新界', 'Yuen Long', 22.426202060613264, 114.05882023755612),
-- (43, '上禾坑, North, 新界', 'North', 22.5235303, 114.1954245),
-- (44, '大埔滘林道－乾坑段, 半山洲, Tai Po, 新界', 'Tai Po', 22.4161909, 114.1830539),
-- (45, '城門下村垃圾收集站, 和宜合道, 城門下村, 葵涌, Kwai Tsing, 新界', 'Kwai Tsing', 22.37722035, 114.13748579965659),
-- (46, '糧船灣, Sai Kung, 新界', 'Sai Kung', 22.358805, 114.3544763),
-- (47, '20, 林錦公路, 林村谷, 大埔頭, Tai Po, 新界', 'Tai Po', 22.44944505, 114.13492777460763),
-- (48, 'C3108, 大坳門路, 布袋澳, 將軍澳, Sai Kung, 新界', 'Sai Kung', 22.2853631, 114.2837371),
-- (49, '北潭路, 北潭凹, Tai Po, 新界', 'Tai Po', 22.410138667289317, 114.32582873929607),
-- (50, '橫七古道, 下七木橋, North, 新界', 'North', 22.5094308, 114.2162006),
-- (51, '北潭路, 高塘下洋, Tai Po, 新界', 'Tai Po', 22.434828022026597, 114.32977350527922),
-- (52, '城門標本林, 城門林道－標本林段, Tsuen Wan, 新界', 'Tsuen Wan', 22.4054425, 114.1566057),
-- (53, '錦龍橋, 大涌橋路, 圓洲角, 多石村, Sha Tin, 新界', 'Sha Tin', 22.388052199999997, 114.20030737434249),
-- (54, '加多利灣泳灘, 青茵街, 三聖, 屯門南, 屯門, Tuen Mun, 新界', 'Tuen Mun', 22.3765703, 113.9815756926868),
-- (1, '大刀屻徑, 上村, Yuen Long, 新界', 'Yuen Long', 22.4460356, 114.1134684),
-- (2, 'C3308, 馬鞍山郊遊徑, 馬鞍山, Sha Tin, 新界', 'Sha Tin', 22.3854287, 114.2584528),
-- (3, '打鐵屻脊, 打鐵屻, 半山洲, Tai Po, 新界', 'Tai Po', 22.4205642, 114.1625769),
-- (4, '衞奕信徑第八段, 鳳園, 大埔, Tai Po, 新界', 'Tai Po', 22.4750973, 114.1691655),
-- (5, '龍璣閣 (D座）, 大磡道, 大磡, 竹園聯合村, 九龍, 黃大仙區', '黃大仙區', 22.34249165, 114.19964366213276),
-- (6, '屯門徑, 紅橋, 新墟村, 屯門, Tuen Mun, 新界', 'Tuen Mun', 22.400073981106427, 113.98457641778185),
-- (7, '麥理浩徑第10段, 屯門, Tuen Mun, 新界', 'Tuen Mun', 22.3952082, 114.0275313),
-- (8, '麥理浩夫人度假村, 榕北走廊, 榕樹澳, Tai Po, 新界', 'Tai Po', 22.407477649999997, 114.32193530867607),
-- (9, '冠發街, 樂安排, 小欖新村, 小欖, Tuen Mun, 新界', 'Tuen Mun', 22.368418761682747, 114.00756403551082),
-- (10, '藝滿至大刀刃, 打石湖石塘, Yuen Long, 新界', 'Yuen Long', 22.452745265085554, 114.1128361931511),
-- (11, '明愛小塘營, 荔枝莊地質步道, 荔枝莊, Tai Po, 新界', 'Tai Po', 22.4575925, 114.3046054),
-- (12, '鳳崗, 上水, North, 新界', 'North', 22.50898291838572, 114.09689010694804),
-- (13, 'Trailhead, 馬鞍山郊遊徑, 黃竹山新村, 西貢, Sai Kung, 新界', 'Sai Kung', 22.3856446, 114.260749),
-- (14, '亞公角山路, 亞公角, 大水坑村, Sha Tin, 新界', 'Sha Tin', 22.39504385, 114.21865173101756),
-- (15, '沙頭角公路－禾坑段, 上禾坑, 南涌, North, 新界', 'North', 22.524573984842185, 114.18849059188004),
-- (16, '秋楓樹, 鯽魚湖, Sai Kung, 新界', 'Sai Kung', 22.4064401, 114.3272454),
-- (17, 'Robin''s Nest Jeep Track, 塘肚山村, North, 新界', 'North', 22.536414, 114.18501),
-- (18, '踏石角渡頭, 龍輝街, 龍鼓灘, 沙埔崗, Tuen Mun, 新界', 'Tuen Mun', 22.3787612, 113.91665650590211),
-- (19, '東華三院馮黃鳳亭中學, 3-5, 瀝源街, 沙田市中心, 沙田, Sha Tin, 新界', 'Sha Tin', 22.3848561, 114.19288676379787),
-- (20, '梧桐河 River Indus (Ng Tung River), 虎地坳道 Fu Tei Au Road, 虎地坳 Fu Tei Au, 上水圍, North, 新界', 'North', 22.51521555, 114.1228615840009),
-- (21, '楊家村, 大棠村, Yuen Long, 新界', 'Yuen Long', 22.4101916, 114.0207629),
-- (22, '吉田大廈(第二及三期), 2, 新力街, 屯門工業區, 屯門舊墟, 青山村, Tuen Mun, 新界', 'Tuen Mun', 22.3935973, 113.96835512277664),
-- (23, '大網仔路, 鯽魚湖, Sai Kung, 新界', 'Sai Kung', 22.3959586, 114.3277031),
-- (24, '鹹田, Sai Kung, 新界', 'Sai Kung', 22.4115987, 114.3756965),
-- (25, '66, 多石村, 插桅杆村, 沙田, Sha Tin, 新界', 'Sha Tin', 22.377067599999997, 114.2035010467851),
-- (26, '大網仔路, 斬竹灣, 西貢, Sai Kung, 新界', 'Sai Kung', 22.39253545134506, 114.3091861224257),
-- (27, '大埔滘林道－乾坑段, 半山洲, Tai Po, 新界', 'Tai Po', 22.4208533, 114.1850693),
-- (28, '粉錦公路, 橫台山, 上輋, Yuen Long, 新界', 'Yuen Long', 22.457681293905175, 114.09961664565354),
-- (29, 'Firing Range, 比昂大道, 葡萄園, 新田, Yuen Long, 新界', 'Yuen Long', 22.4814073, 114.0670569),
-- (30, '馬灣漁民新村, 深井村, Tsuen Wan, 新界', 'Tsuen Wan', 22.3496903, 114.055865),
-- (31, 'Block A Tai Lung Veterinary Laboratory, 粉錦公路, 安圃村, 丙崗, North, 新界', 'North', 22.48228675, 114.11624474037839),
-- (32, '清快塘喜香農莊, 大欖隧道, 清快塘, 深井新村, Tsuen Wan, 新界', 'Tsuen Wan', 22.3814726, 114.0619584),
-- (33, '麒麟山食水缸, 水務道路 Water Supplied Trail, 長瀝, 蕉徑, North, 新界', 'North', 22.49137085, 114.09239423032383),
-- (34, '望發街, 望后石谷, 沙埔崗, Tuen Mun, 新界', 'Tuen Mun', 22.378773770656174, 113.94440686824534),
-- (35, '將軍澳, 貓頭鷹脊, 調景嶺, 將軍澳, Sai Kung, 新界', 'Sai Kung', 22.29235405, 114.25775726431843),
-- (36, '東風路, 五源村, 半山洲, Tai Po, 新界', 'Tai Po', 22.4472536, 114.1280976),
-- (37, '聯益漁村, 汀角, Tai Po, 新界', 'Tai Po', 22.4555385, 114.2149011),
-- (38, '福僑大樓, 143-145, 福華街, 元洲, 深水埗, 深水埗區, 九龍', '深水埗區', 22.331182300000002, 114.16251993890859),
-- (39, '西貢西灣路, 爛泥灣, Sai Kung, 新界', 'Sai Kung', 22.394915957879935, 114.33162061060031),
-- (40, '上山雞乙, 坪輋, North, 新界', 'North', 22.520092671875126, 114.15040773640852),
-- (41, '衛奕信徑第8段, 山頂花園, 上碗窰, 半山洲, Tai Po, 新界', 'Tai Po', 22.4363739, 114.1564946),
-- (42, '22, 百和路, 吳屋村, 上水, North, 新界', 'North', 22.49621925, 114.1274592),
-- (43, '清水灣半島, 駿昇街, 將軍澳工業邨, 大赤沙, 將軍澳, Sai Kung, 新界', 'Sai Kung', 22.2921291, 114.2807959),
-- (44, '粉嶺繞道, 安樂村工業區, 崇謙堂村, 龍躍頭, North, 新界', 'North', 22.506376790449327, 114.14554113657121),
-- (45, '十八鄉, 洪水橋, Yuen Long, 新界', 'Yuen Long', 22.41124571116594, 114.04697540394162),
-- (46, '深涌, Tai Po, 新界', 'Tai Po', 22.4411059, 114.288209),
-- (47, '大藍湖路, 牛寮, 井欄樹, Sai Kung, 新界', 'Sai Kung', 22.3560987, 114.2346486);

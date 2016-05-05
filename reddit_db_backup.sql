-- MySQL dump 10.13  Distrib 5.5.47, for debian-linux-gnu (x86_64)
--
-- Host: 0.0.0.0    Database: reddit
-- ------------------------------------------------------
-- Server version	5.5.47-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `text` varchar(10000) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `parentId` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `postId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `postId` (`postId`),
  KEY `parentId` (`parentId`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`),
  CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`parentId`) REFERENCES `comments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (2,'CATS ARE A LIE',6,NULL,'2016-04-29 15:13:01','2016-04-29 15:13:01',6),(3,'THANKS OBAMA',6,2,'2016-04-29 15:14:10','2016-04-29 15:14:10',6),(4,'The bacon narwhals at midnight XDD',1,3,'2016-04-29 15:28:01','2016-04-29 15:28:01',6),(5,'Second comment on CAT TRUTH',1,2,'2016-04-29 16:03:56','2016-04-29 16:03:56',6),(7,'Second comment on parentId 3',1,3,'2016-04-29 18:44:30','2016-04-29 18:44:30',6),(8,'Another top level comment',1,NULL,'2016-04-29 19:56:19','2016-04-29 19:56:19',6),(9,'Another comment',7,8,'0000-00-00 00:00:00','2016-04-29 22:53:37',6),(10,'Yet another top level comment',7,NULL,'0000-00-00 00:00:00','2016-04-29 22:59:08',6);
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(300) DEFAULT NULL,
  `url` varchar(2000) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `subredditId` int(11) DEFAULT NULL,
  `selftext` varchar(2000) DEFAULT NULL,
  `upvotes` int(11) DEFAULT '0',
  `downvotes` int(11) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `subredditId` (`subredditId`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `posts_ibfk_2` FOREIGN KEY (`subredditId`) REFERENCES `subreddits` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,'FIRST POST TITLE','https://www.reddit.com',5,'2016-04-28 19:48:00','2016-05-04 14:44:00',NULL,NULL,10,0),(2,'hi reddit!','OTHER POST',6,'2016-04-28 19:50:35','2016-04-28 19:56:53',NULL,NULL,0,0),(3,'another post!','https://www.decodemtl.com',7,'2016-04-28 20:12:55','2016-04-28 20:12:55',NULL,NULL,0,0),(4,'Another post from user 7','https://www.posts.com',7,'2016-04-28 21:42:18','2016-04-28 21:42:18',NULL,NULL,0,0),(5,'Yet another post from user 7','https://www.posts.com',7,'2016-04-28 21:42:30','2016-04-28 21:42:30',NULL,NULL,0,0),(6,'Cat bonanza!','https://www.placekitten.com',7,'2016-04-28 23:22:27','2016-05-04 14:44:41',3,NULL,10,8),(7,'Cat bonanza!','https://www.placekitten.com',7,'2016-04-28 23:22:53','2016-04-28 23:22:53',3,NULL,0,0),(8,'Cat bonanza!','https://www.placekitten.com',7,'2016-04-28 23:23:04','2016-04-28 23:23:04',3,NULL,0,0),(9,'Cat bonanza!','https://www.placekitten.com',7,'2016-04-28 23:23:08','2016-04-28 23:23:08',3,NULL,0,0),(10,'ANOTHER POST','https://www.placekitten.com',7,'0000-00-00 00:00:00','2016-05-04 14:47:10',3,NULL,9,30),(11,'lol i posted placekitten again','https://www.placekitten.com',7,'0000-00-00 00:00:00','2016-05-04 14:46:29',3,NULL,2,0),(12,'YET ANOTHER CAT POST!!!!!!!','https://www.placekitten.com',1,'2016-05-03 19:55:03','2016-05-03 19:55:03',3,NULL,0,0),(13,'YET ANOTHER CAT POST!!!!!!!','https://www.placekitten.com',1,'2016-05-03 19:56:43','2016-05-04 14:45:34',3,NULL,4,0),(14,'YET ANOTHER CAT POST!!!!!!!','https://www.placekitten.com',1,'2016-05-03 19:56:48','2016-05-03 19:56:48',3,NULL,0,0),(15,'YET ANOTHER CAT POST!!!!!!!','https://www.placekitten.com',1,'2016-05-03 19:57:34','2016-05-03 19:57:34',3,NULL,0,0),(16,'YET ANOTHER CAT POST!!!!!!!','https://www.placekitten.com',1,'2016-05-03 20:04:05','2016-05-03 20:04:05',3,NULL,0,0),(17,'YET ANOTHER CAT POST!!!!!!!','https://www.placekitten.com',1,'2016-05-03 20:04:07','2016-05-03 20:04:07',3,NULL,0,0),(18,'YET ANOTHER CAT POST!!!!!!!','https://www.placekitten.com',1,'2016-05-03 20:04:29','2016-05-03 20:04:29',3,NULL,0,0),(19,'YET ANOTHER CAT POST!!!!!!!','https://www.placekitten.com',1,'2016-05-03 20:04:30','2016-05-03 20:04:30',3,NULL,0,0),(20,'YET ANOTHER CAT POST!!!!!!!','https://www.placekitten.com',1,'2016-05-03 20:04:34','2016-05-03 20:04:34',3,NULL,0,0),(21,'YET ANOTHER CAT POST!!!!!!!','https://www.placekitten.com',1,'2016-05-03 20:04:40','2016-05-03 20:04:40',3,NULL,0,0),(22,'YET ANOTHER CAT POST!!!!!!!','https://www.placekitten.com',1,'2016-05-03 20:04:43','2016-05-03 20:04:43',3,NULL,0,0),(23,'YET ANOTHER CAT POST!!!!!!!','https://www.placekitten.com',1,'2016-05-03 20:04:51','2016-05-03 20:04:51',3,NULL,0,0),(24,'YET ANOTHER CAT POST!!!!!!!','https://www.placekitten.com',1,'2016-05-03 20:04:57','2016-05-04 14:45:20',3,NULL,12,0),(25,'Cruz leaves race','https://www.placekitten.com',12,'2016-05-04 15:22:24','2016-05-04 16:14:43',3,NULL,100,0),(26,'The Silly Post','http://www.dontdateaplayer.com/',17,'2016-05-04 21:20:18','2016-05-04 21:20:18',NULL,NULL,0,0),(27,'The Silly Post','http://www.dontdateaplayer.com/',17,'2016-05-04 21:21:50','2016-05-04 21:21:50',3,NULL,0,0),(28,'The Silly Post','http://www.dontdateaplayer.com/',17,'2016-05-04 21:23:43','2016-05-04 21:23:43',3,NULL,0,0),(29,'','',17,'2016-05-04 22:14:42','2016-05-04 22:14:42',3,NULL,0,0),(30,'I AM THE DONALD','www.test.com',17,'2016-05-05 15:57:34','2016-05-05 15:57:34',3,NULL,0,0),(31,'THE WHOLE MOB','ASASDASD',17,'2016-05-05 16:30:55','2016-05-05 16:30:55',3,'LOOK AT THIS FUCKING SELF TEXT',0,0),(32,'ass MOB','ASASDASD',17,'2016-05-05 16:31:13','2016-05-05 16:31:13',3,NULL,0,0),(33,'THE DON','theDON',18,'2016-05-05 17:02:38','2016-05-05 17:02:38',3,'THE DON',0,0),(34,'TEFLON DON','TEFLON',18,'2016-05-05 17:46:09','2016-05-05 17:46:09',3,'TEFLON',0,0),(35,'Mastermind','MasterMindProductions',18,'2016-05-05 17:47:17','2016-05-05 17:47:17',3,'THE BOSS',0,0),(36,'NO, I AM THE DONALD','NowSheWantAPhoto',18,'2016-05-05 17:48:12','2016-05-05 17:48:12',3,'U Already Know Tho',0,0);
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `userId` int(11) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `userId` (`userId`),
  CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES (17,'5e3q6q2v182u6i105l3b1j40251y6l454j3a1v285we1j1h6r1f2e382x2y3i4b3z3l5a5rb1gd1tf292p6v66c116o2f44381t2s4clk15395oa4g18141w2d1r6k2w314v4p3p673z2b3d4o273h67a2w3s2g66v5d5n673m4v4g4pg323916j316r','2016-05-04 19:29:31'),(17,'544j41i5cr2h2v306b4cs1k46x2gz4k2j6if5y5g6k4j13174e185r396t724a4o6de395c6k6p312y5a3o2ncmd4s5t6v2p424a4h2o25634r3d1q2j1v5o66v6d5p6g4fa5i12d3a5c3b1y2l2zh5q43336g311i6a662k1z70475f5q1db5tv','2016-05-04 20:02:28'),(17,'x24165c6ma2r4i3i4u1b2721y3m2s423z2275g321i5t4s36226a614j21661mt681u6y1t413f6qj523p326i51394b4u5m185z372e1h182o4p58493i336m4j1y61n5e2t5d3k2s2k4r5q4g5e421z202n5f2b5h1p4q5x27616f1270464j2w72r','2016-05-04 20:02:35'),(17,'5m4h2d5s254u3f2g5r26k3f2l4pg6se4u2w5y4t6v2x3f363l4635e5w6253166e1u6e6b673a93ae5i19212z2t471c3r6l20702k3o4k1r5q235sy2z452g3n16da4124a69gu5j435t5m4e3a3z6f154515x4w4b35n2u1g2h1s265h3y694ez','2016-05-04 20:51:44'),(17,'4i3h2p5m613g6h2c2b4v5q3a1p5282v1s635z1l6z484jcn1d372g2i4s1tg3l446r5470585w2u6lj5y5v53fp32s4s646430rr6v2i2z2b3cb573u2v6s2ep625n66c512o6223124d2335704u5y334b23y5u5vlb513f2h6q365364u2v','2016-05-04 20:52:42'),(17,'5d302q2v1b1k1r63w3m4x2y2v6v6y6cg6gl6k303c5o1kn1f2c3t4x5y226g6t6l472g6g3j5m1h716m5t6s733i145s3t94w4pa6l4u696c1p3k6d5b2v3h3w4e5o5v72166x4t1e2s6k1n1a2e6l571f3d1v1j2nn4r713p3j521044363t1v2t2t9y5','2016-05-04 20:53:58'),(17,'394l3h53w2u2w6b3s334c134781i4d3w3g3h592r2g2zp48576s292z5ic5d1e3157340315a5o60y2i6e15z4k25455p3a1lh375c225s6r1kj4c4h652r6u533919152e232z2w6m606r4u4l1x3tp595t666958x6m4z2h47251q6s9a5v61r5b','2016-05-04 20:54:39'),(17,'6k235l6t2p1l1m6r1v62b1n13o6964d5p2q5e491p253w5g5l2244252t53w5l50725e352265b2l446v5w2c1y5i5te84m293h41633gh3do6ho5vh1p3d3j59491r583w2w5m3h6u282s4h45ku1a4x433h6w492c3u3u3q2p5l1516543n494h','2016-05-04 20:55:27'),(17,'6p4r6a52532b5m4170586l1r3k483b1v2d4ri6o621b6rk6m6qt6i595x2oj2t53m454441713p3jv2l394h3o693j1h124i716x6c5t4c6g4o1z172e244x2l2f563ndpd1e1c4ru31176h6k1y3c5q1c2k4f1p6at94p4q4n2a5t3l3757d226i6z','2016-05-04 21:02:40'),(17,'713l51321z2616ts6u6k3y65d2w70275w39425h162k4q382y364so3u5w5i18276i3z30d4651324f1436w3y5v1h301w2q4s6p1n1j6k2v452v3696c2xk1o4v2z5s111p66345ea703q5jo65235p5i3316v1z376i1ql1f2f233v442fr736p','2016-05-04 21:13:13'),(17,'19f443j4b1c491q5qk1z2w5t3s6u6m6l231a4x553s2a6q6kc2b3twi3z4h58k2p2n4y22442a2c6q4j3a1k265q6v4a2f334e6a4612272h40672q2ei4a224x24n2ff185j1ai2o486pk28w73g613q282p4k594j2y1h5a1r1e2k693a256b624g','2016-05-05 15:51:57'),(18,'4q423h56g5b2h3b573nk4930w681182u606184r5t3y6ew3311256u401r2j1f506m60231f673r391y3v2o453a1a5a4q524m3mu433w3b5r5c1j6h1s2362433y3e3n4k1g6h362c4v676s1l2557163n3g5v4b2t6a265at3r242t1514a6243591o22','2016-05-05 16:17:05'),(17,'393w4h6f313b5o3o10373l4y4g3f2l6nf274v45b651a2c3q0485i6a4195d5k2s113x1q2a5j4b06l265b3u1r30563x6j61p3cw50422v435p5x3m3w2d4c2w3n6w514y5u4z223ju104e22q5h3r3l10362y1o29565r6w1w4t121m6d305v5g4b3e5o','2016-05-05 16:20:05'),(18,'5q1y2m5w465r5a2y475y6726i2z134o4sb5a156f5w572h5s41l1g166f646d4j5t4o37f2g45x6x6p5t72n4i2z404f1u375r6yd4s4u5g3r3j6m67v5951181o181m1t1rh3u2f234f2b66233l3e3h4q3253o2j5x535t4e2j1tb2e3g4y5f113n','2016-05-05 16:23:45'),(17,'3y4k4m714l5w5f2h46614j1a3v6o3g2m6x5s5s3f2e1z2v334t2j3368m4w6r5z22d30t3m5w6h5t3j5b3x1m1k422c4u2ye2n255t2m732gp4d3r1y282r5l354j643p5i1f3w316z3p13y1s58151i1qb4f502n6763l3ww3652655j5g3n315q67g10','2016-05-05 18:16:51'),(18,'644o6v1f3r4i4ct2f1lf6c5395212y162r215p5w302s613sq2s2m23a2pb4u2m1g5730422o3v6h6b4h2o542h693h42g4x3y34646t653p6bb3y4u5k51315q72vr6kdi144i6v3t393x1c5k10k4yp5w272h20575y6ps16q2f3r4kda3s','2016-05-05 18:23:31'),(17,'3h72lb5hxx2t422a36111h1j3x581s3o1886j1j6r4q5e3g6m351m3945y536y1w4d1w2f6e455a4d33473b1n5t585o3lu4j2x1c43k2q53j6m324j1x1f71s43v664a1325203q316238163u4d4p364n6f2k6o69s1uc26z41134f223l4d405w','2016-05-05 18:37:02');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subreddits`
--

DROP TABLE IF EXISTS `subreddits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subreddits` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subreddits`
--

LOCK TABLES `subreddits` WRITE;
/*!40000 ALTER TABLE `subreddits` DISABLE KEYS */;
INSERT INTO `subreddits` VALUES (1,'AdviceAnimals','Puppies.','2016-04-28 22:51:47','2016-04-28 22:51:47'),(3,'Cats','Cats!','2016-04-28 22:54:21','2016-04-28 22:54:21'),(4,'Homepage','Clone Homepage','0000-00-00 00:00:00','2016-05-03 18:53:00');
/*!40000 ALTER TABLE `subreddits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(60) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `isAdmin` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'hello23','$2a$10$/eqmffdcce0MD73AqFRdnOqPJoDrFVpil604pFYaAtI.ZIjR9HRsa','2016-04-28 18:48:41','2016-04-28 18:48:41',0),(5,'newuser','$2a$10$ZDOwddUmQ40KKl0Zu7vC.eCZbiK4G3DXk9VCGqo.CLM2jcVikuRn2','2016-04-28 19:48:00','2016-04-28 19:48:00',0),(6,'anothergoober','$2a$10$T6jQ5m6xls.7ory5ixeJyOr6JQkYdwKV1Ey1lKy1OCfkTyqWLn1iq','2016-04-28 19:50:35','2016-04-28 19:50:35',0),(7,'anotheruser','$2a$10$6d8F9Rd43VsXRi9vdBSdN.YklUK8KHTO2oldkpd6TmVyYRLuO3LX2','2016-04-28 20:12:55','2016-04-28 20:12:55',0),(8,'spez','$2a$10$D4dz5OAMeT.vvSr..xrIgu5DncG6pUDggXELITLTqo0am.mFm99/a','2016-05-03 21:20:27','2016-05-03 21:20:27',0),(11,'anotherusersss','$2a$10$SyaayOgi67rrce5bp.Yer.1NHJkqGNRPsICDjMwJC/sAOJwVj.gqq','2016-05-03 21:22:32','2016-05-03 21:22:32',0),(12,'anotherusersdsdsss','$2a$10$m8FiWFcTIVpKSzFr/3.ap.JHNX6BiSmCvbhmBkiwnkj/elP6Q.dAC','2016-05-03 21:23:12','2016-05-03 21:23:12',0),(13,'onemillionthuser','$2a$10$bIs/SxMwM4sf25Jrsq./OeGgYjh.JZg9tsSY06API3bkLrxrrXESC','2016-05-03 21:23:32','2016-05-03 21:23:32',0),(14,'another_user','$2a$10$QExpC0jzuJCuiOVM9xHIcOTKLrNq63bmu2TcCwOC/Lc7WyjUGVEUC','2016-05-03 21:38:22','2016-05-03 21:38:22',0),(15,'oohaa','$2a$10$PQ8RcquJNzjRsRtjWEKChuEMZgG12IR4u1yihIfi3s1ebHOC5ztqu','2016-05-03 21:40:19','2016-05-03 21:40:19',0),(16,'LOOKATTHISFUCKIN','$2a$10$Nmj6D0LE1Ptq6MmfW0pa1ueE1bGXasfUD90VRacZLdJnnIOG6bsOG','2016-05-03 22:14:02','2016-05-03 22:14:02',0),(17,'The_Donald','$2a$10$REeOX72eB3QKWRKn7WZ6z.Z5JV./XAtEwWLK201D381oEXCjnXddy','2016-05-04 18:20:43','2016-05-05 17:58:16',1),(18,'TeflonDon','$2a$10$vuPiCPicY7aPquczVPPZO./.mxwHA3eLOzeGVKUO.uN6EMsPXOJmG','2016-05-05 16:16:29','2016-05-05 16:16:29',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-05-05 20:24:47

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
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `subredditId` (`subredditId`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `posts_ibfk_2` FOREIGN KEY (`subredditId`) REFERENCES `subreddits` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,'FIRST POST TITLE','https://www.reddit.com',5,'2016-04-28 19:48:00','2016-04-28 20:01:28',NULL),(2,'hi reddit!','OTHER POST',6,'2016-04-28 19:50:35','2016-04-28 19:56:53',NULL),(3,'another post!','https://www.decodemtl.com',7,'2016-04-28 20:12:55','2016-04-28 20:12:55',NULL),(4,'Another post from user 7','https://www.posts.com',7,'2016-04-28 21:42:18','2016-04-28 21:42:18',NULL),(5,'Yet another post from user 7','https://www.posts.com',7,'2016-04-28 21:42:30','2016-04-28 21:42:30',NULL),(6,'Cat bonanza!','https://www.placekitten.com',7,'2016-04-28 23:22:27','2016-04-28 23:22:27',3),(7,'Cat bonanza!','https://www.placekitten.com',7,'2016-04-28 23:22:53','2016-04-28 23:22:53',3),(8,'Cat bonanza!','https://www.placekitten.com',7,'2016-04-28 23:23:04','2016-04-28 23:23:04',3),(9,'Cat bonanza!','https://www.placekitten.com',7,'2016-04-28 23:23:08','2016-04-28 23:23:08',3),(10,'ANOTHER POST','https://www.placekitten.com',7,'0000-00-00 00:00:00','2016-05-02 19:45:12',3),(11,'lol i posted placekitten again','https://www.placekitten.com',7,'0000-00-00 00:00:00','2016-05-02 19:45:38',3);
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subreddits`
--

LOCK TABLES `subreddits` WRITE;
/*!40000 ALTER TABLE `subreddits` DISABLE KEYS */;
INSERT INTO `subreddits` VALUES (1,'AdviceAnimals','Puppies.','2016-04-28 22:51:47','2016-04-28 22:51:47'),(3,'Cats','Cats!','2016-04-28 22:54:21','2016-04-28 22:54:21');
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'hello23','$2a$10$/eqmffdcce0MD73AqFRdnOqPJoDrFVpil604pFYaAtI.ZIjR9HRsa','2016-04-28 18:48:41','2016-04-28 18:48:41'),(5,'newuser','$2a$10$ZDOwddUmQ40KKl0Zu7vC.eCZbiK4G3DXk9VCGqo.CLM2jcVikuRn2','2016-04-28 19:48:00','2016-04-28 19:48:00'),(6,'anothergoober','$2a$10$T6jQ5m6xls.7ory5ixeJyOr6JQkYdwKV1Ey1lKy1OCfkTyqWLn1iq','2016-04-28 19:50:35','2016-04-28 19:50:35'),(7,'anotheruser','$2a$10$6d8F9Rd43VsXRi9vdBSdN.YklUK8KHTO2oldkpd6TmVyYRLuO3LX2','2016-04-28 20:12:55','2016-04-28 20:12:55');
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

-- Dump completed on 2016-05-02 19:54:02

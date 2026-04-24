-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: vacations_db
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `userId` int NOT NULL,
  `vacationId` int NOT NULL,
  PRIMARY KEY (`userId`,`vacationId`),
  KEY `vacationId` (`vacationId`),
  CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE,
  CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`vacationId`) REFERENCES `vacations` (`vacationId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (7,21),(6,22),(7,22),(6,23),(7,23),(7,24);
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  PRIMARY KEY (`userId`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Oren','Meshulam','Oren9432@gmail.com','$2b$10$8E3ORE47/s1IaFtAVUTrT.A0G.yO9Xb978kN4wsWHpTSlpIElzOEm','admin'),(6,'sas','wer','Oren94323@gmail.com','$2b$10$F81kdxCgIf0dNtVn7CS7FOpYMUI3FwuQ/cZjtvfEug5FFY22vzeYa','user'),(7,'dad','aba','Oren943234@gmail.com','$2b$10$ur/MIoR3epu8ikWH080uh.fg6V816hEGvpWetGFbB92d5zWqLnAT6','user'),(8,'oren','ssss','Oren94324@gmail.com','$2b$10$QQqGcsj9SvuEJpE9VVjgZetDd0p/B5btnEd5BTPgu1PFW5FMClYe.','user');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vacations`
--

DROP TABLE IF EXISTS `vacations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vacations` (
  `vacationId` int NOT NULL AUTO_INCREMENT,
  `destination` varchar(100) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `imageName` varchar(255) NOT NULL,
  PRIMARY KEY (`vacationId`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vacations`
--

LOCK TABLES `vacations` WRITE;
/*!40000 ALTER TABLE `vacations` DISABLE KEYS */;
INSERT INTO `vacations` VALUES (21,'Paris','A romantic spring vacation in Paris with museums, cafes, the Eiffel Tower, and Seine river walks.','2026-04-10','2026-04-22',1499.00,'paris.jpg'),(22,'Rome','A classic Italian vacation including the Colosseum, Vatican City, historic streets, and authentic cuisine.','2026-04-15','2026-04-26',1190.00,'rome.jpg'),(23,'Barcelona','A colorful city break with beaches, Gaudi architecture, local markets, and Mediterranean nightlife.','2026-05-12','2026-05-19',1320.00,'barcelona.jpg'),(24,'Amsterdam','A relaxed canal-side trip with museums, bicycles, charming neighborhoods, and flower markets.','2026-05-20','2026-05-27',1450.00,'amsterdam.jpg'),(25,'Prague','A cultural vacation in Prague with castles, old town squares, bridges, and traditional Czech food.','2026-06-03','2026-06-10',1180.00,'prague.jpg'),(26,'Vienna','An elegant European vacation with palaces, classical music, coffee houses, and historic city centers.','2026-06-14','2026-06-21',1560.00,'vienna.jpg'),(27,'Athens','A historical summer trip featuring ancient ruins, Greek cuisine, and nearby coastal views.','2026-06-28','2026-07-05',1275.00,'athens.jpg'),(28,'Santorini','A scenic island vacation with white villages, sea views, sunsets, and relaxing beaches.','2026-07-10','2026-07-17',1890.00,'santorini.jpg'),(29,'Dubai','A luxury city vacation with modern skyscrapers, desert tours, shopping malls, and beaches.','2026-07-22','2026-07-29',2190.00,'dubai.jpg'),(30,'New York','An exciting urban vacation with Broadway, Central Park, Times Square, museums, and iconic landmarks.','2026-08-05','2026-08-13',2480.00,'new york.jpg'),(31,'Tokyo','A dynamic vacation mixing modern technology, traditional temples, shopping districts, and Japanese cuisine.','2026-08-20','2026-08-30',2890.00,'tokyo.jpg'),(32,'Bangkok','A vibrant Southeast Asian vacation with street food, temples, river markets, and nightlife.','2026-09-08','2026-09-16',1540.00,'bangkok.jpg'),(34,'Moscow','Discover Moscow with its famous Red Square, the Kremlin, impressive architecture, rich history, and unique cultural atmosphere. Enjoy museums, local food, shopping streets, and memorable city views.','2026-06-17','2026-06-23',3300.00,'moscow.jpg'),(35,'Istanbul','Enjoy an amazing vacation in Istanbul with beautiful mosques, lively markets, delicious food, Bosphorus views, shopping streets, and a unique mix of European and Asian culture.','2026-07-08','2026-07-12',1700.00,'istanbul.jpg'),(36,'Berlin','Visit Berlin and explore its rich history, famous landmarks, museums, modern city life, great shopping areas, cultural attractions, and vibrant nightlife.','2026-10-15','2026-10-21',3500.00,'berlin.jpg'),(37,'Beijing','Discover Beijing with its impressive palaces, historic sites, traditional culture, local markets, delicious cuisine, and unforgettable visits to famous landmarks such as the Forbidden City and the Great Wall.','2026-08-18','2026-08-27',2600.00,'beijing.jpg');
/*!40000 ALTER TABLE `vacations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-24 19:40:37

-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: doana
-- ------------------------------------------------------
-- Server version	8.4.6

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
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `material` varchar(255) NOT NULL,
  `description` text,
  `color` varchar(255) NOT NULL,
  `stone_type` varchar(255) DEFAULT NULL,
  `stone_shape` varchar(255) DEFAULT NULL,
  `weight` decimal(10,0) DEFAULT NULL,
  `category_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `discount_price` decimal(10,2) DEFAULT NULL,
  `stock_quantity` int NOT NULL DEFAULT '0',
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `created_at` varchar(255) NOT NULL,
  `updated_at` varchar(255) NOT NULL,
  PRIMARY KEY (`product_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES ('30a88187-4fc0-4755-97ea-edea32afb535','nhẫn vàng trắng','vang','nhẫn siêu  với màu trắng quý phái','trang',NULL,NULL,NULL,'3c40c725-8858-487e-9c4f-bc0fff68273d',31000000.00,220000.00,3,'active','2025-10-23 11:02:56','2025-12-28 14:48:37'),('41f1426c-2b60-4ac7-b99c-ccdea67f9d6c','Vòng tay vàng siêu vàng','vang','vòng tay màu vàng siêu đẹp chỉ có ở Tierra','vang',NULL,NULL,NULL,'4c032dd3-1384-46e4-85f6-c29bbe303605',5000000.00,120000.00,61,'active','2025-11-13 14:12:21','2025-12-28 15:16:23'),('51770a7c-fcc6-4bae-b36e-e93592690e7c','nhẫn cưới vàng 18k','vang','làm bằng vàng nguyên ','trang',NULL,NULL,NULL,'3c40c725-8858-487e-9c4f-bc0fff68273d',20790000.00,1000000.00,11,'active','2025-10-20 13:14:11','2025-12-28 14:51:41'),('581346d3-30c3-4905-b968-8c27aacbe8c0','Nhẫn kim cương BNC123','kim cuong','làm bằng kim cương nguyên ','trang',NULL,NULL,NULL,'3c40c725-8858-487e-9c4f-bc0fff68273d',3000000.00,100000.00,40,'active','2025-10-23 13:42:19','2025-12-28 14:53:48'),('6457d39d-0933-477b-bdf7-f11f1ff83868','nhẫn vàng BNC3423','vang','nhẫn vàng ','vang hong',NULL,NULL,NULL,'3c40c725-8858-487e-9c4f-bc0fff68273d',22000000.00,2000000.00,19,'active','2025-10-23 10:56:18','2025-12-28 14:55:45'),('65dbbaf9-9d90-49ca-9575-b7285d676914','nhẫn đính kim cương BNC35435','kim cuong','nhẫn siêu đẹp với kim ','trang',NULL,NULL,NULL,'3c40c725-8858-487e-9c4f-bc0fff68273d',58000000.00,1500000.00,80,'active','2025-10-23 11:07:00','2025-12-28 14:57:24'),('66e60e9b-ee50-49e9-86f2-55b0b499ff95','bông tai kim cương','kim cuong','bông tai bằng kim cương','trang',NULL,NULL,NULL,'e0f055ec-3ce2-416b-8151-920a20802c0b',7500000.00,5000000.00,51,'active','2025-10-20 21:06:31','2025-12-28 15:13:58'),('6a2589c8-8f96-4c82-9445-34a71da3161f','dây chuyền bông hoa','kim cuong','dây chuyền kim cương bông hoa','trang',NULL,NULL,NULL,'00382bcd-1a1c-474b-8b81-e54313502ab5',13000000.00,5000000.00,52,'active','2025-10-23 11:11:01','2025-12-28 15:15:31'),('7887b0cc-faca-4f28-85ee-d0b813c19934','vòng tay kim cương','kim cuong','vòng tay kim cươngvòng tay kim cươngvòng tay kim cươngvòng tay kim cươngvòng tay kim cươngvòng tay kim cươngvòng tay kim cương','trang','đá quý',' vuông',3,'4c032dd3-1384-46e4-85f6-c29bbe303605',30000.00,2500.00,100,'active','2026-01-07 10:58:39','2026-01-07 10:58:39'),('7c72d938-94a1-4567-93f2-a486654353cc','Nhẫn kim cương hồng','kim cuong','đây là 1 trong các loại kim cương mắc nhất','vang','hoa cương','tròn',346,'3c40c725-8858-487e-9c4f-bc0fff68273d',1000000.00,100000.00,100,'active','2025-12-01 22:51:36','2025-12-28 14:58:41'),('a64b4565-ed75-4654-af69-19cfcaf48514','bông tai trái tim','kim cuong','bông tai có đính kim cương','trang',NULL,NULL,NULL,'e0f055ec-3ce2-416b-8151-920a20802c0b',12000000.00,5000000.00,51,'active','2025-10-23 11:57:44','2025-12-28 15:14:24'),('bcaec108-25d1-4c1f-a6ef-e84eec3dd243','Nhẫn cưới vàng BNC231','vang','nhẫn cưới vàng cong đẹp','vang',NULL,NULL,NULL,'3c40c725-8858-487e-9c4f-bc0fff68273d',11000000.00,100000.00,100,'active','2025-10-23 11:16:00','2025-12-28 15:02:00'),('bda616ae-9652-44ab-bcce-2065ab016c3d','Nhẫn vàng BNC444','vang','nhẫn vàng quá đẹp','vang','hoa cương','tròn',1,'3c40c725-8858-487e-9c4f-bc0fff68273d',1000000.00,100000.00,100,'active','2025-12-01 22:48:55','2025-12-28 15:02:47'),('d918cbe8-83ac-45fd-b4e3-dcc6f554df16','nhẫn vàng BNC546','vang','làm bằng vàng nguyên chất','vang',NULL,NULL,NULL,'3c40c725-8858-487e-9c4f-bc0fff68273d',3000000.00,100000.00,100,'active','2025-10-19 13:31:14','2025-12-28 15:04:22');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-26  8:52:34

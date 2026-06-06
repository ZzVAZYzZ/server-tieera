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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('04248778-75ef-4ebc-a708-43f2696af8cf',NULL,'User','$2b$10$sAchDtjSfzuzs49rGxhZKejzrW75.5DAmThdC1b8yCI6FytdYDdXK',NULL,'duong@gmail.com','','','user','2025-12-11 06:50:28'),('0b41bc6e-410b-4d70-8a67-0dcf529f81d0','114136918746407739982','Lợi Trịnh Hữu',NULL,'https://res.cloudinary.com/dihqq66r4/image/upload/v1767756284/tierra/avatars/pa4gqohgs37tcsudpwlk.webp','loi.th06409@sinhvien.hoasen.edu.vn','123','abc','user','2025-10-30 06:36:48'),('1decf6b7-43c4-4e4f-b3d4-fdff272bc6a9',NULL,'User','$2b$10$x.iAR70aLIJUeZ173wSuD.d9BZYr5cdQi0br7fJLxy7bwHpxIWVQK',NULL,'hai@gmail.com','','','user','2025-12-11 06:50:07'),('3093df47-292a-4090-94a6-8991f6224df4','105035057092658968324','Hải Lê Đăng Nguyễn Minh',NULL,'https://lh3.googleusercontent.com/a/ACg8ocKndXHIt4PetblCZuNm0jsFPBjduDgpht15xqQ5qHTPTCxuvQ=s96-c','vazy454@gmail.com',NULL,NULL,'user','2025-10-19 06:21:08'),('3291a54e-114b-4fdd-869e-85cb6ebe6459',NULL,'Loi','$2b$10$dhqaJ0ZE0j8ED52wP81vOu.p97/7aZdcZUVqbjZme48ItKkg.9fla','https://res.cloudinary.com/dihqq66r4/image/upload/v1767684788/tierra/avatars/bw56gmq4jb5zhn3lb5yz.png','loi@gmail.com','1234567891','123 abc','user','2025-11-02 15:22:28'),('399810b5-85e0-465d-9cd8-5dc79fc87bfa',NULL,'admin','$2b$10$VbwUozXC5Iot6CkMPPDReuH0K/YU9bG1Cj7gRIaUVhdcwYFF2nkMe',NULL,'admin@gmail.com',NULL,NULL,'admin','2025-10-19 06:23:04'),('cd2e367c-1929-453e-b393-4149f4e02a28',NULL,'User','$2b$10$dlbHPedT98aDYF78j/e0DO.RUdZog0S40/Iy0h/8EgCgmWEdjRGNK',NULL,'toi@gmail.com','','','user','2025-10-30 06:32:08'),('d5f2b7ef-7d24-4eb7-b961-9efcf9293714','104638223208606421002','loi trinh',NULL,'https://lh3.googleusercontent.com/a/ACg8ocJBH7YS6TVoyCmTs1R8ZhuyB7RZL66HNhK0Z3UMa89p2Pt1wg=s96-c','trinhhuuloi098@gmail.com',NULL,NULL,'user','2025-10-30 10:08:12'),('dc99f267-f053-4bd7-bc58-e4f1d1e9d141','118307981952364221713','hải lê','$2b$10$EDtHOmw9nsDjFlGdSoUAO.R9YlgywoTF87YeiXgR6tj0p2uwgVeMC','https://lh3.googleusercontent.com/a/ACg8ocK0p9rmjyqyQqB1PLmAsEoBKYky3nVfgTtZpjjtcyRSTZFX4Q=s96-c','haiminh454@yahoo.com',NULL,NULL,'user','2025-10-19 06:21:14');
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

-- Dump completed on 2026-01-26  8:52:34

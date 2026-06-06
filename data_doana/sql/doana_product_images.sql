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
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `image_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `product_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `is_main` tinyint(1) NOT NULL DEFAULT '0',
  `image_url` varchar(255) NOT NULL,
  PRIMARY KEY (`image_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES ('03d2379d-9b6f-42ba-aa05-f1ba0c787e95','7c72d938-94a1-4567-93f2-a486654353cc',1,'https://res.cloudinary.com/dihqq66r4/image/upload/v1766908723/doana/product_images/wnxhilf29umad4xdrvmb.png'),('15417f63-6bcd-4a9c-b6ff-57e5d934b0b1','7887b0cc-faca-4f28-85ee-d0b813c19934',0,'https://res.cloudinary.com/dihqq66r4/image/upload/v1767758320/doana/product_images/grnptjz7cwzhjo2wii68.webp'),('16e3719b-1c31-42ad-a466-44a7fbf4d96b','65dbbaf9-9d90-49ca-9575-b7285d676914',0,'https://res.cloudinary.com/dihqq66r4/image/upload/v1766908648/doana/product_images/ng5hdhmhhz704ngyhx8i.webp'),('1cddcd77-09e9-4b22-b1a4-2159ac4b0c2f','30a88187-4fc0-4755-97ea-edea32afb535',0,'https://res.cloudinary.com/dihqq66r4/image/upload/v1766908121/doana/product_images/dk6diklzddpnfkdfty7l.webp'),('1de56207-44a7-40c7-91e5-e170a5266473','51770a7c-fcc6-4bae-b36e-e93592690e7c',0,'https://res.cloudinary.com/dihqq66r4/image/upload/v1766908307/doana/product_images/swrfy3babpa837zsc2l6.webp'),('21ab0d11-2d80-4ec3-9154-fc346f7fb858','6457d39d-0933-477b-bdf7-f11f1ff83868',0,'https://res.cloudinary.com/dihqq66r4/image/upload/v1766908548/doana/product_images/ph7banbdufhxgj7qclqm.webp'),('2e84d643-0aed-4a6f-8b71-16162ee8dd89','66e60e9b-ee50-49e9-86f2-55b0b499ff95',1,'https://res.cloudinary.com/dihqq66r4/image/upload/v1766909640/doana/product_images/fn4x8loqmip5yc6cvpvq.webp'),('3a789334-e6ac-47e0-bbfa-076139f2009f','30a88187-4fc0-4755-97ea-edea32afb535',0,'https://res.cloudinary.com/dihqq66r4/image/upload/v1766908120/doana/product_images/ckbldvahu6wg6su1aq1e.webp'),('3b5bdb74-b3c1-41e5-a2d9-dc6876c6395f','51770a7c-fcc6-4bae-b36e-e93592690e7c',0,'https://res.cloudinary.com/dihqq66r4/image/upload/v1766908304/doana/product_images/u3muvrg48lgre1dbyzqs.webp'),('4008e651-11d5-46dd-9245-d5fda8da577e','581346d3-30c3-4905-b968-8c27aacbe8c0',0,'https://res.cloudinary.com/dihqq66r4/image/upload/v1766908432/doana/product_images/eqxykc9jvdzzmumda8tg.webp'),('41381bd5-89f2-4d83-9f4b-1a6c6cac704f','bcaec108-25d1-4c1f-a6ef-e84eec3dd243',0,'https://res.cloudinary.com/dihqq66r4/image/upload/v1766908925/doana/product_images/v93z6ybzkmi5mjmvheow.webp'),('422372de-c966-4525-a1d3-61cb9fa24d37','51770a7c-fcc6-4bae-b36e-e93592690e7c',0,'https://res.cloudinary.com/dihqq66r4/image/upload/v1766908306/doana/product_images/td3gsa7lcdgpnvrugn3l.webp'),('47aa7d89-170e-4e56-8c78-e8488eec22a1','d918cbe8-83ac-45fd-b4e3-dcc6f554df16',0,'https://res.cloudinary.com/dihqq66r4/image/upload/v1766909066/doana/product_images/ujstj573q2e9z1squmed.webp'),('4eb03331-8077-4bdd-8d33-3ec01565d777','bcaec108-25d1-4c1f-a6ef-e84eec3dd243',0,'https://res.cloudinary.com/dihqq66r4/image/upload/v1766908926/doana/product_images/k1uijloaeogkba85j1rm.webp'),('4ec25f07-1e37-465d-bcf8-3fdf48c186ff','d918cbe8-83ac-45fd-b4e3-dcc6f554df16',1,'https://res.cloudinary.com/dihqq66r4/image/upload/v1766909064/doana/product_images/gmx3yqekpletkjesofgo.webp'),('529f87f6-00f9-4233-ac5d-644b0bad6c81','30a88187-4fc0-4755-97ea-edea32afb535',0,'https://res.cloudinary.com/dihqq66r4/image/upload/v1766908123/doana/product_images/p9cxzgkpcrhemzpyl0w0.webp'),('58da21e8-8600-47e6-a9c1-86dc4a1154e9','6457d39d-0933-477b-bdf7-f11f1ff83868',0,'https://res.cloudinary.com/dihqq66r4/image/upload/v1766908549/doana/product_images/gytti1ujxrn8csv6qses.webp'),('5d8cba0b-d8b0-426d-8bc5-e7bb0430bc8f','6457d39d-0933-477b-bdf7-f11f1ff83868',1,'https://res.cloudinary.com/dihqq66r4/image/upload/v1766908547/doana/product_images/wrvwr5nq0djz9gb2gnug.webp'),('67be2c42-22fe-49a9-9708-8e96612f5f3c','41f1426c-2b60-4ac7-b99c-ccdea67f9d6c',0,'https://res.cloudinary.com/dihqq66r4/image/upload/v1766909787/doana/product_images/mmsumndixwqfiedb5tic.jpg'),('801faeb0-7d5e-46fd-9757-73fa870fe1ca','bcaec108-25d1-4c1f-a6ef-e84eec3dd243',0,'https://res.cloudinary.com/dihqq66r4/image/upload/v1766908924/doana/product_images/t37apeculexuk7997ari.webp'),('8202e392-3e85-465b-93ca-4cad0c559f3f','30a88187-4fc0-4755-97ea-edea32afb535',1,'https://res.cloudinary.com/dihqq66r4/image/upload/v1766908119/doana/product_images/btz6bltebshn0fqatgwk.webp'),('8871d961-2609-4136-bbf9-994a8b30ba87','6a2589c8-8f96-4c82-9445-34a71da3161f',1,'https://res.cloudinary.com/dihqq66r4/image/upload/v1766909733/doana/product_images/fxxd0mhmydbogny1pvbo.webp'),('88d2b925-8ff6-4d8e-8529-04c825da323e','7887b0cc-faca-4f28-85ee-d0b813c19934',1,'https://res.cloudinary.com/dihqq66r4/image/upload/v1767758319/doana/product_images/mdlgogtdnl5whlnxnmiq.webp'),('8beb0b99-78b1-47f7-873e-2892eccdd623','41f1426c-2b60-4ac7-b99c-ccdea67f9d6c',1,'https://res.cloudinary.com/dihqq66r4/image/upload/v1766909785/doana/product_images/ki9igoebwais7zkfrxbl.jpg'),('9048680b-d13b-4cc3-9587-657d9a09f31f','a64b4565-ed75-4654-af69-19cfcaf48514',1,'https://res.cloudinary.com/dihqq66r4/image/upload/v1766909665/doana/product_images/a13ajxuyg1yrtw6peya0.webp'),('933b0757-4d96-459a-83b5-0165f79353b7','bcaec108-25d1-4c1f-a6ef-e84eec3dd243',1,'https://res.cloudinary.com/dihqq66r4/image/upload/v1766908923/doana/product_images/tuqzsmjfllx6bbqdyxj3.webp'),('943dfa6c-ab17-41d2-8660-148ce86ed5c7','66e60e9b-ee50-49e9-86f2-55b0b499ff95',0,'https://res.cloudinary.com/dihqq66r4/image/upload/v1766909641/doana/product_images/vokbwnrwfqk0tguzcbct.webp'),('b86a8ea3-8366-48de-ace7-98063c326196','7887b0cc-faca-4f28-85ee-d0b813c19934',0,'https://res.cloudinary.com/dihqq66r4/image/upload/v1767758321/doana/product_images/mqzf4stukquov96moveg.webp'),('be8b1a5d-e462-4e59-aede-16845eb8e91e','30a88187-4fc0-4755-97ea-edea32afb535',0,'https://res.cloudinary.com/dihqq66r4/image/upload/v1766908122/doana/product_images/p7xyah09pcjde90vlc3b.webp'),('c495ab60-9b94-4ed3-87b1-8134809cab09','51770a7c-fcc6-4bae-b36e-e93592690e7c',0,'https://res.cloudinary.com/dihqq66r4/image/upload/v1766908305/doana/product_images/radwopuh9fuovtwkm6xv.webp'),('de29583f-0e01-47e7-93e1-bb392e27d51e','bda616ae-9652-44ab-bcce-2065ab016c3d',1,'https://res.cloudinary.com/dihqq66r4/image/upload/v1766908968/doana/product_images/lzyyaeos175qxkjpwzl1.jpg'),('e42a4902-c319-4a18-9c26-69753e64cca8','581346d3-30c3-4905-b968-8c27aacbe8c0',0,'https://res.cloudinary.com/dihqq66r4/image/upload/v1766908431/doana/product_images/fuadzmff2vnvkcbskbbp.webp'),('e72c9939-a342-4072-be8e-4088fea158fc','d918cbe8-83ac-45fd-b4e3-dcc6f554df16',0,'https://res.cloudinary.com/dihqq66r4/image/upload/v1766909067/doana/product_images/su9otjkubk2qzfbhjc88.webp'),('eb6daa1b-d2c2-47d5-94ae-1988f4d69311','65dbbaf9-9d90-49ca-9575-b7285d676914',1,'https://res.cloudinary.com/dihqq66r4/image/upload/v1766908646/doana/product_images/nerfqgjsmn773k7tbpda.webp'),('f3d54da3-78bf-4cc9-a3da-7403c75976d8','65dbbaf9-9d90-49ca-9575-b7285d676914',0,'https://res.cloudinary.com/dihqq66r4/image/upload/v1766908647/doana/product_images/xe5ixoxbpbme4l7lqqvr.webp'),('f44ec634-faf9-4f1d-b4ee-fb2c90e14358','581346d3-30c3-4905-b968-8c27aacbe8c0',1,'https://res.cloudinary.com/dihqq66r4/image/upload/v1766908430/doana/product_images/nv81gofmmhngu3j3ep3n.webp'),('f5663662-ab44-48ef-9753-f0ace86db742','d918cbe8-83ac-45fd-b4e3-dcc6f554df16',0,'https://res.cloudinary.com/dihqq66r4/image/upload/v1766909065/doana/product_images/fl5zaxuaqkqz0qkghzvt.webp'),('ff428e07-8f18-4a34-a77e-3aca017a6f9f','51770a7c-fcc6-4bae-b36e-e93592690e7c',1,'https://res.cloudinary.com/dihqq66r4/image/upload/v1766908303/doana/product_images/raojwj2ribglo3d4iats.webp');
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
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

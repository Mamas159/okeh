-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               5.7.14 - MySQL Community Server (GPL)
-- Server OS:                    Win32
-- HeidiSQL Version:             9.4.0.5125
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for MellyBOT
CREATE DATABASE IF NOT EXISTS `MellyBOT` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `MellyBOT`;

-- Dumping structure for table MellyBOT.users
CREATE TABLE IF NOT EXISTS `users` (
  `guild` varchar(30) CHARACTER SET latin1 NOT NULL DEFAULT '',
  `userid` varchar(30) CHARACTER SET latin1 NOT NULL,
  `level` int(11) NOT NULL,
  `exp` int(11) NOT NULL,
  `bonusExp` int(32) DEFAULT '0',
  `cash` bigint(20) DEFAULT '0',
  `cuteness` int(16) DEFAULT '0',
  `lastvote` datetime DEFAULT '1000-01-01 00:00:00',
  `lastdaily` datetime DEFAULT '1000-01-01 00:00:00',
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `gamescore` int(32) DEFAULT '0',
  `raffled` BOOLEAN DEFAULT false,
  `background` int(32) DEFAULT '0' NOT NULL;
  PRIMARY KEY (`guild`,`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 PACK_KEYS=0;


/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

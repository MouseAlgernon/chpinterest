-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Май 12 2026 г., 03:00
-- Версия сервера: 8.4.7
-- Версия PHP: 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `!saygex`
--

-- --------------------------------------------------------

--
-- Структура таблицы `airbnb`
--

DROP TABLE IF EXISTS `airbnb`;
CREATE TABLE IF NOT EXISTS `airbnb` (
  `id_logement` int NOT NULL AUTO_INCREMENT,
  `Description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Nbr_chambre` int NOT NULL,
  `ville` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_pays` int NOT NULL,
  `Prix_Min` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_logement`),
  KEY `id_pays` (`id_pays`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `airbnb`
--

INSERT INTO `airbnb` (`id_logement`, `Description`, `Nbr_chambre`, `ville`, `id_pays`, `Prix_Min`) VALUES
(1, 'Appartement cosy centre-ville', 2, 'Paris', 1, 75.00),
(2, 'Villa avec piscine', 3, 'Barcelona', 2, 150.00),
(3, 'Studio romantique', 1, 'Rome', 3, 60.00),
(4, '', 0, '', 0, 0.00);

-- --------------------------------------------------------

--
-- Структура таблицы `bans`
--

DROP TABLE IF EXISTS `bans`;
CREATE TABLE IF NOT EXISTS `bans` (
  `ban_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `reason` text NOT NULL,
  `banned_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`ban_id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `boardcategories`
--

DROP TABLE IF EXISTS `boardcategories`;
CREATE TABLE IF NOT EXISTS `boardcategories` (
  `board_category_id` int NOT NULL AUTO_INCREMENT,
  `board_id` int NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`board_category_id`),
  KEY `board_id` (`board_id`),
  KEY `category_id` (`category_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `boards`
--

DROP TABLE IF EXISTS `boards`;
CREATE TABLE IF NOT EXISTS `boards` (
  `board_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `visibility` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`board_id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `boards`
--

INSERT INTO `boards` (`board_id`, `user_id`, `name`, `description`, `visibility`, `created_at`, `updated_at`) VALUES
(1, 1, 'гоол', 'гол', NULL, '2026-04-11 11:50:42', NULL),
(2, 2, '1', '', NULL, '2026-04-11 12:47:09', NULL),
(3, 3, 'йфу', '', NULL, '2026-04-11 13:07:40', NULL),
(4, 5, 'ё111222', '', NULL, '2026-04-13 21:08:16', NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `comments`
--

DROP TABLE IF EXISTS `comments`;
CREATE TABLE IF NOT EXISTS `comments` (
  `comment_id` int NOT NULL AUTO_INCREMENT,
  `pin_id` int NOT NULL,
  `user_id` int NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`comment_id`),
  KEY `pin_id` (`pin_id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `comments`
--

INSERT INTO `comments` (`comment_id`, `pin_id`, `user_id`, `content`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'вот так вот', '2026-04-11 12:37:30', NULL),
(2, 3, 1, '123', '2026-04-11 20:57:07', NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `comment_likes`
--

DROP TABLE IF EXISTS `comment_likes`;
CREATE TABLE IF NOT EXISTS `comment_likes` (
  `comment_like_id` int NOT NULL AUTO_INCREMENT,
  `comment_id` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`comment_like_id`),
  UNIQUE KEY `unique_comment_like` (`comment_id`,`user_id`),
  KEY `comment_id` (`comment_id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `externalaccounts`
--

DROP TABLE IF EXISTS `externalaccounts`;
CREATE TABLE IF NOT EXISTS `externalaccounts` (
  `account_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `provider` varchar(50) NOT NULL,
  `provider_user_id` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`account_id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `featureflags`
--

DROP TABLE IF EXISTS `featureflags`;
CREATE TABLE IF NOT EXISTS `featureflags` (
  `feature_id` int NOT NULL AUTO_INCREMENT,
  `feature_name` varchar(255) NOT NULL,
  `is_enabled` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`feature_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `followers`
--

DROP TABLE IF EXISTS `followers`;
CREATE TABLE IF NOT EXISTS `followers` (
  `follower_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `follower_user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`follower_id`),
  KEY `user_id` (`user_id`),
  KEY `follower_user_id` (`follower_user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `followers`
--

INSERT INTO `followers` (`follower_id`, `user_id`, `follower_user_id`, `created_at`) VALUES
(1, 1, 3, NULL),
(2, 2, 3, NULL),
(3, 3, 4, NULL),
(4, 3, 1, NULL),
(5, 1, 5, NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `friends`
--

DROP TABLE IF EXISTS `friends`;
CREATE TABLE IF NOT EXISTS `friends` (
  `friend_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `friend_user_id` int NOT NULL,
  `status` enum('pending','accepted','blocked') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`friend_id`),
  UNIQUE KEY `unique_friendship` (`user_id`,`friend_user_id`),
  KEY `friend_user_id` (`friend_user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `friends`
--

INSERT INTO `friends` (`friend_id`, `user_id`, `friend_user_id`, `status`, `created_at`) VALUES
(1, 3, 2, 'pending', '2026-04-11 19:57:01'),
(2, 4, 3, 'accepted', '2026-04-11 19:59:17'),
(3, 3, 4, 'accepted', '2026-04-11 19:59:33'),
(4, 5, 1, 'accepted', '2026-04-13 20:53:55'),
(5, 1, 5, 'accepted', '2026-04-13 22:27:52'),
(6, 1, 3, 'pending', '2026-04-13 22:28:10');

-- --------------------------------------------------------

--
-- Структура таблицы `images`
--

DROP TABLE IF EXISTS `images`;
CREATE TABLE IF NOT EXISTS `images` (
  `image_id` int NOT NULL AUTO_INCREMENT,
  `pin_id` int NOT NULL,
  `image_path` varchar(500) NOT NULL,
  `image_type` enum('url','upload') DEFAULT 'upload',
  `sort_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`image_id`),
  KEY `pin_id` (`pin_id`)
) ENGINE=MyISAM AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `images`
--

INSERT INTO `images` (`image_id`, `pin_id`, `image_path`, `image_type`, `sort_order`, `created_at`) VALUES
(1, 1, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0A0PlkPcbQOZVQRekNmaquosxbRX8vZGA-g&s', 'url', 0, '2026-04-11 13:35:39'),
(2, 2, 'https://upload.wikimedia.org/wikipedia/en/0/06/Planescape-torment-box.jpg', 'url', 0, '2026-04-11 13:35:39'),
(3, 3, 'https://i1.sndcdn.com/artworks-wOodONjp0FTeV3yj-gFXzvQ-t500x500.jpg', 'url', 0, '2026-04-11 13:35:39'),
(4, 4, '/assets/uploads/img_69dd5e3328f85_eft_tagillajpgb22291fd038935060e1d2a5c99281799.jpg', 'url', 0, '2026-04-13 21:20:56'),
(5, 4, '/assets/uploads/img_69dd5e332915a_5948e7529a44b070.png', 'url', 1, '2026-04-13 21:20:56'),
(6, 7, 'https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?w=1080', 'url', 0, '2026-05-11 04:09:34'),
(7, 6, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1080', 'url', 0, '2026-05-11 04:09:34'),
(8, 5, 'https://images.unsplash.com/photo-1617634667039-8e4cb277ab46?w=1080', 'url', 0, '2026-05-11 04:09:34'),
(9, 8, 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1080', 'url', 0, '2026-05-11 04:09:34'),
(10, 9, 'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?w=1080', 'url', 0, '2026-05-11 04:09:34'),
(11, 10, 'https://images.unsplash.com/photo-1532980400857-e8d9d275d858?w=1080', 'url', 0, '2026-05-11 04:09:34'),
(12, 11, 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1080', 'url', 0, '2026-05-11 04:09:34'),
(13, 12, 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=1080', 'url', 0, '2026-05-11 04:09:34'),
(14, 13, 'https://images.unsplash.com/photo-1611307742746-43cbea512c37?w=1080', 'url', 0, '2026-05-11 04:09:34'),
(15, 14, 'https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?w=1080', 'url', 0, '2026-05-11 04:09:34'),
(16, 15, 'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?w=1080', 'url', 0, '2026-05-11 04:09:34'),
(17, 16, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1080', 'url', 0, '2026-05-11 04:09:34'),
(18, 17, 'https://images.unsplash.com/39/wdXqHcTwSTmLuKOGz92L_Landscape.jpg?w=1080', 'url', 0, '2026-05-11 04:09:34'),
(19, 18, 'https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=1080', 'url', 0, '2026-05-11 04:09:34'),
(20, 19, 'https://images.unsplash.com/photo-1527576539890-dfa815648363?w=1080', 'url', 0, '2026-05-11 04:09:34'),
(21, 20, 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=1080', 'url', 0, '2026-05-11 04:09:34'),
(22, 21, 'https://images.unsplash.com/photo-1621846846625-f0bde2eb7c3c?w=1080', 'url', 0, '2026-05-11 04:09:34'),
(23, 22, 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=1080', 'url', 0, '2026-05-11 04:09:34'),
(24, 23, 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1080', 'url', 0, '2026-05-11 04:09:34'),
(25, 24, 'https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=1080', 'url', 0, '2026-05-11 04:09:34'),
(26, 25, 'https://images.unsplash.com/photo-1500622944204-b135684e99fd?w=1080', 'url', 0, '2026-05-11 04:09:34'),
(27, 26, 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=1080', 'url', 0, '2026-05-11 04:09:34'),
(28, 27, 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?w=1080', 'url', 0, '2026-05-11 04:09:34'),
(29, 28, 'https://images.unsplash.com/photo-1541377182189-74e4a4ea12e5?w=1080', 'url', 0, '2026-05-11 04:09:34'),
(30, 29, 'https://images.unsplash.com/photo-1615118265620-d8decf628275?w=1080', 'url', 0, '2026-05-11 04:09:34'),
(31, 30, 'https://images.unsplash.com/photo-1554520735-0a6b8b6ce8b7?w=1080', 'url', 0, '2026-05-11 04:09:34'),
(32, 31, 'https://images.unsplash.com/photo-1548248823-ce16a73b6d49?w=1080', 'url', 0, '2026-05-11 04:09:34'),
(33, 32, 'https://images.unsplash.com/photo-1648322032202-73cb85f354be?w=1080', 'url', 0, '2026-05-11 04:09:34'),
(34, 33, 'https://images.unsplash.com/photo-1610552050890-fe99536c2615?w=1080', 'url', 0, '2026-05-11 04:09:34'),
(35, 34, 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=1080', 'url', 0, '2026-05-11 04:09:34'),
(36, 35, 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1080', 'url', 0, '2026-05-11 04:09:34'),
(37, 36, 'https://images.unsplash.com/photo-1648322032206-888c91d99616?w=1080', 'url', 0, '2026-05-11 04:09:34');

-- --------------------------------------------------------

--
-- Структура таблицы `likes`
--

DROP TABLE IF EXISTS `likes`;
CREATE TABLE IF NOT EXISTS `likes` (
  `like_id` int NOT NULL AUTO_INCREMENT,
  `pin_id` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`like_id`),
  KEY `pin_id` (`pin_id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `likes`
--

INSERT INTO `likes` (`like_id`, `pin_id`, `user_id`, `created_at`) VALUES
(6, 1, 1, '2026-04-11 12:49:01'),
(23, 1, 3, '2026-04-11 13:41:37'),
(24, 2, 3, '2026-04-11 19:54:39'),
(25, 3, 1, '2026-04-11 20:57:02'),
(28, 3, 5, '2026-04-13 20:45:14'),
(30, 4, 1, '2026-04-13 21:29:12');

-- --------------------------------------------------------

--
-- Структура таблицы `messages`
--

DROP TABLE IF EXISTS `messages`;
CREATE TABLE IF NOT EXISTS `messages` (
  `message_id` int NOT NULL AUTO_INCREMENT,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`message_id`),
  KEY `sender_id` (`sender_id`),
  KEY `receiver_id` (`receiver_id`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `messages`
--

INSERT INTO `messages` (`message_id`, `sender_id`, `receiver_id`, `content`, `created_at`) VALUES
(1, 3, 4, 'ого', '2026-04-11 19:59:38'),
(2, 4, 3, 'воткак\r\n', '2026-04-11 20:00:00'),
(3, 3, 4, 'ого', '2026-04-11 20:00:09'),
(4, 4, 3, 'воткак\r\n', '2026-04-11 20:00:15'),
(5, 3, 4, 'ого', '2026-04-11 20:00:19'),
(6, 4, 3, 'ujjjk', '2026-04-11 20:12:18'),
(7, 3, 4, 'гол', '2026-04-11 20:12:28'),
(8, 4, 3, 'гогогоо', '2026-04-11 20:12:36'),
(9, 4, 3, 'йцуйцуцуйцу', '2026-04-11 20:14:16'),
(10, 3, 4, '12', '2026-04-11 20:14:21'),
(11, 1, 5, 'ujjjk', '2026-04-14 01:34:21');

-- --------------------------------------------------------

--
-- Структура таблицы `notifications`
--

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE IF NOT EXISTS `notifications` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`notification_id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `pays`
--

DROP TABLE IF EXISTS `pays`;
CREATE TABLE IF NOT EXISTS `pays` (
  `id_pays` int NOT NULL AUTO_INCREMENT,
  `nom_pays` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_pays`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `pays`
--

INSERT INTO `pays` (`id_pays`, `nom_pays`) VALUES
(1, 'France'),
(2, 'Espagne'),
(3, 'Italie');

-- --------------------------------------------------------

--
-- Структура таблицы `pinratings`
--

DROP TABLE IF EXISTS `pinratings`;
CREATE TABLE IF NOT EXISTS `pinratings` (
  `rating_id` int NOT NULL AUTO_INCREMENT,
  `pin_id` int NOT NULL,
  `user_id` int NOT NULL,
  `rating` tinyint NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`rating_id`),
  KEY `pin_id` (`pin_id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `pins`
--

DROP TABLE IF EXISTS `pins`;
CREATE TABLE IF NOT EXISTS `pins` (
  `pin_id` int NOT NULL AUTO_INCREMENT,
  `board_id` int NOT NULL,
  `user_id` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `image_url` varchar(500) NOT NULL,
  `link_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `category` varchar(100) DEFAULT 'Other',
  PRIMARY KEY (`pin_id`),
  KEY `board_id` (`board_id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `pins`
--

INSERT INTO `pins` (`pin_id`, `board_id`, `user_id`, `title`, `description`, `image_url`, `link_url`, `created_at`, `updated_at`, `category`) VALUES
(7, 1, 1, 'Modern Architecture', 'Glass and steel structure reflecting the city skyline at dusk.', 'https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?w=1080', NULL, '2026-05-11 04:09:34', NULL, 'Architecture'),
(6, 1, 1, 'Gourmet Burger', 'Juicy double patty burger with caramelized onions and special sauce.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1080', NULL, '2026-05-11 04:09:34', NULL, 'Food'),
(5, 1, 1, 'Mountain Vista', 'Stunning mountain landscape at golden hour with dramatic clouds.', 'https://images.unsplash.com/photo-1617634667039-8e4cb277ab46?w=1080', NULL, '2026-05-11 04:09:34', NULL, 'Nature'),
(8, 1, 1, 'Fashion Trends', 'Spring collection featuring bold colors and flowing silhouettes.', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1080', NULL, '2026-05-11 04:09:34', NULL, 'Fashion'),
(9, 1, 1, 'Coastal Beauty', 'Breathtaking coastal scenery with turquoise waters.', 'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?w=1080', NULL, '2026-05-11 04:09:34', NULL, 'Nature'),
(10, 1, 1, 'Sweet Pancakes', 'Fluffy pancakes with fresh berries and maple syrup.', 'https://images.unsplash.com/photo-1532980400857-e8d9d275d858?w=1080', NULL, '2026-05-11 04:09:34', NULL, 'Food'),
(11, 1, 1, 'White Minimalism', 'Clean minimal architecture with pure white surfaces.', 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1080', NULL, '2026-05-11 04:09:34', NULL, 'Architecture'),
(12, 1, 1, 'Clothing Collection', 'Elegant clothing collection for the modern wardrobe.', 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=1080', NULL, '2026-05-11 04:09:34', NULL, 'Fashion'),
(13, 1, 1, 'Mountain Cabin', 'Cozy mountain cabin surrounded by pine trees and snow.', 'https://images.unsplash.com/photo-1611307742746-43cbea512c37?w=1080', NULL, '2026-05-11 04:09:34', NULL, 'Nature'),
(14, 1, 1, 'Fresh Fruits', 'Colorful arrangement of fresh tropical fruits.', 'https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?w=1080', NULL, '2026-05-11 04:09:34', NULL, 'Food'),
(15, 1, 1, 'Curved Design', 'Innovative curved architectural design in urban setting.', 'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?w=1080', NULL, '2026-05-11 04:09:34', NULL, 'Architecture'),
(16, 1, 1, 'Streetwear Style', 'Urban streetwear fashion with bold graphic prints.', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1080', NULL, '2026-05-11 04:09:34', NULL, 'Fashion'),
(17, 1, 1, 'Blue Waters', 'Serene blue waters reflecting the clear sky above.', 'https://images.unsplash.com/39/wdXqHcTwSTmLuKOGz92L_Landscape.jpg?w=1080', NULL, '2026-05-11 04:09:34', NULL, 'Nature'),
(18, 1, 1, 'Pasta Perfection', 'Handmade pasta with rich tomato sauce and fresh basil.', 'https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=1080', NULL, '2026-05-11 04:09:34', NULL, 'Food'),
(19, 1, 1, 'Geometric Forms', 'Bold geometric architectural forms casting dramatic shadows.', 'https://images.unsplash.com/photo-1527576539890-dfa815648363?w=1080', NULL, '2026-05-11 04:09:34', NULL, 'Architecture'),
(20, 1, 1, 'Park Fashion', 'Casual chic fashion shoot in a blooming spring park.', 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=1080', NULL, '2026-05-11 04:09:34', NULL, 'Fashion'),
(21, 1, 1, 'Rocky Shore', 'Dramatic rocky shoreline with crashing waves at sunset.', 'https://images.unsplash.com/photo-1621846846625-f0bde2eb7c3c?w=1080', NULL, '2026-05-11 04:09:34', NULL, 'Nature'),
(22, 1, 1, 'Double Burgers', 'Towering double burger with all the classic toppings.', 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=1080', NULL, '2026-05-11 04:09:34', NULL, 'Food'),
(23, 1, 1, 'City Skyline', 'Breathtaking city skyline view from above the clouds.', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1080', NULL, '2026-05-11 04:09:34', NULL, 'Architecture'),
(24, 1, 1, 'Maroon Elegance', 'Sophisticated maroon evening wear with elegant accessories.', 'https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=1080', NULL, '2026-05-11 04:09:34', NULL, 'Fashion'),
(25, 1, 1, 'Aerial Mountains', 'Aerial view of snow-capped mountain peaks at dawn.', 'https://images.unsplash.com/photo-1500622944204-b135684e99fd?w=1080', NULL, '2026-05-11 04:09:34', NULL, 'Nature'),
(26, 1, 1, 'Ramen Bowl', 'Steaming bowl of authentic Japanese ramen with soft egg.', 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=1080', NULL, '2026-05-11 04:09:34', NULL, 'Food'),
(27, 1, 1, 'Modern Cement', 'Raw concrete modernist structure with sculptural quality.', 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?w=1080', NULL, '2026-05-11 04:09:34', NULL, 'Architecture'),
(28, 1, 1, 'Summer Slippers', 'Bright summer sandals on sun-bleached wooden boards.', 'https://images.unsplash.com/photo-1541377182189-74e4a4ea12e5?w=1080', NULL, '2026-05-11 04:09:34', NULL, 'Fashion'),
(29, 1, 1, 'Lake Vista', 'Tranquil mountain lake reflecting golden autumn foliage.', 'https://images.unsplash.com/photo-1615118265620-d8decf628275?w=1080', NULL, '2026-05-11 04:09:34', NULL, 'Nature'),
(30, 1, 1, 'Syrup Stack', 'Towering stack of pancakes dripping with golden maple syrup.', 'https://images.unsplash.com/photo-1554520735-0a6b8b6ce8b7?w=1080', NULL, '2026-05-11 04:09:34', NULL, 'Food'),
(31, 1, 1, 'Abstract Curves', 'Sweeping abstract curves in contemporary museum architecture.', 'https://images.unsplash.com/photo-1548248823-ce16a73b6d49?w=1080', NULL, '2026-05-11 04:09:34', NULL, 'Architecture'),
(32, 1, 1, 'Purple Fashion', 'Bold purple ensemble with avant-garde styling.', 'https://images.unsplash.com/photo-1648322032202-73cb85f354be?w=1080', NULL, '2026-05-11 04:09:34', NULL, 'Fashion'),
(33, 1, 1, 'Green Fields', 'Endless green fields stretching to the horizon at sunrise.', 'https://images.unsplash.com/photo-1610552050890-fe99536c2615?w=1080', NULL, '2026-05-11 04:09:34', NULL, 'Nature'),
(34, 1, 1, 'Pasta Plate', 'Rustic pasta plate with rich meat sauce and parmesan.', 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=1080', NULL, '2026-05-11 04:09:34', NULL, 'Food'),
(35, 1, 1, 'White Building', 'Striking white modernist building against a blue sky.', 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1080', NULL, '2026-05-11 04:09:34', NULL, 'Architecture'),
(36, 1, 1, 'Sneaker Style', 'Limited edition sneakers styled with urban streetwear.', 'https://images.unsplash.com/photo-1648322032206-888c91d99616?w=1080', NULL, '2026-05-11 04:09:34', NULL, 'Fashion'),
(37, 1, 1, '', '', '', NULL, '2026-05-11 04:20:48', NULL, 'Other');

-- --------------------------------------------------------

--
-- Структура таблицы `pintags`
--

DROP TABLE IF EXISTS `pintags`;
CREATE TABLE IF NOT EXISTS `pintags` (
  `pin_tag_id` int NOT NULL AUTO_INCREMENT,
  `pin_id` int NOT NULL,
  `tag_id` int NOT NULL,
  PRIMARY KEY (`pin_tag_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `pinviews`
--

DROP TABLE IF EXISTS `pinviews`;
CREATE TABLE IF NOT EXISTS `pinviews` (
  `view_id` int NOT NULL AUTO_INCREMENT,
  `pin_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `viewed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`view_id`),
  KEY `pin_id` (`pin_id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `reports`
--

DROP TABLE IF EXISTS `reports`;
CREATE TABLE IF NOT EXISTS `reports` (
  `report_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `pin_id` int DEFAULT NULL,
  `board_id` int DEFAULT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`report_id`),
  KEY `user_id` (`user_id`),
  KEY `pin_id` (`pin_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `savedpins`
--

DROP TABLE IF EXISTS `savedpins`;
CREATE TABLE IF NOT EXISTS `savedpins` (
  `save_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `pin_id` int NOT NULL,
  `saved_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`save_id`),
  KEY `user_id` (`user_id`),
  KEY `pin_id` (`pin_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `searchhistory`
--

DROP TABLE IF EXISTS `searchhistory`;
CREATE TABLE IF NOT EXISTS `searchhistory` (
  `search_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `query` varchar(500) NOT NULL,
  `searched_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`search_id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `userfeatureflags`
--

DROP TABLE IF EXISTS `userfeatureflags`;
CREATE TABLE IF NOT EXISTS `userfeatureflags` (
  `user_feature_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `feature_id` int NOT NULL,
  PRIMARY KEY (`user_feature_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `userinterests`
--

DROP TABLE IF EXISTS `userinterests`;
CREATE TABLE IF NOT EXISTS `userinterests` (
  `interest_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`interest_id`),
  KEY `user_id` (`user_id`),
  KEY `category_id` (`category_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(191) NOT NULL,
  `username` varchar(191) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `profile_picture` varchar(500) DEFAULT NULL,
  `bio` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=MyISAM AUTO_INCREMENT=1489 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`user_id`, `email`, `username`, `password`, `profile_picture`, `bio`, `created_at`, `updated_at`) VALUES
(1, 'admin@example.com', 'admin', 'admin123', NULL, 'Administrator account', '2026-04-11 10:57:40', '2026-04-11 10:57:40'),
(2, 'Pinok@pin.ok', 'пиночек', '123123', NULL, NULL, '2026-04-11 12:46:44', '2026-04-11 12:46:44'),
(3, '123@12.3', '123', '123123', 'http://localhost:4533/rest/getCoverArt?u=pinok&t=952fb5850fbb5253c7879103022fac4e&s=186516&f=json&v=1.8.0&c=NavidromeUI&id=al-2aKrt2JnC1RukDdf5k60EA&_=2026-04-10T20%3A21%3A18.7261632%2B02%3A00&size=300', '', '2026-04-11 12:48:58', '2026-04-11 13:07:25'),
(4, 'atemhook@gmail.com', '123123', '123123', NULL, NULL, '2026-04-11 19:59:07', '2026-04-11 19:59:07'),
(5, '1231@12', '1231', '123123', NULL, NULL, '2026-04-13 20:25:35', '2026-04-13 20:25:35'),
(1488, 'govono@gmail.com', 'test', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnTQ04WdzI8_nx_D7_gGQK5nyjsunQOHNm5g&s', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnTQ04WdzI8_nx_D7_gGQK5nyjsunQOHNm5g&s', NULL, NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `usersettings`
--

DROP TABLE IF EXISTS `usersettings`;
CREATE TABLE IF NOT EXISTS `usersettings` (
  `setting_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `setting_name` varchar(255) NOT NULL,
  `setting_value` text,
  PRIMARY KEY (`setting_id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

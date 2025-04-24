-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Värd: 127.0.0.1
-- Tid vid skapande: 24 apr 2025 kl 12:00
-- Serverversion: 10.4.32-MariaDB
-- PHP-version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Databas: `webshop`
--

-- --------------------------------------------------------

--
-- Tabellstruktur `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumpning av Data i tabell `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Kläder'),
(2, 'Skor'),
(3, 'Accessoarer'),
(4, 'Kontorsmatriel'),
(5, 'Möbler'),
(6, 'Elektronik'),
(11, 'Utemöbler'),
(14, 'Hemtextil');

-- --------------------------------------------------------

--
-- Tabellstruktur `categories_type`
--

CREATE TABLE `categories_type` (
  `category_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumpning av Data i tabell `categories_type`
--

INSERT INTO `categories_type` (`category_id`, `product_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 6),
(2, 4),
(2, 13),
(3, 5),
(4, 9),
(6, 9),
(6, 14),
(11, 15),
(14, 26);

-- --------------------------------------------------------

--
-- Tabellstruktur `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `title` text NOT NULL,
  `description` varchar(200) NOT NULL,
  `stock` tinyint(1) NOT NULL DEFAULT 1,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(200) NOT NULL,
  `created_at` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumpning av Data i tabell `products`
--

INSERT INTO `products` (`id`, `title`, `description`, `stock`, `price`, `image`, `created_at`) VALUES
(1, 'Långbyxor', 'Långa svarta byxor', 1, 150.00, 'black_jeans.png', '2025-04-15'),
(2, 'Långbyxor', 'Långa blå byxor', 0, 1600.00, 'blue_jeans.png', '2025-04-15'),
(3, 'Långärmad tröja', 'Långärmad mönstrad tröja', 1, 800.00, 'longsleve_sweater_pattern.png', '2025-04-15'),
(4, 'Löparskor', 'Låga sneakers för vardagsbruk', 1, 900.00, 'sneakers.png', '2025-04-15'),
(5, 'Axelremsväska', 'Axelremsväska i brunt med lång axelrem', 1, 700.00, 'handbag_long_shoulderstripe_brown.png', '2025-04-15'),
(6, 'Medellånga shorts', 'Medellånga blå shorts i seglarmodell', 1, 400.00, 'sailor_shorts.png', '2025-04-15'),
(9, 'Glödlampa', '40W', 1, 20.00, 'lightbulb.png', '2025-04-17'),
(13, 'Kängor', 'Höga vandringskängor', 1, 2800.00, 'hiking_boots.png', '2025-04-19'),
(14, 'Telefon', 'Klassisk telefon', 1, 4400.00, 'phone.png', '2025-04-21'),
(15, 'Fransk soffa', 'Klassisk fransk soffa i vitmålat gjutjärn', 1, 10000.00, 'french_sofa.png', '2025-04-21'),
(26, 'Köksgardin', 'Rutig köksgardin', 1, 300.00, 'kitchen_curtain.png', '2025-04-24');

--
-- Index för dumpade tabeller
--

--
-- Index för tabell `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Index för tabell `categories_type`
--
ALTER TABLE `categories_type`
  ADD PRIMARY KEY (`category_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Index för tabell `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT för dumpade tabeller
--

--
-- AUTO_INCREMENT för tabell `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT för tabell `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Restriktioner för dumpade tabeller
--

--
-- Restriktioner för tabell `categories_type`
--
ALTER TABLE `categories_type`
  ADD CONSTRAINT `categories_type_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `categories_type_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

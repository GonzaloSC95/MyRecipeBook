-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-05-2025 a las 12:20:18
-- Versión del servidor: 10.4.22-MariaDB
-- Versión de PHP: 8.0.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `recipe_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ingredients`
--

CREATE TABLE `ingredients` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `quantity` varchar(255) DEFAULT NULL,
  `recipe_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recipes`
--

CREATE TABLE `recipes` (
  `id` bigint(20) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `steps` text DEFAULT NULL,
  `time` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `category_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKghuylkwuedgl2qahxjt8g41kb` (`user_id`);

--
-- Indices de la tabla `ingredients`
--
ALTER TABLE `ingredients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK7p08vcn6wf7fd6qp79yy2jrwg` (`recipe_id`);

--
-- Indices de la tabla `recipes`
--
ALTER TABLE `recipes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK6wb50tfk9lq1am8j9gl69pec1` (`category_id`),
  ADD KEY `FKlc3x6yty3xsupx80hqbj9ayos` (`user_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ingredients`
--
ALTER TABLE `ingredients`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `recipes`
--
ALTER TABLE `recipes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `FKghuylkwuedgl2qahxjt8g41kb` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `ingredients`
--
ALTER TABLE `ingredients`
  ADD CONSTRAINT `FK7p08vcn6wf7fd6qp79yy2jrwg` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`);

--
-- Filtros para la tabla `recipes`
--
ALTER TABLE `recipes`
  ADD CONSTRAINT `FK6wb50tfk9lq1am8j9gl69pec1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  ADD CONSTRAINT `FKlc3x6yty3xsupx80hqbj9ayos` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- Inserts para la tabla `users`
-- Usuarios
INSERT INTO `users` (id, email, name, password) VALUES
(1, 'maria@test.com', 'María', '$2a$10$92eay2K4AJm.X4qdI3XSKen1nYfrr2aoO3JWg.oAEOyNCX1ISfirG'); --123456

-- Categorías
INSERT INTO `categories` (id, image, name, user_id) VALUES
(1, 'ensaladas.jpg', 'Ensaladas', 1),
(2, 'postres.jpg', 'Postres', 1),
(3, 'bebidas.jpg', 'Bebidas', 1),
(4, 'aperitivos.jpg', 'Aperitivos', 1),
(5, 'salsas.jpg', 'Salsas', 1);

-- Recetas
INSERT INTO `recipes` (id, image, steps, time, title, category_id, user_id)
VALUES (1, 'placeholder.jpg', 'Preparación de ejemplo', 10, 'Receta de ejemplo', 1, 1);

-- Ingredientes
INSERT INTO `ingredients` (id, name, quantity, recipe_id) VALUES
(1, 'Tomate', '2 unidades', 1),
(2, 'Lechuga', '1 cabeza', 1),
(3, 'Zanahoria rallada', '100 g', 1),
(4, 'Harina de trigo', '500 g', 1),
(5, 'Azúcar', '200 g', 1),
(6, 'Huevos frescos', '3 unidades', 1),
(7, 'Leche', '500 ml', 1),
(8, 'Fresas', '300 g', 1),
(9, 'Queso crema', '200 g', 1),
(10, 'Cacao en polvo', '50 g', 1);

/*
SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM ingredients;
DELETE FROM recipes;
DELETE FROM categories;
DELETE FROM users;
SET FOREIGN_KEY_CHECKS = 1;
*/
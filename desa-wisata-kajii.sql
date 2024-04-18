-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 18 Apr 2024 pada 05.54
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `desa-wisata-kajii`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_user`
--

CREATE TABLE `tb_user` (
  `id_user` int(11) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `email` varchar(50) NOT NULL,
  `no_telp` char(15) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `profil` text NOT NULL,
  `token` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tb_user`
--

INSERT INTO `tb_user` (`id_user`, `nama`, `email`, `no_telp`, `password`, `username`, `profil`, `token`) VALUES
(1, 'aaa', 'a@gmail.com', '082133753551', 'aaa', 'a', '', ''),
(2, 'asd', 'aa@gmail.com', '123456', '$2y$12$cQzRKtQm7rxss2pnU8mKlOhcLI7d.oFicl.vOUSxDM8253Ea/y4u.', 'asdasd', '', ''),
(3, 'asd', 'aaa@gmail.com', '088221629812', '$2y$12$/JgwFctEDHCOUufGi9DymODr9HpbFmXPzNbVLeefR2Jc3HbkXTjoC', 'asdasd', '', ''),
(4, 'asdsdadasdasdasd', 'aabs@gmail.com', '123', '$2y$12$6Fom6mLq.Dfs5aKo1jnSVukZ4Mza49l7KH3.fkgg1nbRIEeG/KIUG', 'asdasd', 'assets/image/avatar-1.png', 'eyJpdiI6IlhaOUhYbUc0cjdXc05Xby84WVNMcFE9PSIsInZhbHVlIjoiMzRDUVpqRldXWUFyd204K0dXMnpDUnlGUGhXUHIwT3Zubm40T2txSHRXR0F3OEhvejEwN3FsVzhnTkxFcm1QcCIsIm1hYyI6IjFhMDI1ZDI2NWQ2YmQ5YWRkM2VhOTYxY2Q3ZjJmNjE0Mzk4M2FmMmEwYjc3NjBmMzBmMTdmNDFiMDdkODBjMjkiLCJ0YWciOiIifQ=='),
(5, 'aaaaaa', 'asdadas@gmail.com', '0989792342', '$2y$12$f.9sjdKGW00ltm3Ksek9VO4kFqAr6UZauIkuuQohT3aAvBhSCOnQm', 'asasdasd', 'assets/image/avatar-1.png', '');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `tb_user`
--
ALTER TABLE `tb_user`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `tb_user`
--
ALTER TABLE `tb_user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 13, 2024 at 09:00 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `desa-wisata-kajii2`
--

-- --------------------------------------------------------

--
-- Table structure for table `tb_admin`
--

CREATE TABLE `tb_admin` (
  `id_admin` int(11) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `no_telp` char(15) NOT NULL,
  `email` varchar(50) NOT NULL,
  `alamat` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_admin`
--

INSERT INTO `tb_admin` (`id_admin`, `nama`, `no_telp`, `email`, `alamat`, `password`) VALUES
(8, 'Administrator', '0888888888', 'admin@gmail.com', 'asdasdnadisadaiodjasdads', '$2y$12$5FeAq3tgqGsoMFKsGIyRwOGnJSO/5eQdfouuqu1CU.V1mXcCy3m02');

-- --------------------------------------------------------

--
-- Table structure for table `tb_artikel`
--

CREATE TABLE `tb_artikel` (
  `id_artikel` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `gambar` text NOT NULL,
  `deskripsi` text NOT NULL,
  `dibuat` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_artikel`
--

INSERT INTO `tb_artikel` (`id_artikel`, `judul`, `gambar`, `deskripsi`, `dibuat`) VALUES
(8, 'konasdasdd', 'uploads/artikel/662177266ee29.jpg,uploads/artikel/662177266f2d1.png,uploads/artikel/6621772671302.png', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', '2024-04-19'),
(9, 'Kontest Ikan', 'uploads/artikel/666a9444513c8.png,uploads/artikel/666a944452d1b.jpg,uploads/artikel/666a944454d30.jpg', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', '2024-09-06');

-- --------------------------------------------------------

--
-- Table structure for table `tb_faq`
--

CREATE TABLE `tb_faq` (
  `id_faq` int(11) NOT NULL,
  `pertanyaan` text NOT NULL,
  `jawaban` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_faq`
--

INSERT INTO `tb_faq` (`id_faq`, `pertanyaan`, `jawaban`) VALUES
(4, 'Jenis ikan hias apa saja yang tersedia di desa ini', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris'),
(5, 'Apakah ikan hias yang dijual sehat dan berkualitas?', 'Ya, kami memastikan semua ikan hias yang dijual dalam kondisi sehat dan berkualitas. Kami memiliki tim ahli yang melakukan pemeriksaan rutin dan memberikan perawatan terbaik untuk setiap ikan sebelum dijual.'),
(6, 'Bagaimana cara merawat ikan hias yang baik?', 'Setiap jenis ikan hias memiliki kebutuhan yang berbeda. Secara umum, pastikan akuarium memiliki ukuran yang cukup, kualitas air yang baik, dan makanan yang sesuai.');

-- --------------------------------------------------------

--
-- Table structure for table `tb_hiburan`
--

CREATE TABLE `tb_hiburan` (
  `id_hiburan` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `gambar` text NOT NULL,
  `harga` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_hiburan`
--

INSERT INTO `tb_hiburan` (`id_hiburan`, `judul`, `gambar`, `harga`) VALUES
(9, 'Makanan Khas Dewi Kajii', 'uploads/hiburan/666a88c693d45.jpeg', 25000),
(10, 'Bersepeda', 'uploads/hiburan/666a88eb2a7be.JPG', 10000);

-- --------------------------------------------------------

--
-- Table structure for table `tb_homestay`
--

CREATE TABLE `tb_homestay` (
  `id_homestay` int(11) NOT NULL,
  `judul` varchar(115) NOT NULL,
  `gambar` text NOT NULL,
  `fasilitas` text NOT NULL,
  `deskripsi` text NOT NULL,
  `peraturan` text NOT NULL,
  `harga` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_homestay`
--

INSERT INTO `tb_homestay` (`id_homestay`, `judul`, `gambar`, `fasilitas`, `deskripsi`, `peraturan`, `harga`) VALUES
(21, 'Homestay Guppy', 'uploads/homestay/666a8a1e33923.jpg,uploads/homestay/666a8a1e35775.png,uploads/homestay/666a8a1e36b4d.JPG', 'Kamar Mandi Bersama\r\nKipas Angin\r\nPerlengkapan Mandi\r\nSarapan Pagi\r\nTelevisi\r\nWifi Area', 'Sobat Kajii dapat menginap di Homestay Guppy. Homestay yang dimiliki oleh Muhammad Gema Ramadhan ini berlokasi di Kadisoro RT 03, Gilangharjo, Pandak, Bantul, D.I. Yogyakarta. Menyediakan satu buah kamar, Sobat Kajii dapat menginap di Homestay ini mulai dari Rp150.000,00 per malam (max 2 orang) dan Rp200.000,00 per malam (max 4 orang). Adapun fasilitas yang akan Sobat Kajii dapatkan antara lain: kamar mandi bersama, peralatan mandi, kasur, kipas angin, tempat shalat, televisi, perlengkapan P3K, tempat sampah, dan tempat parkir.', '-', 200000),
(22, 'Homestay Platy', 'uploads/homestay/666a8a795ba82.jpg,uploads/homestay/666a8a7963860.png,uploads/homestay/666a8a79651ab.JPG', 'Kamar Mandi Bersama\r\nKipas Angin\r\nPerlengkapan Mandi\r\nSarapan Pagi\r\nTelevisi\r\nWifi Area', 'Homestay Platy dapat menjadi opsi lain Sobat Kajii ketika singgah di Dewi Kajii. Mbah Untung, sapaan akrabnya, merupakan pemilik Homestay Platy yang berlokasi di Kadisoro RT 03, Gilangharjo, Pandak, Bantul, D.I Yogyakarta. Menyediakan dua buah kamar yang dapat dipilih untuk menginap dengan harga sewa yang tidak menguras kantong. Dipatok dengan harga Rp150.000,00 per malam (max 2 orang) dan Rp200.000,00 per malam (max 4 orang), Sobat Kajii sudah bisa bermalam di homestay ini. Adapun fasilitas yang akan diperoleh yaitu kamar mandi bersama, peralatan mandi, kasur, almari, kipas angin, tempat shalat, perlengkapan P3K, tempat sampah, dan tempat parkir.', '-', 200000),
(23, 'Homestay Molly', 'uploads/homestay/666a8b4bb1a77.jpg,uploads/homestay/666a8b4bb4564.png,uploads/homestay/666a8b4bb5bb3.JPG', 'Kamar Mandi Bersama\r\nKipas Angin\r\nPerlengkapan Mandi\r\nSarapan Pagi\r\nTelevisi\r\nWifi Area', 'Homestay Molly dapat menjadi pilihan Sobat Kajii saat singgah di Dewi Kajii. Homestay yang dimiliki oleh Laras Ismayadi atau yang sering dipanggil dengan Mas Maya ini berlokasi di Kadisoro RT 03, Gilangharjo, Pandak, Bantul, D.I Yogyakarta. Menyediakan dua buah kamar yang dapat ditempati ketika singgah di Dewi Kajii yang tentunya dengan harga yang terjangkau. Mulai dari Rp150.000 per malam (max 2 orang) hingga Rp200.000 per malam (max 4 orang) Sobat Kajii sudah dapat bermalam di homestay ini. Homestay milik Mas Maya ini menyediakan fasilitas berupa kamar mandi pribadi, peralatan mandi, kasur, almari, kipas angin, tempat shalat, perlengkapan P3K, tempat sampah, dan tempat parkir.', '-', 250000),
(24, 'Homestay Channa', 'uploads/homestay/666a8b966d47e.jpeg,uploads/homestay/666a8b966f5c9.png,uploads/homestay/666a8b9670967.JPG', 'Kamar Mandi Bersama\r\nKipas Angin\r\nPerlengkapan Mandi\r\nSarapan Pagi\r\nTelevisi\r\nWifi Area', 'Homestay Molly dapat menjadi pilihan Sobat Kajii saat singgah di Dewi Kajii. Homestay yang dimiliki oleh Laras Ismayadi atau yang sering dipanggil dengan Mas Maya ini berlokasi di Kadisoro RT 03, Gilangharjo, Pandak, Bantul, D.I Yogyakarta. Menyediakan dua buah kamar yang dapat ditempati ketika singgah di Dewi Kajii yang tentunya dengan harga yang terjangkau. Mulai dari Rp150.000 per malam (max 2 orang) hingga Rp200.000 per malam (max 4 orang) Sobat Kajii sudah dapat bermalam di homestay ini. Homestay milik Mas Maya ini menyediakan fasilitas berupa kamar mandi pribadi, peralatan mandi, kasur, almari, kipas angin, tempat shalat, perlengkapan P3K, tempat sampah, dan tempat parkir.', '-', 300000);

-- --------------------------------------------------------

--
-- Table structure for table `tb_ikan_hias`
--

CREATE TABLE `tb_ikan_hias` (
  `id_ikan_hias` int(11) NOT NULL,
  `nama` text NOT NULL,
  `gambar` text NOT NULL,
  `deskripsi` text NOT NULL,
  `perawatan` text NOT NULL,
  `harga` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_ikan_hias`
--

INSERT INTO `tb_ikan_hias` (`id_ikan_hias`, `nama`, `gambar`, `deskripsi`, `perawatan`, `harga`) VALUES
(15, 'Ikan Guppy', 'uploads/ikan-hias/666a8d8295d2d.jpg,uploads/ikan-hias/666a8d8296f97.jpg,uploads/ikan-hias/666a8d829844e.jpg', 'lorem ipsum dolr sit amet', 'Akarium berukuran minimal 40 liter, Suhu ideal antara 24-28°C, pH air antara 6.8-7.8, Gunakan sistem filtrasi yang baik untuk menjaga kualitas air', 20000),
(16, 'Ikan Molly', 'uploads/ikan-hias/666a8e18b7895.jpeg,uploads/ikan-hias/666a8e18b93e2.jpg,uploads/ikan-hias/666a8e18bac92.jpg', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'Akarium berukuran minimal 40 liter, Suhu ideal antara 24-28°C, pH air antara 6.8-7.8, Gunakan sistem filtrasi yang baik untuk menjaga kualitas air', 16000),
(17, 'Ikan Channa', 'uploads/ikan-hias/666a8f0839621.jpg,uploads/ikan-hias/666a8f083aad3.jpg,uploads/ikan-hias/666a8f083b869.jpg', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'Akarium berukuran minimal 40 liter, Suhu ideal antara 24-28°C, pH air antara 6.8-7.8, Gunakan sistem filtrasi yang baik untuk menjaga kualitas air', 300000),
(18, 'Ikan Arwana', 'uploads/ikan-hias/666a8f8b70bb6.jpg,uploads/ikan-hias/666a8f8b73ce6.jpeg,uploads/ikan-hias/666a8f8b750c9.jpeg', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 200000),
(19, 'Ikan Golden Fish', 'uploads/ikan-hias/666a910756cda.JPG,uploads/ikan-hias/666a910759e74.JPG,uploads/ikan-hias/666a91075e9ba.JPG', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'lore, ipsum, dolor, sit, amet', 34000);

-- --------------------------------------------------------

--
-- Table structure for table `tb_jenis_booking`
--

CREATE TABLE `tb_jenis_booking` (
  `id_jenis` int(11) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `harga` int(11) NOT NULL,
  `gambar` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_jenis_booking`
--

INSERT INTO `tb_jenis_booking` (`id_jenis`, `nama`, `harga`, `gambar`) VALUES
(54, 'Makanan Khas Dewi Kajii', 25000, 'uploads/hiburan/666a88c693d45.jpeg'),
(55, 'Bersepeda', 10000, 'uploads/hiburan/666a88eb2a7be.JPG'),
(56, 'Homestay Guppy', 200000, 'uploads/homestay/666a8a1e33923.jpg'),
(57, 'Homestay Platy', 200000, 'uploads/homestay/666a8a795ba82.jpg'),
(58, 'Homestay Molly', 250000, 'uploads/homestay/666a8b4bb1a77.jpg'),
(59, 'Homestay Channa', 300000, 'uploads/homestay/666a8b966d47e.jpeg');

-- --------------------------------------------------------

--
-- Table structure for table `tb_kegiatan`
--

CREATE TABLE `tb_kegiatan` (
  `id_kegiatan` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `gambar` text NOT NULL,
  `harga` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_kegiatan`
--

INSERT INTO `tb_kegiatan` (`id_kegiatan`, `judul`, `gambar`, `harga`) VALUES
(10, 'Reog Ria Kelana', 'uploads/kegiatan/661e4b853d387.jpg', 20000),
(11, 'Pentas Wayang', 'uploads/kegiatan/661e4b9445dcc.jpg', 20000),
(12, 'Senja di Bulak Kadisoro', 'uploads/kegiatan/661e4ba353343.png', 25000),
(13, 'Budi Daya Ikan Hias', 'uploads/kegiatan/666a7f48912d5.JPG', 20000);

-- --------------------------------------------------------

--
-- Table structure for table `tb_kolam_ikan`
--

CREATE TABLE `tb_kolam_ikan` (
  `id_kolam` int(11) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `jenis_ikan` text NOT NULL,
  `deskripsi` text NOT NULL,
  `gambar` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_kolam_ikan`
--

INSERT INTO `tb_kolam_ikan` (`id_kolam`, `nama`, `jenis_ikan`, `deskripsi`, `gambar`) VALUES
(9, 'Kolam Ikan Pak A', 'guppy, arwana, molly, platy,', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'uploads/kolam-ikan/666a90c7659d0.JPG,uploads/kolam-ikan/666a90c76e6fa.JPG,uploads/kolam-ikan/666a90c772800.JPG'),
(10, 'Kolam Pak B', 'guppy, platy, arwana, dll', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'uploads/kolam-ikan/666a91e845980.png,uploads/kolam-ikan/666a91e846b3b.jpg,uploads/kolam-ikan/666a91e8477b0.jpeg'),
(11, 'Kolam Pak C', 'lorem, ipsum, dolor, sit, amet', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'uploads/kolam-ikan/666a9368a093a.jpg,uploads/kolam-ikan/666a9368a4963.jpg,uploads/kolam-ikan/666a9368a90fa.jpg'),
(12, 'Kolam Pak D', 'lorem, ipsum, dolor, sit, amet', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'uploads/kolam-ikan/666a9391910c7.jpg,uploads/kolam-ikan/666a93919240d.jpg,uploads/kolam-ikan/666a939194386.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `tb_paket_wisata`
--

CREATE TABLE `tb_paket_wisata` (
  `id_paket_wisata` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `fasilitas` text NOT NULL,
  `waktu` varchar(115) NOT NULL,
  `harga` int(11) NOT NULL,
  `gambar` text NOT NULL,
  `promo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_paket_wisata`
--

INSERT INTO `tb_paket_wisata` (`id_paket_wisata`, `judul`, `fasilitas`, `waktu`, `harga`, `gambar`, `promo`) VALUES
(9, 'Paket A -Live In Edukasi - Budidaya Ikan Hias', '2 Kamar Mandi, 1 Kamar Tidur', '3 Hari 2 Malam', 1500000, 'uploads/paket-wisata/666a7fb3e6feb.jpg', 0),
(10, 'Paket B - Live In Edukasi - Bisnis Ikan Hias', '1 Kamar Mandi, 1 Kamar Tidur, Wifi, Sepeda', '3 Hari 2 Malam', 2000000, 'uploads/paket-wisata/666a7ff10fae0.JPG', 0),
(11, 'Edukasi Wayang', '1 Kamar Mandi, 1 Kamar Tidur, Sepeda', '2 Hari 1 Malam', 2000000, 'uploads/paket-wisata/666a8030bbe7f.JPG', 1500000),
(12, 'Paket B - Visit Farm Dewasa/Regular', '1 Kamar, 2 Sepeda', '2 Hari 1 Malam', 1500000, 'uploads/paket-wisata/666a80932cc74.jpeg', 0);

-- --------------------------------------------------------

--
-- Table structure for table `tb_promo`
--

CREATE TABLE `tb_promo` (
  `id_promo` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `gambar` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_promo`
--

INSERT INTO `tb_promo` (`id_promo`, `judul`, `gambar`) VALUES
(13, 'promo homestay', '/uploads/promo/6669a7d0a6a20.jpg'),
(14, 'KONTEST IKAN', '/uploads/promo/6669adac3ce7d.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `tb_tentang_kami`
--

CREATE TABLE `tb_tentang_kami` (
  `id` int(11) NOT NULL,
  `deskripsi` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_tentang_kami`
--

INSERT INTO `tb_tentang_kami` (`id`, `deskripsi`) VALUES
(1, 'Desa Wisata Kadisoro Nyawiji Dadi Siji yang akrab disebut Dewi Kajii berlokasi di Desa Gilangharjo Kapanewon Pandak Kabupaten Bantul Provinsi Daerah Istimewa Yogyakarta. Dengan luas wilayah 1780 Ha, Kadisoro dihuni oleh 1770 jiwa dengan 8 RT. Desa Wisata Kajii berbatasan langsung dengan Kampung Wisata Santan di sebelah Barat yang dipisahkan oleh Sungai Bedog. Sementara di sebelah Selatan berbatasan dengan Kampung Jodog dan di sebelah Utara berbatasan dengan Desa Ringinharjo, Bantul. Di sebelah timur desa wisata Kajii berbatasan dengan kampung Kadirojo, Ringinharjo, Bantul. Mata pencaharian warga didominasi oleh petani, pembudidaya ikan, wiraswasta.');

-- --------------------------------------------------------

--
-- Table structure for table `tb_timeline`
--

CREATE TABLE `tb_timeline` (
  `id_timeline` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `tanggal` date NOT NULL,
  `deskripsi` text NOT NULL,
  `gambar` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_timeline`
--

INSERT INTO `tb_timeline` (`id_timeline`, `judul`, `tanggal`, `deskripsi`, `gambar`) VALUES
(9, 'Perencanaan Desa Wisata Kajii', '2020-02-02', 'melakukan identifikasi potensi wisata, keunikan, dan daya tarik utama desa, Membentuk tim kerja yang terdiri dari perwakilan masyarakat, ahli pariwisata, dan pemerintah daerah.', 'uploads/timeline/666a78cab52bb.jpg'),
(10, 'Pengembangan Konsep dan Rencana Bisnis', '2020-05-18', 'Menyusun rencana bisnis yang mencakup proyeksi biaya, pendapatan, dan sumber pendanaan.', 'uploads/timeline/666a7918512bd.jpeg'),
(11, 'Pembangunan Fasilitas Dasar', '2020-09-07', 'Membangun fasilitas dasar seperti jalan, sanitasi, dan jaringan listrik.', 'uploads/timeline/666a7950b93e8.jpeg'),
(12, 'Peresmian Desa Kajii', '2020-05-09', 'Mengadakan acara pembukaan resmi desa wisata. Melakukan promosi lebih intensif melalui media sosial, kerjasama dengan agen perjalanan, dan partisipasi dalam pameran pariwisata.', 'uploads/timeline/666a7e1886a5f.jpeg');

-- --------------------------------------------------------

--
-- Table structure for table `tb_transaksi`
--

CREATE TABLE `tb_transaksi` (
  `id_transaksi` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_jenis` int(11) NOT NULL,
  `code_invoice` varchar(100) NOT NULL,
  `bukti_pembayaran` text NOT NULL,
  `status_check_in` enum('Sudah','Belum') NOT NULL,
  `check_in` date NOT NULL,
  `dibayarkan` int(11) NOT NULL,
  `status` enum('Lunas','DP','Process','Batal') NOT NULL,
  `created_at` date NOT NULL,
  `updated_at` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_transaksi`
--

INSERT INTO `tb_transaksi` (`id_transaksi`, `id_user`, `id_jenis`, `code_invoice`, `bukti_pembayaran`, `status_check_in`, `check_in`, `dibayarkan`, `status`, `created_at`, `updated_at`) VALUES
(9, 10, 38, 'asd', '', 'Belum', '2024-06-10', 0, 'Process', '2024-06-10', '0000-00-00'),
(10, 10, 42, 'aa', 'aa', 'Belum', '2024-06-10', 0, 'Process', '2024-06-10', '0000-00-00');

-- --------------------------------------------------------

--
-- Table structure for table `tb_ulasan`
--

CREATE TABLE `tb_ulasan` (
  `id_ulasan` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `ulasan` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_ulasan`
--

INSERT INTO `tb_ulasan` (`id_ulasan`, `id_user`, `ulasan`) VALUES
(7, 10, 'tgtgt'),
(8, 10, 'lorem ipsum');

-- --------------------------------------------------------

--
-- Table structure for table `tb_user`
--

CREATE TABLE `tb_user` (
  `id_user` int(11) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `email` varchar(50) NOT NULL,
  `no_telp` char(15) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `profil` text NOT NULL,
  `token` text NOT NULL,
  `pass` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_user`
--

INSERT INTO `tb_user` (`id_user`, `nama`, `email`, `no_telp`, `password`, `username`, `profil`, `token`, `pass`) VALUES
(10, 'Parman', 'test@gmail.com', '087387312983', '$2y$12$Ji8nxvzXaZzVkqbbe6VLTO3FMCArgRXe5398pRic8aVA.EVSH/Gyy', 'Testing', 'assets/image/avatar-1.png', '', 'ASDASDASD@123');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_admin`
--
ALTER TABLE `tb_admin`
  ADD PRIMARY KEY (`id_admin`);

--
-- Indexes for table `tb_artikel`
--
ALTER TABLE `tb_artikel`
  ADD PRIMARY KEY (`id_artikel`);

--
-- Indexes for table `tb_faq`
--
ALTER TABLE `tb_faq`
  ADD PRIMARY KEY (`id_faq`);

--
-- Indexes for table `tb_hiburan`
--
ALTER TABLE `tb_hiburan`
  ADD PRIMARY KEY (`id_hiburan`);

--
-- Indexes for table `tb_homestay`
--
ALTER TABLE `tb_homestay`
  ADD PRIMARY KEY (`id_homestay`);

--
-- Indexes for table `tb_ikan_hias`
--
ALTER TABLE `tb_ikan_hias`
  ADD PRIMARY KEY (`id_ikan_hias`);

--
-- Indexes for table `tb_jenis_booking`
--
ALTER TABLE `tb_jenis_booking`
  ADD PRIMARY KEY (`id_jenis`);

--
-- Indexes for table `tb_kegiatan`
--
ALTER TABLE `tb_kegiatan`
  ADD PRIMARY KEY (`id_kegiatan`);

--
-- Indexes for table `tb_kolam_ikan`
--
ALTER TABLE `tb_kolam_ikan`
  ADD PRIMARY KEY (`id_kolam`);

--
-- Indexes for table `tb_paket_wisata`
--
ALTER TABLE `tb_paket_wisata`
  ADD PRIMARY KEY (`id_paket_wisata`);

--
-- Indexes for table `tb_promo`
--
ALTER TABLE `tb_promo`
  ADD PRIMARY KEY (`id_promo`);

--
-- Indexes for table `tb_tentang_kami`
--
ALTER TABLE `tb_tentang_kami`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_timeline`
--
ALTER TABLE `tb_timeline`
  ADD PRIMARY KEY (`id_timeline`);

--
-- Indexes for table `tb_transaksi`
--
ALTER TABLE `tb_transaksi`
  ADD PRIMARY KEY (`id_transaksi`),
  ADD KEY `id_user` (`id_user`,`id_jenis`),
  ADD KEY `id_jenis` (`id_jenis`);

--
-- Indexes for table `tb_ulasan`
--
ALTER TABLE `tb_ulasan`
  ADD PRIMARY KEY (`id_ulasan`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `tb_user`
--
ALTER TABLE `tb_user`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tb_admin`
--
ALTER TABLE `tb_admin`
  MODIFY `id_admin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tb_artikel`
--
ALTER TABLE `tb_artikel`
  MODIFY `id_artikel` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `tb_faq`
--
ALTER TABLE `tb_faq`
  MODIFY `id_faq` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tb_hiburan`
--
ALTER TABLE `tb_hiburan`
  MODIFY `id_hiburan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tb_homestay`
--
ALTER TABLE `tb_homestay`
  MODIFY `id_homestay` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `tb_ikan_hias`
--
ALTER TABLE `tb_ikan_hias`
  MODIFY `id_ikan_hias` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `tb_jenis_booking`
--
ALTER TABLE `tb_jenis_booking`
  MODIFY `id_jenis` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT for table `tb_kegiatan`
--
ALTER TABLE `tb_kegiatan`
  MODIFY `id_kegiatan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `tb_kolam_ikan`
--
ALTER TABLE `tb_kolam_ikan`
  MODIFY `id_kolam` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `tb_paket_wisata`
--
ALTER TABLE `tb_paket_wisata`
  MODIFY `id_paket_wisata` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `tb_promo`
--
ALTER TABLE `tb_promo`
  MODIFY `id_promo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `tb_tentang_kami`
--
ALTER TABLE `tb_tentang_kami`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tb_timeline`
--
ALTER TABLE `tb_timeline`
  MODIFY `id_timeline` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `tb_transaksi`
--
ALTER TABLE `tb_transaksi`
  MODIFY `id_transaksi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tb_ulasan`
--
ALTER TABLE `tb_ulasan`
  MODIFY `id_ulasan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tb_user`
--
ALTER TABLE `tb_user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tb_transaksi`
--
ALTER TABLE `tb_transaksi`
  ADD CONSTRAINT `tb_transaksi_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `tb_user` (`id_user`),
  ADD CONSTRAINT `tb_transaksi_ibfk_2` FOREIGN KEY (`id_jenis`) REFERENCES `tb_jenis_booking` (`id_jenis`);

--
-- Constraints for table `tb_ulasan`
--
ALTER TABLE `tb_ulasan`
  ADD CONSTRAINT `tb_ulasan_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `tb_user` (`id_user`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

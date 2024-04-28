-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 28 Apr 2024 pada 17.41
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
-- Struktur dari tabel `tb_admin`
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
-- Dumping data untuk tabel `tb_admin`
--

INSERT INTO `tb_admin` (`id_admin`, `nama`, `no_telp`, `email`, `alamat`, `password`) VALUES
(8, 'Administrator', '0888888888', 'admin@gmail.com', 'asdasdnadisadaiodjasdads', '$2y$12$exMM4KUDU7NfSsrDT/3pre20o5JnFFZiZSWp1PzGMobn4fKvimlN6');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_artikel`
--

CREATE TABLE `tb_artikel` (
  `id_artikel` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `gambar` text NOT NULL,
  `deskripsi` text NOT NULL,
  `dibuat` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tb_artikel`
--

INSERT INTO `tb_artikel` (`id_artikel`, `judul`, `gambar`, `deskripsi`, `dibuat`) VALUES
(8, 'asdas', 'uploads/artikel/662177266ee29.jpg,uploads/artikel/662177266f2d1.png,uploads/artikel/6621772671302.png', 'adsdefasdasdasdasasd', '2024-04-19');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_faq`
--

CREATE TABLE `tb_faq` (
  `id_faq` int(11) NOT NULL,
  `pertanyaan` text NOT NULL,
  `jawaban` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_hiburan`
--

CREATE TABLE `tb_hiburan` (
  `id_hiburan` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `gambar` text NOT NULL,
  `harga` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_homestay`
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
-- Dumping data untuk tabel `tb_homestay`
--

INSERT INTO `tb_homestay` (`id_homestay`, `judul`, `gambar`, `fasilitas`, `deskripsi`, `peraturan`, `harga`) VALUES
(15, 'Homestay 1', 'uploads/homestay/661e4bd6d24d3.jpg,uploads/homestay/661e4bd6d2b65.png,uploads/homestay/661e4bd6d3312.png', 'a,b,c,d', 'Lorem Ipsum', 'a,b,c,d,e', 3000000),
(16, 'Homestay  2', 'uploads/homestay/661e4bef0b698.jpg,uploads/homestay/661e4bef0bb56.png,uploads/homestay/661e4bef0c5da.png', 'a,b,c,d', 'Lorem Ipsum', 'a,b,c,d', 2000000),
(17, 'Homestay  3', 'uploads/homestay/661e4c081ca6d.jpg,uploads/homestay/661e4c081ce4e.png,uploads/homestay/661e4c081d98e.png', 'a,b,c,d,e', 'Lorem Ipsum', 'a,b,c,d,e', 1500000);

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_ikan_hias`
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
-- Dumping data untuk tabel `tb_ikan_hias`
--

INSERT INTO `tb_ikan_hias` (`id_ikan_hias`, `nama`, `gambar`, `deskripsi`, `perawatan`, `harga`) VALUES
(11, 'sad', 'uploads/ikan-hias/66216e37846ff.jpg,uploads/ikan-hias/66216e37850eb.png,uploads/ikan-hias/66216e378541b.png', 'asd', 'asd', 11111),
(12, 'asd', 'uploads/ikan-hias/662172fbb3a46.png,uploads/ikan-hias/662172fbb5455.jpg,uploads/ikan-hias/662172fbb5795.png', 'asd', 'asd', 12222222),
(13, 'asdasdd', 'uploads/ikan-hias/6621734959c61.png,uploads/ikan-hias/662173495a0c9.jpg,uploads/ikan-hias/662173495a3c7.png', 'asd', 'asddasd', 11222222),
(14, 'fsfdsd', 'uploads/ikan-hias/662173b39396b.jpg,uploads/ikan-hias/662173b393d16.png,uploads/ikan-hias/662173b3944f1.png', 'assfsf', 'asd', 111111);

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_jenis_booking`
--

CREATE TABLE `tb_jenis_booking` (
  `id_jenis` int(11) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `harga` int(11) NOT NULL,
  `gambar` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tb_jenis_booking`
--

INSERT INTO `tb_jenis_booking` (`id_jenis`, `nama`, `harga`, `gambar`) VALUES
(33, 'Paket 1', 1500000, ''),
(34, 'Paket 2', 1000000, ''),
(35, 'Paket 3', 2000000, ''),
(36, 'Kegiatan 1', 30000, ''),
(37, 'Kegiatan 2', 20000, ''),
(38, 'Kegiatan 3', 25000, ''),
(39, 'Homestay 1', 3000000, ''),
(40, 'Homestay  2', 2000000, ''),
(41, 'Homestay  3', 1500000, '');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_kegiatan`
--

CREATE TABLE `tb_kegiatan` (
  `id_kegiatan` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `gambar` text NOT NULL,
  `harga` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tb_kegiatan`
--

INSERT INTO `tb_kegiatan` (`id_kegiatan`, `judul`, `gambar`, `harga`) VALUES
(10, 'Kegiatan 1', 'uploads/kegiatan/661e4b853d387.jpg', 30000),
(11, 'Kegiatan 2', 'uploads/kegiatan/661e4b9445dcc.jpg', 20000),
(12, 'Kegiatan 3', 'uploads/kegiatan/661e4ba353343.png', 25000);

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_kolam_ikan`
--

CREATE TABLE `tb_kolam_ikan` (
  `id_kolam` int(11) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `jenis_ikan` text NOT NULL,
  `deskripsi` text NOT NULL,
  `gambar` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tb_kolam_ikan`
--

INSERT INTO `tb_kolam_ikan` (`id_kolam`, `nama`, `jenis_ikan`, `deskripsi`, `gambar`) VALUES
(6, 'as', 'asd', 'as', 'uploads/kolam-ikan/6621748864f72.jpg,uploads/kolam-ikan/6621748865299.png,uploads/kolam-ikan/66217488655b1.png'),
(7, 'adaw', 'asd', 'asdd', 'uploads/kolam-ikan/6621749314014.png,uploads/kolam-ikan/6621749314840.png,uploads/kolam-ikan/6621749314a4f.jpg'),
(8, 'sdasdasdasdasd', 'ddadsada', 'asdsadas', 'uploads/kolam-ikan/662174a0997e0.jpg,uploads/kolam-ikan/662174a099a91.png,uploads/kolam-ikan/662174a099cf2.png');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_paket_wisata`
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
-- Dumping data untuk tabel `tb_paket_wisata`
--

INSERT INTO `tb_paket_wisata` (`id_paket_wisata`, `judul`, `fasilitas`, `waktu`, `harga`, `gambar`, `promo`) VALUES
(9, 'Paket 1', '2 Kamar Mandi, 1 Kamar Tidur', '1 Hari 1 Malam', 1500000, 'uploads/paket-wisata/661e4b13f31ce.png', 0),
(10, 'Paket 2', '1 Kamar Mandi, 1 Kamar Tidur', '1 Hari 1 Malam', 1000000, 'uploads/paket-wisata/661e4b54849dd.jpg', 0),
(11, 'Paket 3', '1 Kamar Mandi, 1 Kamar Tidur', '1 Hari 1 Malam', 2000000, 'uploads/paket-wisata/661e4b65cd00d.jpg', 0);

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_promo`
--

CREATE TABLE `tb_promo` (
  `id_promo` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `gambar` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tb_promo`
--

INSERT INTO `tb_promo` (`id_promo`, `judul`, `gambar`) VALUES
(10, 'awiowadawoda', '/uploads/promo/662e251e96838.jpg');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_tentang_kami`
--

CREATE TABLE `tb_tentang_kami` (
  `id` int(11) NOT NULL,
  `deskripsi` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tb_tentang_kami`
--

INSERT INTO `tb_tentang_kami` (`id`, `deskripsi`) VALUES
(1, 'asdadad<br>\r\nadasd<br>\r\nasd<br>\r\nasda');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_timeline`
--

CREATE TABLE `tb_timeline` (
  `id_timeline` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `tanggal` date NOT NULL,
  `deskripsi` text NOT NULL,
  `gambar` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_transaksi`
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
-- Dumping data untuk tabel `tb_transaksi`
--

INSERT INTO `tb_transaksi` (`id_transaksi`, `id_user`, `id_jenis`, `code_invoice`, `bukti_pembayaran`, `status_check_in`, `check_in`, `dibayarkan`, `status`, `created_at`, `updated_at`) VALUES
(8, 6, 33, 'INV/27042024/662c80e628222', '', 'Belum', '2024-03-03', 1500000, 'Lunas', '2024-04-27', '2024-04-28');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_ulasan`
--

CREATE TABLE `tb_ulasan` (
  `id_ulasan` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `ulasan` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tb_ulasan`
--

INSERT INTO `tb_ulasan` (`id_ulasan`, `id_user`, `ulasan`) VALUES
(5, 3, 'asdasdasdd');

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
(3, 'asd', 'aaa@gmail.com', '088221629812', '$2y$12$/JgwFctEDHCOUufGi9DymODr9HpbFmXPzNbVLeefR2Jc3HbkXTjoC', 'asdasd', '', ''),
(6, 'asdsdadasdasdasd', 'aabs@gmail.com', '123', '$2y$12$LqvFhMqvBVmqZKTaS89yb.jqjsYrj2d1rwhm46dvVEemUmNHW.wWy', 'asdasd', 'assets/image/avatar-1.png', 'tpcFWKYnAY02V1RD9KxSky9YL2p0QVJNTWdDQkN4WXE2aG1vcnpWVkJMNFRNblNNS0NGY2F6Ump3ZVNHUTE0UklmRHhSMmVQSEpmc0c5VU0='),
(7, 'aaa', 'asdadasdadasda@gmail.com', '123456764323', '$2y$12$ibqro7oqnLIJRJdsi8B9Y.HENC0kU3wXqcgCdOq8Q9XZdoH.q6wdG', 'aaasdasd', 'assets/image/avatar-1.png', ''),
(8, 'aaa', 'a@gmail.com', '1231232331', '$2y$12$GjjEUw04JxUyZKqioYVbs.aZynuwKrU2vhg4zJp30an6AGeYKNZ.a', 'aaaaaa', 'assets/image/avatar-1.png', ''),
(9, 'aaa', 'aasdadad@gmail.com', '1231232331', '$2y$12$SG6bh/zN0.BfJ4qOyu8Wi.BUXQMAxunEupII5YKzH55Y5me36hiUW', 'aaaaaa', 'assets/image/avatar-1.png', '');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `tb_admin`
--
ALTER TABLE `tb_admin`
  ADD PRIMARY KEY (`id_admin`);

--
-- Indeks untuk tabel `tb_artikel`
--
ALTER TABLE `tb_artikel`
  ADD PRIMARY KEY (`id_artikel`);

--
-- Indeks untuk tabel `tb_faq`
--
ALTER TABLE `tb_faq`
  ADD PRIMARY KEY (`id_faq`);

--
-- Indeks untuk tabel `tb_hiburan`
--
ALTER TABLE `tb_hiburan`
  ADD PRIMARY KEY (`id_hiburan`);

--
-- Indeks untuk tabel `tb_homestay`
--
ALTER TABLE `tb_homestay`
  ADD PRIMARY KEY (`id_homestay`);

--
-- Indeks untuk tabel `tb_ikan_hias`
--
ALTER TABLE `tb_ikan_hias`
  ADD PRIMARY KEY (`id_ikan_hias`);

--
-- Indeks untuk tabel `tb_jenis_booking`
--
ALTER TABLE `tb_jenis_booking`
  ADD PRIMARY KEY (`id_jenis`);

--
-- Indeks untuk tabel `tb_kegiatan`
--
ALTER TABLE `tb_kegiatan`
  ADD PRIMARY KEY (`id_kegiatan`);

--
-- Indeks untuk tabel `tb_kolam_ikan`
--
ALTER TABLE `tb_kolam_ikan`
  ADD PRIMARY KEY (`id_kolam`);

--
-- Indeks untuk tabel `tb_paket_wisata`
--
ALTER TABLE `tb_paket_wisata`
  ADD PRIMARY KEY (`id_paket_wisata`);

--
-- Indeks untuk tabel `tb_promo`
--
ALTER TABLE `tb_promo`
  ADD PRIMARY KEY (`id_promo`);

--
-- Indeks untuk tabel `tb_tentang_kami`
--
ALTER TABLE `tb_tentang_kami`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `tb_timeline`
--
ALTER TABLE `tb_timeline`
  ADD PRIMARY KEY (`id_timeline`);

--
-- Indeks untuk tabel `tb_transaksi`
--
ALTER TABLE `tb_transaksi`
  ADD PRIMARY KEY (`id_transaksi`),
  ADD KEY `id_user` (`id_user`,`id_jenis`),
  ADD KEY `id_jenis` (`id_jenis`);

--
-- Indeks untuk tabel `tb_ulasan`
--
ALTER TABLE `tb_ulasan`
  ADD PRIMARY KEY (`id_ulasan`),
  ADD KEY `id_user` (`id_user`);

--
-- Indeks untuk tabel `tb_user`
--
ALTER TABLE `tb_user`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `tb_admin`
--
ALTER TABLE `tb_admin`
  MODIFY `id_admin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT untuk tabel `tb_artikel`
--
ALTER TABLE `tb_artikel`
  MODIFY `id_artikel` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT untuk tabel `tb_faq`
--
ALTER TABLE `tb_faq`
  MODIFY `id_faq` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `tb_hiburan`
--
ALTER TABLE `tb_hiburan`
  MODIFY `id_hiburan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `tb_homestay`
--
ALTER TABLE `tb_homestay`
  MODIFY `id_homestay` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT untuk tabel `tb_ikan_hias`
--
ALTER TABLE `tb_ikan_hias`
  MODIFY `id_ikan_hias` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT untuk tabel `tb_jenis_booking`
--
ALTER TABLE `tb_jenis_booking`
  MODIFY `id_jenis` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT untuk tabel `tb_kegiatan`
--
ALTER TABLE `tb_kegiatan`
  MODIFY `id_kegiatan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT untuk tabel `tb_kolam_ikan`
--
ALTER TABLE `tb_kolam_ikan`
  MODIFY `id_kolam` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT untuk tabel `tb_paket_wisata`
--
ALTER TABLE `tb_paket_wisata`
  MODIFY `id_paket_wisata` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT untuk tabel `tb_promo`
--
ALTER TABLE `tb_promo`
  MODIFY `id_promo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `tb_tentang_kami`
--
ALTER TABLE `tb_tentang_kami`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `tb_timeline`
--
ALTER TABLE `tb_timeline`
  MODIFY `id_timeline` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `tb_transaksi`
--
ALTER TABLE `tb_transaksi`
  MODIFY `id_transaksi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT untuk tabel `tb_ulasan`
--
ALTER TABLE `tb_ulasan`
  MODIFY `id_ulasan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `tb_user`
--
ALTER TABLE `tb_user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `tb_transaksi`
--
ALTER TABLE `tb_transaksi`
  ADD CONSTRAINT `tb_transaksi_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `tb_user` (`id_user`),
  ADD CONSTRAINT `tb_transaksi_ibfk_2` FOREIGN KEY (`id_jenis`) REFERENCES `tb_jenis_booking` (`id_jenis`);

--
-- Ketidakleluasaan untuk tabel `tb_ulasan`
--
ALTER TABLE `tb_ulasan`
  ADD CONSTRAINT `tb_ulasan_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `tb_user` (`id_user`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

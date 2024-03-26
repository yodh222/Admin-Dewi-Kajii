-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 26 Mar 2024 pada 18.28
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
(8, 'Administrator', '0888888888', 'admin@gmail.com', 'asdasdnadisadaiodj', '$2y$12$fkyJDWk8EY9Z8TSEFJNjHeXkaygBMPSchAJ8XqN28MP/hgcMi7ZlG');

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
(1, 'Lerem Ipsum Ambatukam', 'https://dlh.banyuasinkab.go.id/wp-content/uploads/sites/120/2020/10/WhatsApp-Image-2020-10-02-at-14.00.12-3.jpeg', 'asdghjgfxbcxswretyklo;\'/\'/;\'[;/.,mnbfdsaz', '2024-03-22'),
(2, 'Lorem IpSum Ambatron Ambatukam', 'https://dlh.banyuasinkab.go.id/wp-content/uploads/sites/120/2020/10/WhatsApp-Image-2020-10-02-at-14.00.12-3.jpeg', 'asdfbxfbgssgsfazaasdasdasdasdasdasd', '2024-03-22'),
(3, 'asdasd', 'https://dlh.banyuasinkab.go.id/wp-content/uploads/sites/120/2020/10/WhatsApp-Image-2020-10-02-at-14.00.12-3.jpeg', 'as', '2024-03-22'),
(4, 'asd', '/uploads/artikel/65fe8f3c29106.jpg', 'asd', '2024-03-23');

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

--
-- Dumping data untuk tabel `tb_hiburan`
--

INSERT INTO `tb_hiburan` (`id_hiburan`, `judul`, `gambar`, `harga`) VALUES
(1, 'adsad', '', 0);

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_homestay`
--

CREATE TABLE `tb_homestay` (
  `id_homestay` int(11) NOT NULL,
  `nama` varchar(115) NOT NULL,
  `gambar` text NOT NULL,
  `fasilitas` text NOT NULL,
  `deskripsi` text NOT NULL,
  `peraturan` text NOT NULL,
  `harga` int(11) NOT NULL,
  `promo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tb_homestay`
--

INSERT INTO `tb_homestay` (`id_homestay`, `nama`, `gambar`, `fasilitas`, `deskripsi`, `peraturan`, `harga`, `promo`) VALUES
(1, 'Homestay 1', 'https://www.yogyes.com/id/yogyakarta-hotel/guest-house/athaya-homestay/1.jpg,https://www.yogyes.com/id/yogyakarta-hotel/guest-house/athaya-homestay/12.jpg,https://www.yogyes.com/id/yogyakarta-hotel/guest-house/handida-homestay/1.jpg,https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.brighton.co.id%2Fabout%2Farticles-all%2Finspirasi-desain-homestay-minimalis-untuk-ide-bisnis&psig=AOvVaw0a1Vro3OMlqzTLF9fgMAgM&ust=1710176507682000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCMCVt5KW6oQDFQAAAAAdAAAAABAS', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi, officiis perspiciatis. Quae excepturi vero perferendis, vitae perspiciatis quam est deleniti ex voluptas debitis, quod recusandae omnis cum iure dolores esse suscipit! Minima maiores id et nobis? Quo quod quidem nisi, laborum sunt nesciunt! Autem eius dicta labore voluptates asperiores tempore laborum similique, magni inventore ipsam cum mollitia. Repellat sapiente cupiditate magni cumque vero iure, mollitia maxime fugiat nam tempore praesentium sequi itaque sed repellendus odit accusamus laboriosam atque. Alias dolore placeat provident. Quasi a animi eligendi minima enim ex dolore adipisci! Dolorem officia esse sint quidem! Sequi totam molestiae distinctio?', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi, officiis perspiciatis. Quae excepturi vero perferendis, vitae perspiciatis quam est deleniti ex voluptas debitis, quod recusandae omnis cum iure dolores esse suscipit! Minima maiores id et nobis? Quo quod quidem nisi, laborum sunt nesciunt! Autem eius dicta labore voluptates asperiores tempore laborum similique, magni inventore ipsam cum mollitia. Repellat sapiente cupiditate magni cumque vero iure, mollitia maxime fugiat nam tempore praesentium sequi itaque sed repellendus odit accusamus laboriosam atque. Alias dolore placeat provident. Quasi a animi eligendi minima enim ex dolore adipisci! Dolorem officia esse sint quidem! Sequi totam molestiae distinctio?', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi, officiis perspiciatis. Quae excepturi vero perferendis, vitae perspiciatis quam est deleniti ex voluptas debitis, quod recusandae omnis cum iure dolores esse suscipit! Minima maiores id et nobis? Quo quod quidem nisi, laborum sunt nesciunt! Autem eius dicta labore voluptates asperiores tempore laborum similique, magni inventore ipsam cum mollitia. Repellat sapiente cupiditate magni cumque vero iure, mollitia maxime fugiat nam tempore praesentium sequi itaque sed repellendus odit accusamus laboriosam atque. Alias dolore placeat provident. Quasi a animi eligendi minima enim ex dolore adipisci! Dolorem officia esse sint quidem! Sequi totam molestiae distinctio?', 10000, 1000000);

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_ikan_hias`
--

CREATE TABLE `tb_ikan_hias` (
  `id_ikan_hias` int(11) NOT NULL,
  `judul` text NOT NULL,
  `gambar` text NOT NULL,
  `deskripsi` text NOT NULL,
  `perawatan` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_jenis_booking`
--

CREATE TABLE `tb_jenis_booking` (
  `id_jenis` int(11) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `harga` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tb_jenis_booking`
--

INSERT INTO `tb_jenis_booking` (`id_jenis`, `nama`, `harga`) VALUES
(1, 'a', 11);

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
(1, 'Lorem Ipsum Ambatron', 'https://dlh.banyuasinkab.go.id/wp-content/uploads/sites/120/2020/10/WhatsApp-Image-2020-10-02-at-14.00.12-3.jpeg', 20000),
(2, 'adasdadadasdadadasdads', 'https://dlh.banyuasinkab.go.id/wp-content/uploads/sites/120/2020/10/WhatsApp-Image-2020-10-02-at-14.00.12-3.jpeg', 30000),
(3, 'dasdasdasd', 'https://dlh.banyuasinkab.go.id/wp-content/uploads/sites/120/2020/10/WhatsApp-Image-2020-10-02-at-14.00.12-3.jpeg', 40000);

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
(1, 'asd', 'asd', 'asaqwwqwqeqweqwweqweqeqwe', 1111, '', 0);

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
(1, 'Coba', 'https://w.wallhaven.cc/full/we/wallhaven-werowr.png'),
(2, 'Coba Simpan', '/uploads/promo/66018f97314c8.png');

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
(1, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est ipsa illum fuga velit nam quam, optio, cupiditate labore aut ex assumenda a. Sequi repudiandae reprehenderit ipsam magnam dolor doloremque totam dolores quae, sed molestias hic eligendi nesciunt beatae iure labore qui mollitia odio alias eaque maxime voluptatum! Inventore nam ratione enim, facilis voluptas laudantium natus aspernatur, eius eligendi sint sed ullam, harum atque. Laudantium nam nostrum asperiores debitis laboriosam consectetur ipsum quisquam, inventore quam quas, possimus fugit sed iusto quo ratione rerum autem mollitia voluptates odio hic placeat dignissimos commodi rem? Possimus vel commodi optio deserunt. Omnis magni mollitia itaque!');

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

--
-- Dumping data untuk tabel `tb_timeline`
--

INSERT INTO `tb_timeline` (`id_timeline`, `judul`, `tanggal`, `deskripsi`, `gambar`) VALUES
(1, 'Pembukaan Desa Wisata Kajii ', '2024-03-09', 'DESKRIPSI SINGKAT. Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit.', '');

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
  `check_in` date NOT NULL,
  `dibayarkan` int(11) NOT NULL,
  `status` enum('Lunas','DP','Process','Batal') NOT NULL,
  `created_at` date NOT NULL,
  `updated_at` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tb_transaksi`
--

INSERT INTO `tb_transaksi` (`id_transaksi`, `id_user`, `id_jenis`, `code_invoice`, `bukti_pembayaran`, `check_in`, `dibayarkan`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '', 'aaaaa', '2024-03-12', 1, 'Process', '2024-03-09', '0000-00-00'),
(2, 1, 1, 'test', 'asd', '2024-03-12', 0, 'Process', '2024-03-09', '0000-00-00'),
(3, 1, 1, 'asgh', 'sadfdg', '2024-03-21', 111, 'Process', '2024-03-12', '0000-00-00');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_ulasan`
--

CREATE TABLE `tb_ulasan` (
  `id_ulasan` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `ulasan` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_user`
--

CREATE TABLE `tb_user` (
  `id_user` int(11) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `email` varchar(50) NOT NULL,
  `no_telp` char(11) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tb_user`
--

INSERT INTO `tb_user` (`id_user`, `nama`, `email`, `no_telp`, `password`, `username`) VALUES
(1, 'aaa', 'a@gmail.com', '1111', 'aaa', 'a');

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
  MODIFY `id_artikel` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `tb_faq`
--
ALTER TABLE `tb_faq`
  MODIFY `id_faq` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `tb_hiburan`
--
ALTER TABLE `tb_hiburan`
  MODIFY `id_hiburan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `tb_homestay`
--
ALTER TABLE `tb_homestay`
  MODIFY `id_homestay` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `tb_ikan_hias`
--
ALTER TABLE `tb_ikan_hias`
  MODIFY `id_ikan_hias` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `tb_jenis_booking`
--
ALTER TABLE `tb_jenis_booking`
  MODIFY `id_jenis` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `tb_kegiatan`
--
ALTER TABLE `tb_kegiatan`
  MODIFY `id_kegiatan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `tb_kolam_ikan`
--
ALTER TABLE `tb_kolam_ikan`
  MODIFY `id_kolam` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `tb_paket_wisata`
--
ALTER TABLE `tb_paket_wisata`
  MODIFY `id_paket_wisata` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `tb_promo`
--
ALTER TABLE `tb_promo`
  MODIFY `id_promo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT untuk tabel `tb_tentang_kami`
--
ALTER TABLE `tb_tentang_kami`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `tb_timeline`
--
ALTER TABLE `tb_timeline`
  MODIFY `id_timeline` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `tb_transaksi`
--
ALTER TABLE `tb_transaksi`
  MODIFY `id_transaksi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `tb_ulasan`
--
ALTER TABLE `tb_ulasan`
  MODIFY `id_ulasan` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `tb_user`
--
ALTER TABLE `tb_user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `tb_transaksi`
--
ALTER TABLE `tb_transaksi`
  ADD CONSTRAINT `tb_transaksi_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `tb_user` (`id_user`),
  ADD CONSTRAINT `tb_transaksi_ibfk_2` FOREIGN KEY (`id_jenis`) REFERENCES `tb_jenis_booking` (`id_jenis`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

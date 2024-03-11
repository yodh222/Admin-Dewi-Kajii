<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title')</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
    /* Style untuk header */
    header {
        background-color: #097804;
        color: white;
        padding: 30px;
        display: flex;
        /* Menjadikan header sebagai flex container */
        justify-content: space-between;
        /* Menjadikan logo dan ikon di kedua sisi */
        align-items: center;
        /* Memusatkan vertikal konten dalam header */
    }

    /* Style untuk ikon */
    .icons img {
        height: 24px;
        /* Sesuaikan ukuran ikon sesuai kebutuhan */
        margin-left: 20px;
        /* Memberi jarak antara ikon */
    }

    .sidebar {
        background-color: #E0E0E0;
        width: 200px;
        position: fixed;
        top: 87px;
        /* Adjust based on your header height */
        bottom: 0;
        left: 0;
        overflow-y: auto;
    }

    .sidebar ul {
        list-style-type: none;
        padding: 10px;
    }

    .sidebar ul li {
        padding: 10px;
    }

    .sidebar ul li a {
        text-decoration: none;
        color: #333;
    }

    /* Style untuk konten utama */
    .content {
        margin-left: 250px;
        /* Menggeser konten utama untuk memberi ruang bagi sidebar */
        padding: 10px;
    }
    </style>
</head>

<body>

    <header>
        <!-- Logo perusahaan di sebelah kiri header -->
        <div class="logo">
            <img src="" alt="Dewi Kajii">
        </div>

        <!-- Ikon notifikasi dan ikon person di sebelah kanan header -->
        <div class="icons">
            <img src="" alt="Notification Icon"> <!-- Ikon notifikasi -->
            <img src="" alt="Person Icon"> <!-- Ikon person -->
        </div>
    </header>

    <div class="sidebar">
        <ul>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/transaksi">Transaksi</a></li>
            <li><a href="/tentang">Tentang Kami</a></li>
            <li><a href="/kegiatan">Kegiatan</a></li>
            <li><a href="/hiburan">Hiburan</a></li>
            <li><a href="/paket">Paket Wisata</a></li>
            <li><a href="/homestay">Homestay</a></li>
            <li><a href="/katalog">Ikah Hias</a></li>
            <li><a href="/artikel">Artikel & Berita</a></li>
            <li><a href="/ulasan">Ulasan dan FAQ</a></li>
        </ul>
    </div>

    <!-- Content -->
    <div class="content">
        @yield('content')
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>
<!DOCTYPE html>
<html lang="en" data-bs-theme="dark">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title')</title>
    <link rel="stylesheet" href="/vendor/bootstrap/css/bootstrap.css">
    <link rel="stylesheet" href="/assets/css/style.css">
    <link rel="stylesheet" href="/vendor/datatable/css/dataTables.bootstrap5.min.css">
    <link rel="stylesheet" href="/vendor/lightbox/css/lightbox.min.css">

    <script src="https://kit.fontawesome.com/ae360af17e.js" crossorigin="anonymous"></script>
    <script src="/vendor/jquery/jquery-3.7.1.js"></script>
    <script src="/vendor/datatable/js/jquery.dataTables.min.js"></script>
    <script src="/vendor/datatable/js/dataTables.bootstrap5.min.js"></script>
    <script src="/vendor/lightbox/js/lightbox.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>

<body data-bs-theme="light">
    <div class="wrapper">
        <aside id="sidebar" class="sidebar.collapsed" style="background-color: #eeeeee;">
            <div class=" h-100 ">
                <div class="sidebar-logo">
                    <img src="/assets/image/logo_dewi_kajii.png" alt="Desa Wisata Kajii" width="50px"
                        height="50px">
                    <a href="" class="text-black">Admin Dewi Kajii</a>
                    <hr>
                </div>
                <ul class="sidebar-nav">
                    <li class="sidebar-item">
                        <?php
                        $values = ['Dashboard', 'Transaksi', 'Tentang Kami', 'Kegiatan', 'Hiburan', 'Paket Wisata', 'Homestay','Ikan Hias','Artikel & Berita', 'Ulasan & FAQ'];
                        $links = ['/dashboard', '/transaksi', '/tentang', '/kegiatan', '/hiburan', '/paket', '/homestay','/katalog','/artikel', '/ulasan'];
                        $icons = ['fa-solid fa-home', 'fa-solid fa-exchange-alt', 'fa-solid fa-info-circle', 'fa-solid fa-calendar-alt', 'fa-solid fa-music', 'fa-solid fa-suitcase', 'fa-solid fa-home', 'fa-solid fa-fish', 'fa-solid fa-newspaper', 'fa-solid fa-question-circle'];
                        $i = 0;
                        foreach($values as $value) {
                            $link = $links[$i];
                            $icon = $icons[$i];
                            echo '<a href="' . $link . '" class="sidebar-link text-black">';
                            echo '<i class="' . $icon . ' pe-2"></i>';
                            echo $value;
                            echo '</a>';
                            $i++;
                        }
                        ?>
                    </li>
                </ul>
            </div>
        </aside>
        <div class="main">
            <nav class="navbar navbar-expand px-3 border-bottom" style="background-color: green; height: 90px;">
                <button class="btn" id="sidebar-toggle" type="button">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="navbar-collapse navbar" data-bs-theme="light">
                    <ul class="navbar-nav">
                        <li class="nav-item dropdown">
                            <a href="#" data-bs-toggle="dropdown" class="nav-icon pe-md-0">
                                <img src="/assets/image/kadal.jpg" class="avatar img-fluid" alt=""
                                    style="border-radius:50%; width: 55px; height: 55px;">
                            </a>
                            <div class=" dropdown-menu dropdown-menu-end">
                                <a href="#" class="dropdown-item">Profile</a>
                                <a href="#" class="dropdown-item">Setting</a>
                                <a href="/Logout" class="dropdown-item">Logout</a>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
            <main class="content px-3 py-2 bg-light">
                <div class="container-fluid">
                    <div class="mb-3 text-black">
                        @yield('content')
                    </div>
                </div>
            </main>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/assets/js/script.js"></script>
</body>

</html>

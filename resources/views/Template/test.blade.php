<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Adadssad</title>
    <link href="{{ asset('vendor/bootstrap/css/bootstrap.css') }}" rel="stylesheet">
    <!-- <link href="{{ asset('vendor/fontawesome/css/all.min.css') }}" rel="stylesheet"> -->
    <script src="https://kit.fontawesome.com/ac8a45e20d.js" crossorigin="anonymous"></script>
    <script src="{{ asset('vendor/bootstrap/js/bootstrap.js') }}"></script>
</head>

<body>
    <nav class="navbar navbar-expand-lg px-5 py-0 text-white fixed-top" data-bs-theme="dark"
        style="background-color: rgb(21 128 61);">
        <div class="container-fluid">
            <a href="{{route('dashboard')}}">
                <img src="{{ asset('assets/image/logo dewi kajii.png') }}" alt="Logo" width="75" height="75"
                    class="d-inline-block align-text-top">
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">a
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="#">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Link</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            Dropdown
                        </a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#">Action</a></li>
                            <li><a class="dropdown-item" href="#">Another action</a></li>
                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li><a class="dropdown-item" href="#">Something else here</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div class="icon-group fs-4 d-flex flex-row items-align-center">
                <div class="notif d-flex justify-content-center items-align-center mx-3">
                    <i class="z-0 fa-solid fa-bell"></i>
                    <span class="z-1">asda</span>
                </div>
                <i class="fa-solid fa-user"></i>
            </div>
        </div>
    </nav>
</body>

</html>
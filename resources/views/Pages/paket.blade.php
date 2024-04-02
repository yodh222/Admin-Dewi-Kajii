@extends('template.sidebar')
@section('title','Paket')
@section('content')
<h1 class="fw-bold mt-5">Paket Wisata</h1>
<button class="btn btn-success mt-4">Tambah Paket</button>
<div class="container">
    <div class="row mt-5">
        <?php
        $homestays = [
            [
                "title" => "Paket Wisata A",
                "description" => "2 hari 2 malam",
                "image" => "assets/image/contoh.jpg",
                "facilities" => ["Kolam Renang", "Akses Wi-Fi", "Parkir Gratis"]
            ],
            [
                "title" => "Paket Wisata B",
                "description" => "2 hari 2 malam",
                "image" => "assets/image/contoh.jpg",
                "facilities" => ["Kolam Renang", "Akses Wi-Fi", "Parkir Gratis"]
            ]
        ];

        foreach ($homestays as $homestay) {
        ?>
        <div class="col-sm-3">
            <div class="card mb-3 bg-light">
                <div class="row no-gutters text-black">
                    <div class="col-md-12 align-self-center text-center">
                        <img src="<?php echo $homestay['image']; ?>" class="card-img" alt="Homestay"
                            style="width: 100%; height: 150px; object-fit: cover;">
                    </div>
                    <div class="col-md-12 align-self-center text-center">
                        <div class="card-body">
                            <h4 class="card-title"><?php echo $homestay['title']; ?></h4>
                            <p class="card-subtitle mb-2 text-muted"><?php echo $homestay['description']; ?></p>
                            <p class="card-subtitle mt-4 text-left">Fasilitas :</p>
                            <ul class="list-unstyled text-left">
                                <?php foreach ($homestay['facilities'] as $facility) { ?>
                                <li><i class="fas fa-square-check text-success"></i> <?php echo $facility; ?></li>
                                <?php } ?>
                            </ul>
                            <i class="fas fa-edit btn btn-primary btn-sm"></i>
                            <i class="fas fa-trash-alt btn btn-danger btn-sm"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <?php
        }
        ?>
    </div>
</div>

@endsection
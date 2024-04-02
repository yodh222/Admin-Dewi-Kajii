@extends('template.sidebar')
@section('title','Kegiatan')
@section('content')
<h1 class="fw-bold mt-5">Pilihan Kegiatan</h1>
<button class="btn btn-success">Tambah Kegiatan</button>

<div class="container">
    <div class="row mt-5">
        <?php
            $kegiatan = [
                ["title" => "kegiatan 1","harga" => "Rp. 200.000", "image" => "assets/image/contoh.jpg"],
                ["title" => "kegiatan 2","harga" => "Rp. 200.000", "image" => "assets/image/contoh.jpg"],
                ["title" => "kegiatan 3","harga" => "Rp. 200.000", "image" => "assets/image/contoh.jpg"],
                ["title" => "kegiatan 1","harga" => "Rp. 200.000", "image" => "assets/image/contoh.jpg"],
                ["title" => "kegiatan 2","harga" => "Rp. 200.000", "image" => "assets/image/contoh.jpg"],
                ["title" => "kegiatan 3","harga" => "Rp. 200.000", "image" => "assets/image/contoh.jpg"]
            ];

            foreach ($kegiatan as $kegiatan1) {
            ?>
        <div class="col-lg-4 col-md-6">
            <div class="card mb-3 bg-light">
                <div class="image-container">
                    <img src="<?php echo $kegiatan1['image']; ?>" class="card-img" alt="kegiatan1">
                    <div class="overlay">
                        <h5 class="card-title"><?php echo $kegiatan1['title']; ?></h5>
                        <div class="icon-container">
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
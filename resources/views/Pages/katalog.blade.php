@extends('template.sidebar')
@section('title','Ikan Hias')
@section('content')
<h1 class="fw-bold mt-4">Ikan Hias</h1>
<h3 class="fw-bold mt-5">Galeri Ikan Hias</h3>
<button type="button" class="btn btn-success mt-2">Tambah Ikan Hias</button>

<div class="container">
    <div class="row mt-5">
        <?php
            $ikanhias = [
                ["title" => "Ikan 1", "description" => "Harga Ikan 1", "image" => "assets/image/contoh.jpg"],
                ["title" => "Ikan 2", "description" => "Harga Ikan 2", "image" => "assets/image/contoh.jpg"],
                ["title" => "Ikan 3", "description" => "Harga Ikan 3", "image" => "assets/image/contoh.jpg"]
            ];

            foreach ($ikanhias as $ikanhias1) {
            ?>
        <div class="col-lg-4 col-md-6">
            <div class="card mb-3 bg-light">
                <div class="image-container">
                    <img src="<?php echo $ikanhias1['image']; ?>" class="card-img" alt="ikanhias1">
                    <div class="overlay">
                        <h5 class="card-title"><?php echo $ikanhias1['title']; ?></h5>
                        <p class="card-text"><?php echo $ikanhias1['description']; ?></p>
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

<h3 class="fw-bold mt-5">Kolam Budi Daya Ikan</h3>
<button type="button" class="btn btn-success mt-2">Tambah Kolam</button>
<div class="container">
    <div class="row mt-5">
        <?php
            $kolam = [
                ["title" => "Kolam 1", "image" => "assets/image/contoh.jpg"],
                ["title" => "Kolam 2", "image" => "assets/image/contoh.jpg"],
                ["title" => "Kolam 3", "image" => "assets/image/contoh.jpg"]
            ];

            foreach ($kolam as $kolam1) {
            ?>
        <div class="col-lg-4 col-md-6">
            <div class="card mb-3 bg-light">
                <div class="image-container">
                    <img src="<?php echo $kolam1['image']; ?>" class="card-img" alt="kolam1">
                    <div class="overlay">
                        <h5 class="card-title"><?php echo $kolam1['title']; ?></h5>
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


<h3 class="fw-bold mt-5">Lembaga Kerjasama</h3>
<button type="button" class="btn btn-success mt-2">Tambah Lembaga</button>
<div class="container">
    <div class="row mt-5">
        <?php
            $lembaga = [
                ["title" => "Lembaga 1", "image" => "assets/image/contoh.jpg"],
                ["title" => "Lembaga 2", "image" => "assets/image/contoh.jpg"],
                ["title" => "Lembaga 3", "image" => "assets/image/contoh.jpg"]
            ];


            foreach ($lembaga as $lembaga1) {
            ?>
        <div class="col-lg-4 col-md-6">
            <div class="card mb-3 bg-light">
                <div class="image-container">
                    <img src="<?php echo $lembaga1['image']; ?>" class="card-img" alt="lembaga1">
                    <div class="overlay">
                        <h5 class="card-title"><?php echo $lembaga1['title']; ?></h5>
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
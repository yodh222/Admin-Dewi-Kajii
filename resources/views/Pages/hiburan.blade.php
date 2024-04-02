@extends('template.sidebar')
@section('title','Hiburan')
@section('content')
<h1 class="mt-5 fw-bold">Atraksi & Kebudayaan</h1>
<button class="btn btn-success mt-4">Tambah Atraksi & Kebudayaan</button>
<div class="container">
    <div class="row mt-5">
        <?php
            $atraksi = [
                ["title" => "atraksi 1","harga" => "Rp. 200.000", "image" => "assets/image/contoh.jpg"],
                ["title" => "atraksi 2","harga" => "Rp. 200.000", "image" => "assets/image/contoh.jpg"],
                ["title" => "atraksi 3","harga" => "Rp. 200.000", "image" => "assets/image/contoh.jpg"],
            ];

            foreach ($atraksi as $atraksi1) {
            ?>
        <div class="col-lg-4 col-md-6">
            <div class="card mb-3 bg-light">
                <div class="image-container">
                    <img src="<?php echo $atraksi1['image']; ?>" class="card-img" alt="atraksi1">
                    <div class="overlay">
                        <h5 class="card-title"><?php echo $atraksi1['title']; ?></h5>
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
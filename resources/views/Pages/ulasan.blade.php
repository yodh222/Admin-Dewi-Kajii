@extends('template.sidebar')
@section('title','Ulasan')
@section('content')
<h1 class="fw-bold mt-4">Ulasan & FAQ</h1>
<h3 class="fw-bold mt-5">Ulasan Konsumen</h3>
<button type="button" class="btn btn-success mt-2">Tambah Ulasan</button>
<div class="container">
    <div class="row mt-5">
        <?php
        $articles = [
            ["title" => "Nama User", "description" => "Ulasan", "image" => "assets\image\contoh.jpg"],
            ["title" => "Nama User", "description" => "Ulasan", "image" => "assets\image\contoh.jpg"],
            ["title" => "Nama User", "description" => "Ulasan", "image" => "assets\image\contoh.jpg"] 
        ];

        foreach ($articles as $article) {
            ?>
        <div class="col-sm-3">
            <div class="card mb-3 bg-light">
                <div class="row no-gutters text-black">
                    <div class="row-md-8 align-self-center">
                        <div class="card-body text-center">
                            <h5 class="card-title"><?php echo $article['title']; ?></h5>
                            <p class="card-text"><?php echo $article['description']; ?></p>
                        </div>
                    </div>
                    <div class="row-md-4 align-self-center text-center">
                        <div class="rounded-circle overflow-hidden mx-auto" style="width: 100px; height: 100px;">
                            <img src="<?php echo $article['image']; ?>" class="card-img mb-2" alt="Penulis"
                                style="width: 100%; height: 100%; object-fit: cover;">
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
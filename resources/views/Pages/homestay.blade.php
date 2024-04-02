@extends('template.sidebar')
@section('title','Homestay')
@section('content')
<h1 class="fw-bold mt-5">Homestay</h1>
<button type="button" class="btn btn-success mt-2">Tambah Homestay</button>
<div class="container">
    <div class="row mt-5">
        <?php
        $homestays = [
            ["title" => "Homestay 1", "description" => "Harga Homestay 1", "image" => "assets/image/kadal.jpg"],
            ["title" => "Homestay 2", "description" => "Harga Homestay 2", "image" => "assets/image/kadal.jpg"],
            ["title" => "Homestay 3", "description" => "Harga Homestay 3", "image" => "assets/image/kadal.jpg"]
        ];

        foreach ($homestays as $homestay) {
        ?>
        <div class="col-sm-4">
            <div class="card mb-3 bg-light">
                <div class="text-black">
                    <div class="col-md-12">
                        <img src="<?php echo $homestay['image']; ?>" class="card-img" alt="Homestay"
                            style="width: 100%; height: 150px; object-fit: cover;">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title"><?php echo $homestay['title']; ?></h5>
                            <p class="card-text"><?php echo $homestay['description']; ?></p>
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
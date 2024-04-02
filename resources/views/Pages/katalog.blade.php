@extends('template.sidebar')
@section('title','Ikan Hias')
@section('content')
<h1 class="fw-bold mt-4">Ikan Hias</h1>
<h3 class="fw-bold mt-5">Galeri Ikan Hias</h3>
<button type="button" class="btn btn-success mt-2">Tambah Ikan Hias</button>
<div class="container">
    <div class="row mt-5">
        <?php
        $articles = [
            ["title" => "nganggo asset", "description" => "Deskripsi artikel 1", "author" => "Penulis 1", "image" => "{{asset('assets\image\logo_dewi_kajii.png')}}"],
            ["title" => "langsung path", "description" => "Deskripsi artikel 1", "author" => "Penulis 1", "image" => "public\assets\image\logo_dewi_kajii.png"]
            
        ];

        foreach ($articles as $article) {
            ?>
        <div class="col-sm-4">
            <div class="card mb-3 bg-light">
                <div class="row no-gutters text-black">
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title"><?php echo $article['title']; ?></h5>
                            <p class="card-text"><?php echo $article['description']; ?></p>
                            <p class="card-text"><small>Penulis:
                                    <?php echo $article['author']; ?></small></p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <img src="<?php echo $article['image']; ?>" class="card-img mt-2" alt="Penulis"
                            style="width: 100px; height:auto">
                    </div>
                </div>
            </div>
        </div>
        <?php
        }
        ?>
    </div>
</div>

<h3 class="fw-bold mt-5">Galeri Ikan Konsumsi</h3>
<button type="button" class="btn btn-success mt-2">Tambah Ikan Konsumsi</button>
<div class="container">
    <div class="row mt-5">
        <?php
        $articles = [
            ["title" => "nganggo asset", "description" => "Deskripsi artikel 1", "author" => "Penulis 1", "image" => "{{asset('assets\image\logo_dewi_kajii.png')}}"],
            ["title" => "langsung path", "description" => "Deskripsi artikel 1", "author" => "Penulis 1", "image" => "public\assets\image\logo_dewi_kajii.png"]
            
        ];

        foreach ($articles as $article) {
            ?>
        <div class="col-sm-4">
            <div class="card mb-3 bg-light">
                <div class="row no-gutters text-black">
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title"><?php echo $article['title']; ?></h5>
                            <p class="card-text"><?php echo $article['description']; ?></p>
                            <p class="card-text"><small>Penulis:
                                    <?php echo $article['author']; ?></small></p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <img src="<?php echo $article['image']; ?>" class="card-img mt-2" alt="Penulis"
                            style="width: 100px; height:auto">
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
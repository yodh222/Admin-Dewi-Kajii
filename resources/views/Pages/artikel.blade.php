@extends('template.sidebar')
@section('title','Artikel')
@section('content')
<h1 class="fw-bold mt-4">Artikel & Berita</h1>
<button type="button" class="btn btn-success mt-2">Tambah Baru</button>
<!-- File: index.php -->
<div class="container">
    <?php
    // Contoh data
    $articles = [
        ["id" => 1,"title" => "Artikel 1", "description" => "Deskripsi artikel 1", "author" => "Penulis 1", "image" => "path/to/image1.jpg"],
        ["id" => 2,"title" => "Artikel 2", "description" => "Deskripsi artikel 2", "author" => "Penulis 2", "image" => "path/to/image2.jpg"],
        ["id" => 3,"title" => "Artikel 3", "description" => "Deskripsi artikel 3", "author" => "Penulis 3", "image" => "path/to/image3.jpg"]
    ];

    // Looping untuk membuat kartu
    foreach ($articles as $article) {
        ?>
    <div class="card mb-3 bg-light mt-4 ">
        <div class="row no-gutters text-black">
            <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title"><?php echo $article['title']; ?></h5>
                    <p class="card-text"><?php echo $article['description']; ?></p>
                    <p class="card-text"><small>Penulis:
                            <?php echo $article['author'];?></small></p>
                    <a href="edit.php?id=<?php echo $article['id']; ?>" class="btn btn-primary btn-sm"><i
                            class="fas fa-edit"></i> Edit</a>
                    <a href="delete.php?id=<?php echo $article['id']; ?>" class="btn btn-danger btn-sm"><i
                            class="fas fa-trash-alt"></i> Delete</a>
                </div>
            </div>
            <div class="col-md-4">
                <img src="<?php echo $article['image']; ?>" class="card-img mt-2" alt="Penulis"
                    style="width: 100px; height:auto">
            </div>
        </div>
    </div>
    <?php
    }
    ?>
</div>

@endsection
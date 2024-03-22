@extends('template.sidebar')
@section('title','Artikel')
@section('content')
<h1 class="fw-bold mt-4">Artikel & Berita</h1>
<button type="button" class="btn btn-success mt-2">Tambah Baru</button>
<!-- File: index.php -->
    <?php
    // Contoh data
    $articles = [
        ["id" => 1,"title" => "Artikel 1", "description" => "Deskripsi artikel 1", "author" => "Penulis 1", "image" => "https://dlh.banyuasinkab.go.id/wp-content/uploads/sites/120/2020/10/WhatsApp-Image-2020-10-02-at-14.00.12-3.jpeg"],
        ["id" => 2,"title" => "Artikel 2", "description" => "Deskripsi artikel 2", "author" => "Penulis 2", "image" => "https://dlh.banyuasinkab.go.id/wp-content/uploads/sites/120/2020/10/WhatsApp-Image-2020-10-02-at-14.00.12-3.jpeg"],
        ["id" => 3,"title" => "Artikel 3", "description" => "Deskripsi artikel 3", "author" => "Penulis 3", "image" => "https://dlh.banyuasinkab.go.id/wp-content/uploads/sites/120/2020/10/WhatsApp-Image-2020-10-02-at-14.00.12-3.jpeg"]
    ];

    // Looping untuk membuat kartu
    foreach ($articles as $article) {
        ?>
    <div class="card mb-3 mt-4" style="width:100%" data-bs-theme="light">
        <div class="row g-0">
            <div class="col-md-4">
            <img src="<?php echo $article['image']; ?>" class="img-fluid rounded-start" alt="Artikel" style="width: 300px; height:auto">
            </div>
            <div class="col-md-8">
            <div class="card-body">
                <h5 class="card-title mt-3"><?php echo $article['title']; ?></h5>
                <p class="card-text"><?php echo $article['description']; ?></p>
                <p class="card-text"><small class="text-body-secondary">Last updated 3 mins ago</small></p>
                <a href="edit.php?id=<?php echo $article['id']; ?>" class="btn btn-primary btn-sm"><i
                    class="fas fa-edit"></i> Edit</a>
                <a href="delete.php?id=<?php echo $article['id']; ?>" class="btn btn-danger btn-sm"><i
                        class="fas fa-trash-alt"></i> Delete</a>
            </div>
            </div>
        </div>
    </div>
    <?php
    }
    ?>

@endsection

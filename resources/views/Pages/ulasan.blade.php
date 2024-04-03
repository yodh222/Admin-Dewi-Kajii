@extends('template.sidebar')
@section('title','Ulasan')
@section('content')
<h1 class="fw-bold mt-4">Ulasan & FAQ</h1>
<h3 class="fw-bold mt-5">Ulasan Konsumen</h3>
<button type="button" class="btn btn-success mt-2" data-bs-toggle="modal" data-bs-target="#ModalTambah">Tambah
    Ulasan</button>

<div id="articleContainer">
</div>

<div data-bs-theme="light" class="modal fade" id="ModalTambah" data-bs-backdrop="static" data-bs-keyboard="false"
    tabindex="-1" aria-labelledby="ModalTambahLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="ModalTambahLabel">Tambah Ulasan</h1>
            </div>
            <form action="" method="post" enctype="multipart/form-data">
                <div class="modal-body">
                    @csrf
                    <div class="mb-3">
                        <label class="form-label">Nama Pengunjung</label>
                        <div class="input-group">
                            <input type="text" class="form-control" name="" aria-describedby="basic-addon3 basic-addon4"
                                required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Ulasan Pengunjung</label>
                        <div class="input-group">
                            <input type="text" class="form-control" name="" aria-describedby="basic-addon3 basic-addon4"
                                required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Image Ulasan</label>
                        <div class="input-group">
                            <input type="file" class="form-control" name="" accept="image/png, image/jpeg"
                                aria-describedby="basic-addon3 basic-addon4" required>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-success">Simpan</button>
            </form>
        </div>
    </div>
</div>
</div>
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
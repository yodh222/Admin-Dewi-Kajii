@extends('template.sidebar')
@section('title','Paket')
@section('content')
<h1 class="fw-bold mt-5">Paket Wisata</h1>
<button type="button" class="btn btn-success mt-2" data-bs-toggle="modal" data-bs-target="#ModalTambah">Tambah
    Paket Wisata</button>

<div id="articleContainer">
</div>

<div data-bs-theme="light" class="modal fade" id="ModalTambah" data-bs-backdrop="static" data-bs-keyboard="false"
    tabindex="-1" aria-labelledby="ModalTambahLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="ModalTambahLabel">Tambah Paket Wisata</h1>
            </div>
            <form action="" method="post" enctype="multipart/form-data">
                <div class="modal-body">
                    @csrf
                    <div class="mb-3">
                        <label class="form-label">Nama Paket Wisata</label>
                        <div class="input-group">
                            <input type="text" class="form-control" name="" aria-describedby="basic-addon3 basic-addon4"
                                required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Durasi Wisata</label>
                        <div class="input-group">
                            <input type="text" class="form-control" name="" aria-describedby="basic-addon3 basic-addon4"
                                required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Fasilitas</label>
                        <div class="input-group">
                            <input type="text" class="form-control" name="" aria-describedby="basic-addon3 basic-addon4"
                                required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Image Paket Wisata</label>
                        <div class="input-group">
                            <input type="file" class="form-control" name="" accept="image/png, image/jpeg"
                                aria-describedby="basic-addon3 basic-addon4" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Harga Paket Wisata</label>
                        <div class="input-group">
                            <input type="text" class="form-control" name="" aria-describedby="basic-addon3 basic-addon4"
                                required>
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
@extends('template.sidebar')
@section('title','Hiburan')
@section('content')
<h1 class="mt-5 fw-bold">Atraksi & Kebudayaan</h1>
<button type="button" class="btn btn-success mt-2" data-bs-toggle="modal" data-bs-target="#ModalTambah">Tambah
    Kegiatan</button>

<div id="articleContainer">
</div>

<div data-bs-theme="light" class="modal fade" id="ModalTambah" data-bs-backdrop="static" data-bs-keyboard="false"
    tabindex="-1" aria-labelledby="ModalTambahLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="ModalTambahLabel">Tambah Hiburan</h1>
            </div>
            <form action="" method="post" enctype="multipart/form-data">
                <div class="modal-body">
                    @csrf
                    <div class="mb-3">
                        <label class="form-label">Nama Hiburan</label>
                        <div class="input-group">
                            <input type="text" class="form-control" name="" aria-describedby="basic-addon3 basic-addon4"
                                required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Image Hiburan</label>
                        <div class="input-group">
                            <input type="file" class="form-control" name="" accept="image/png, image/jpeg"
                                aria-describedby="basic-addon3 basic-addon4" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Harga Hiburan</label>
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

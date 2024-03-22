@extends('template.sidebar')
@section('title','Artikel')
@section('content')
<h1 class="fw-bold mt-4">Artikel & Berita</h1>
<button type="button" class="btn btn-success mt-2" data-bs-toggle="modal" data-bs-target="#ModalTambah">Tambah Baru</button>
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

<div data-bs-theme="light" class="modal fade" id="ModalTambah" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="ModalTambahLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
            <h1 class="modal-title fs-5" id="ModalTambahLabel">Tambah Artikel</h1>
            {{-- <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> --}}
            </div>
            <div class="modal-body">
                <form action="" method="post" enctype="multipart/form-data">
                    @csrf
                    <div class="mb-3">
                        <label class="form-label">Judul Artikel/Berita</label>
                        <div class="input-group">
                            <input type="text" class="form-control" name="judul" aria-describedby="basic-addon3 basic-addon4">
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Isi Artikel/Berita</label>
                        <textarea class="form-control" name="deskripsi" aria-label="With textarea"></textarea>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Image Artikel/Berita</label>
                        <div class="input-group">
                            <input type="file" class="form-control" name="gambar" accept="image/png, image/jpeg" aria-describedby="basic-addon3 basic-addon4">
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Tanggal Artikel/Berita Dibuat</label>
                        <div class="input-group">
                            <input type="date" class="form-control" name="gambar" aria-describedby="basic-addon3 basic-addon4">
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-success">Simpan</button>
            </div>
        </div>
    </div>
</div>

@endsection

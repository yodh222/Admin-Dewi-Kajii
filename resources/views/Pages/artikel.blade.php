@extends('template.sidebar')
@section('title','Artikel')
@section('content')
<h1 class="fw-bold mt-4">Artikel & Berita</h1>
<button type="button" class="btn btn-success mt-2" data-bs-toggle="modal" data-bs-target="#ModalTambah">Tambah Baru</button>

<div id="articleContainer">
</div>

<div data-bs-theme="light" class="modal fade" id="ModalTambah" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="ModalTambahLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
            <h1 class="modal-title fs-5" id="ModalTambahLabel">Tambah Artikel</h1>
            </div>
            <form action="{{route('artikel.tambah')}}" method="post" enctype="multipart/form-data">
            <div class="modal-body">
                    @csrf
                    <div class="mb-3">
                        <label class="form-label">Judul Artikel/Berita</label>
                        <div class="input-group">
                            <input type="text" class="form-control" name="judul" aria-describedby="basic-addon3 basic-addon4" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Isi Artikel/Berita</label>
                        <textarea class="form-control" name="deskripsi" aria-label="With textarea" required></textarea>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Image Artikel/Berita</label>
                        <div class="input-group">
                            <input type="file" class="form-control" name="gambar" accept="image/png, image/jpeg" aria-describedby="basic-addon3 basic-addon4" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Tanggal Artikel/Berita Dibuat</label>
                        <div class="input-group">
                            <input type="date" class="form-control" name="tanggal" aria-describedby="basic-addon3 basic-addon4" required>
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

<script>
    $(document).ready(function(){
        $.getJSON('{{route('artikel')}}', function(data){
            $.each(data.artikel, function(index, artikel){
                var cardHtml = `
                <div class="card mb-3 mt-4" style="width:100%" data-bs-theme="light">
                    <div class="row g-0">
                        <div class="col-md-4">
                        <img src="${artikel.gambar}" class="img-fluid rounded-start" alt="Artikel" style="width: 300px; height:auto">
                        </div>
                        <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title mt-3">${artikel.judul}</h5>
                            <p class="card-text">${artikel.deskripsi}</p>
                            <p class="card-text"><small class="text-body-secondary">Dibuat: ${artikel.dibuat}</small></p>
                            <a href="" class="btn btn-primary btn-sm"><i
                                class="fas fa-edit"></i> Edit</a>
                            <a href="" class="btn btn-danger btn-sm"><i
                                    class="fas fa-trash-alt"></i> Delete</a>
                        </div>
                        </div>
                    </div>
                </div>`;

                $('#articleContainer').append(cardHtml);
            });
        });
    });
</script>

@endsection

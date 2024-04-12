@extends('template.sidebar')
@section('title','Artikel')
@section('content')
<h1 class="fw-bold mt-4">Artikel & Berita</h1>

@if(session('success'))
<div class="alert alert-success alert-dismissible fade show" role="alert">
    {{session('success')}}
    <button type="button" class="btn-close" style="color: black" data-bs-dismiss="alert" aria-label="Close"></button>
</div>
@endif
@if(session('error'))
<div class="alert alert-danger alert-dismissible fade show" role="alert">
    {{session('error')}}
    <button type="button" class="btn-close" style="color: black" data-bs-dismiss="alert" aria-label="Close"></button>
</div>
@endif

<button type="button" class="btn btn-success mt-2" data-bs-toggle="modal" data-bs-target="#tambahData">Tambah Artikel</button>

<div id="articleContainer">
</div>

{{-- Modal --}}
{{-- Modal Edit --}}
<div data-bs-theme="light" class="modal fade" id="editData" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="editDataLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
            <h1 class="modal-title fs-5" id="editDataLabel">Edit Artikel</h1>
            </div>
            <form action="" id="form-edit" method="post" enctype="multipart/form-data">
            <div class="modal-body">
                    @csrf
                    <div class="mb-3">
                        <label class="form-label">Judul Artikel/Berita</label>
                        <div class="input-group">
                            <input type="text" class="form-control" name="judul" id="judul" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Isi Artikel/Berita</label>
                        <textarea class="form-control" name="deskripsi" aria-label="With textarea" id="deskripsi" required></textarea>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Image Artikel/Berita</label>
                        <div class="input-group">
                            <input type="file" class="form-control" name="gambar[]" multiple accept="image/png, image/jpeg" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Tanggal Artikel/Berita Dibuat</label>
                        <div class="input-group">
                            <input type="date" class="form-control" name="tanggal" id="tanggal" required>
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
{{-- Modal Tambah --}}
<div data-bs-theme="light" class="modal fade" id="tambahData" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="tambahDataLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
            <h1 class="modal-title fs-5" id="tambahDataLabel">Tambah Artikel</h1>
            </div>
            <form action="{{route('artikel.tambah')}}" method="post" enctype="multipart/form-data">
            <div class="modal-body">
                    @csrf
                    <div class="mb-3">
                        <label class="form-label">Judul Artikel/Berita</label>
                        <div class="input-group">
                            <input type="text" class="form-control" name="judul" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Isi Artikel/Berita</label>
                        <textarea class="form-control" name="deskripsi" aria-label="With textarea" required></textarea>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Image Artikel/Berita</label>
                        <div class="input-group">
                            <input type="file" class="form-control" name="gambar[]" multiple accept="image/png, image/jpeg" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Tanggal Artikel/Berita Dibuat</label>
                        <div class="input-group">
                            <input type="date" class="form-control" name="tanggal" required>
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
{{-- Modal Hapus --}}
<div data-bs-theme="light" class="modal fade" id="hapusData" data-bs-backdrop="static" data-bs-keyboard="false"
    tabindex="-1" aria-labelledby="hapusabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="hapusabel">Hapus Artikel</h1>
            </div>
            <div class="modal-body">
                Apakah anda yakin ingin menghapus data ini?
            </div>
            <form action="" id="form-hapus" method="post">
                <div class="modal-footer">
                    @csrf
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-danger">Hapus</button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
    $(document).ready(function(){
        $.getJSON('{{route('artikel')}}', function(data){
            $.each(data.artikel, function(index, artikel){

                var images = artikel.gambar.split(',');
                var cardHtml = `
                <div class="card mb-3 mt-4" style="width:100%" data-bs-theme="light">
                    <div class="row g-0">
                        <div class="col-md-4">
                        <img src="${images[0]}" class="img-fluid rounded-start" alt="Artikel" style="width: 300px; height:auto">
                        </div>
                        <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title mt-3">${artikel.judul}</h5>
                            <p class="card-text">${artikel.deskripsi}</p>
                            <p class="card-text"><small class="text-body-secondary">Dibuat: ${artikel.dibuat}</small></p>
                            <button class="btn btn-primary me-2" data-bs-target="#editData" data-bs-toggle="modal" onclick="editData('${artikel.id_artikel}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger" data-bs-target="#hapusData" data-bs-toggle="modal" onclick="deleteData('${artikel.id_artikel}')">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                        </div>
                    </div>
                </div>`;

                $('#articleContainer').append(cardHtml);
            });
        });
    });

    function editData(id){
        $('#form-edit').attr('action','/artikel/edit/'+id)

        $.getJSON('/api/artikel/'+id, function(data){
            $('#judul').val(data.judul)
            $('#deskripsi').val(data.deskripsi)
            $('#tanggal').val(data.dibuat)
        })
    }

    function deleteData(id){
        $('#form-hapus').attr('action', '/artikel/hapus/'+id)
    }
</script>

@endsection

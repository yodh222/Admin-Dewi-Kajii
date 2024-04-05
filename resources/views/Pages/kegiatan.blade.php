@extends('template.sidebar')
@section('title','Kegiatan')
@section('content')
<h1 class="fw-bold mt-5">Pilihan Kegiatan</h1>

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

<button type="button" class="btn btn-success mt-2" data-bs-toggle="modal" data-bs-target="#tambahData">Tambah Kegiatan</button>

<div class="row mt-5" id="kegiatanContainer">
</div>


{{-- Modal --}}
{{-- Modal Edit --}}
<div data-bs-theme="light" class="modal fade" id="editData" data-bs-backdrop="static" data-bs-keyboard="false"
    tabindex="-1" aria-labelledby="editDataLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="editDataLabel">Edit Kegiatan</h1>
            </div>
            <form action="" method="post" id="form-edit" enctype="multipart/form-data">
                <div class="modal-body">
                    @csrf
                    <div class="mb-3">
                        <label class="form-label">Nama Kegiatan</label>
                        <div class="input-group">
                            <input type="text" class="form-control" name="judul" id="judul" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Image Kegiatan</label>
                        <div class="input-group">
                            <input type="file" class="form-control" name="gambar" id="gambar" accept="image/png, image/jpeg" required>
                        </div>
                        <div class="form-text">Image dengan scale 1:1</div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Harga Kegiatan</label>
                        <div class="input-group">
                            <span class="input-group-text">Rp.</span>
                            <input type="number" class="form-control" name="harga" id="harga" required>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-success">Simpan</button>
                </div>
            </form>
        </div>
    </div>
</div>
{{-- Modal Tambah --}}
<div data-bs-theme="light" class="modal fade" id="tambahData" data-bs-backdrop="static" data-bs-keyboard="false"
    tabindex="-1" aria-labelledby="tambahDataLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="tambahDataLabel">Tambah Kegiatan</h1>
            </div>
            <form action="/kegiatan/tambah" method="post" enctype="multipart/form-data">
                <div class="modal-body">
                    @csrf
                    <div class="mb-3">
                        <label class="form-label">Nama Kegiatan</label>
                        <div class="input-group">
                            <input type="text" class="form-control" name="judul" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Image Kegiatan</label>
                        <div class="input-group">
                            <input type="file" class="form-control" name="gambar" accept="image/png, image/jpeg" required>
                        </div>
                        <div class="form-text">Image dengan scale 1:1</div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Harga Kegiatan</label>
                        <div class="input-group">
                            <span class="input-group-text">Rp.</span>
                            <input type="number" class="form-control" name="harga" required>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-success">Simpan</button>
                </div>
            </form>
        </div>
    </div>
</div>
{{-- Modal Delete --}}
<div data-bs-theme="light" class="modal fade" id="deleteData" data-bs-backdrop="static" data-bs-keyboard="false"
    tabindex="-1" aria-labelledby="deleteDataLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="deleteDataLabel">Delete Kegiatan</h1>
            </div>
            <div class="modal-body">
                Apakah anda yakin ingin menghapus kegiatan ini?
            </div>
            <form action="" method="post" enctype="multipart/form-data" id="form-delete">
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
    $(document).ready(function() {
        $.getJSON('/api/kegiatan', function(data){
            $.each(data.kegiatan,function(index, kegiatan){
                var card = `
                <div class="col-3">
                    <div class="card mb-3 bg-light">
                        <div class="image-container">
                            <img src="${kegiatan.gambar}" class="card-img" width="300" height="300">
                            <div class="overlay">
                                <h5 class="card-title">${kegiatan.judul}</h5>
                                <p class="card-title">Rp. ${kegiatan.harga}</p>
                                <div class="icon-container">
                                    <button class="btn btn-primary p-1 me-2" data-bs-target="#editData" data-bs-toggle="modal" onclick="editData('${kegiatan.id_kegiatan}')">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-danger p-1" data-bs-target="#deleteData" data-bs-toggle="modal" onclick="deleteData('${kegiatan.id_kegiatan}')">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `

                $('#kegiatanContainer').append(card)
            })
        })
    })

    function editData(id){
        $('#form-edit').attr('action', '/kegiatan/edit/'+id)
        $.getJSON('/api/kegiatan/'+id, function(data){
            $('#judul').val(data.judul)
            $('#harga').val(data.harga)
        })
    }
    function deleteData(id){
        $('#form-delete').attr('action', '/kegiatan/hapus/'+id)
    }
</script>
@endsection

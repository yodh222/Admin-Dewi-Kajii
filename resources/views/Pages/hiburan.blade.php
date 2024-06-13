@extends('template.sidebar')
@section('title','Hiburan')
@section('content')
<h1 class="mt-5 fw-bold">Atraksi & Kebudayaan</h1>

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

<div class="row mt-5" id="hiburanContainer">
</div>

{{-- Modal --}}
{{-- Modal Edit --}}
<div data-bs-theme="light" class="modal fade" id="editData" data-bs-backdrop="static" data-bs-keyboard="false"
    tabindex="-1" aria-labelledby="editDataLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="editDataLabel">Edit Hiburan</h1>
            </div>
            <form action="/hiburan/tambah" method="post" enctype="multipart/form-data" id="form-edit">
                <div class="modal-body">
                    @csrf
                    <div class="mb-3">
                        <label class="form-label">Nama Hiburan</label>
                        <div class="input-group">
                            <input type="text" class="form-control" name="nama" id="judul" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Image Hiburan</label>
                        <div class="input-group">
                            <input type="file" class="form-control" name="gambar" accept="image/png, image/jpeg" required>
                        </div>
                        <div class="form-text">asdasdas</div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Harga Hiburan</label>
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
                <h1 class="modal-title fs-5" id="tambahDataLabel">Tambah Hiburan</h1>
            </div>
            <form action="/hiburan/tambah" method="post" enctype="multipart/form-data">
                <div class="modal-body">
                    @csrf
                    <div class="mb-3">
                        <label class="form-label">Nama Hiburan</label>
                        <div class="input-group">
                            <input type="text" class="form-control" name="nama" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Image Hiburan</label>
                        <div class="input-group">
                            <input type="file" class="form-control" name="gambar" accept="image/png, image/jpeg"
                                aria-describedby="basic-addon3 basic-addon4" required>
                        </div>
                        <div class="form-text">asdasdas</div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Harga Hiburan</label>
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
{{-- Modal Hapus --}}
<div data-bs-theme="light" class="modal fade" id="hapusData" data-bs-backdrop="static" data-bs-keyboard="false"
    tabindex="-1" aria-labelledby="hapusDataLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="hapusDataLabel">Hapus Hiburan</h1>
            </div>
            <div class="modal-body">
                Apakah anda yakin ingin menghapus data ini?
            </div>
            <form action="" method="post" id="form-delete">
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
        $.getJSON('/api/hiburan', function(data){
            $.each(data.hiburan,function(index, hiburan){
                var card = `
                <div class="col-3">
                    <div class="card border-0 mb-3 bg-light">
                        <div class="image-container">
                            <img src="${hiburan.gambar}" class="card-img" width="300" height="100">
                            <div class="overlay">
                                <h5 class="card-title">${hiburan.judul}</h5>
                                <p class="card-title">Rp. ${hiburan.harga}</p>
                                <div class="icon-container">
                                    <button class="btn btn-primary p-1 me-2" data-bs-target="#editData" data-bs-toggle="modal" onclick="editData('${hiburan.id_hiburan}')">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-danger p-1" data-bs-target="#hapusData" data-bs-toggle="modal" onclick="deleteData('${hiburan.id_hiburan}')">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `

                $('#hiburanContainer').append(card)
            })
        })
    })

    function editData(id){
        $('#form-edit').attr('action','/hiburan/edit/'+id)
        $.getJSON('/api/hiburan/'+id, function(data){
            $('#judul').val(data.judul)
            $('#harga').val(data.harga)
        })
    }

    function deleteData(id){
        $('#form-delete').attr('action', '/hiburan/hapus/'+id)
    }
</script>
@endsection

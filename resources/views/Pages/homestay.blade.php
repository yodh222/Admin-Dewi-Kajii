@extends('template.sidebar')
@section('title','Homestay')
@section('content')
<h1 class="fw-bold mt-5">Homestay</h1>

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

<button type="button" class="btn btn-success mt-2" data-bs-toggle="modal" data-bs-target="#tambahData">Tambah
    Homestay</button>

<div id="homestayContainer" class="row mt-5">
</div>

{{-- Modal --}}
{{-- Modal Edit --}}
<div data-bs-theme="light" class="modal fade" id="editData" data-bs-backdrop="static" data-bs-keyboard="false"
    tabindex="-1" aria-labelledby="editDataLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="editDataLabel">Edit Homestay</h1>
            </div>
            <form action="" method="post" enctype="multipart/form-data" id="form-edit">
                <div class="modal-body">
                    @csrf
                    <div class="mb-3">
                        <label class="form-label">Nama Homestay</label>
                        <div class="input-group">
                            <input type="text" class="form-control" name="nama" id="nama" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Fasilitas</label>
                        <div class="input-group">
                            <textarea type="text" class="form-control" name="fasilitas" id="fasilitas" required></textarea>
                        </div>
                        <div class="form-text">Pisahkan dengan koma</div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Deskripsi Singkat</label>
                        <div class="input-group">
                            <textarea type="text" class="form-control" name="deskripsi" id="deskripsi" required></textarea>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Image Homestay</label>
                        <div class="input-group">
                            <input type="file" class="form-control" name="gambar[]" multiple accept="image/png, image/jpeg" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Peraturan Homestay</label>
                        <div class="input-group">
                            <textarea type="text" class="form-control" name="peraturan" id="peraturan" required></textarea>
                        </div>
                        <div class="form-text">Pisahkan dengan koma</div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Harga Homestay</label>
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
                <h1 class="modal-title fs-5" id="tambahDataLabel">Tambah Homestay</h1>
            </div>
            <form action="/homestay/tambah" method="post" enctype="multipart/form-data">
                <div class="modal-body">
                    @csrf
                    <div class="mb-3">
                        <label class="form-label">Nama Homestay</label>
                        <div class="input-group">
                            <input type="text" class="form-control" name="nama" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Fasilitas</label>
                        <div class="input-group">
                            <textarea type="text" class="form-control" name="fasilitas" required></textarea>
                        </div>
                        <div class="form-text">Pisahkan dengan koma</div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Deskripsi Singkat</label>
                        <div class="input-group">
                            <textarea type="text" class="form-control" name="deskripsi" required></textarea>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Image Homestay</label>
                        <div class="input-group">
                            <input type="file" class="form-control" name="gambar[]" multiple accept="image/png, image/jpeg" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Peraturan Homestay</label>
                        <div class="input-group">
                            <textarea type="text" class="form-control" name="peraturan" required></textarea>
                        </div>
                        <div class="form-text">Pisahkan dengan koma</div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Harga Homestay</label>
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
    tabindex="-1" aria-labelledby="hapusabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="hapusabel">Hapus Homestay</h1>
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
    $(document).ready(function() {
        $.getJSON('/api/homestay', function(data){
            $.each(data.homestay,function(index, homestay){
                var images = homestay.gambar.split(',');
                console.log(images)

                var card = `
                <div class="col-sm-4">
                    <div class="card mb-3 bg-light">
                        <div class="text-black">
                            <div class="col-md-12">
                                <img src="${images[0]}" class="card-img" alt="Homestay"
                                    style="width: 100%; height: 150px; object-fit: cover;">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="card-title">${homestay.nama}</h5>
                                    <p class="card-text">${homestay.harga}</p>
                                    <div class="d-flex justify-content-start">
                                        <button class="btn btn-primary me-2" data-bs-target="#editData" data-bs-toggle="modal" onclick="editData('${homestay.id_homestay}')">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn btn-danger" data-bs-target="#hapusData" data-bs-toggle="modal" onclick="deleteData('${homestay.id_homestay}')">
                                            <i class="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `;
                $('#homestayContainer').append(card);
            });
        });
    });

    function editData(id){
        $('#form-edit').attr('action','/homestay/edit/'+id)
        $.getJSON('/api/homestay/'+id, function(data){
            $('#nama').val(data.nama)
            $('#fasilitas').val(data.fasilitas)
            $('#deskripsi').val(data.deskripsi)
            $('#peraturan').val(data.peraturan)
            $('#harga').val(data.harga)
        })
    }

    function deleteData(id){
        $('#form-hapus').attr('action', '/homestay/hapus/'+id)
    }
</script>
@endsection

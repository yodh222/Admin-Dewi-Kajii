@extends('template.sidebar')
@section('title','Ikan Hias')
@section('content')
<h1 class="fw-bold mt-5">Ikan Hias</h1>

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

<h3 class="fw-bold mt-3">Galeri Ikan Hias</h3>
<button type="button" class="btn btn-success mt-2" data-bs-toggle="modal" data-bs-target="#tambahDataIkan">Tambah Ikan Hias</button>

<div id="ikanHiasContainer" class="row mt-5">
</div>


{{-- Modal --}}
{{-- Modal Edit Ikan--}}
<div data-bs-theme="light" class="modal fade" id="editDataIkan" data-bs-backdrop="static" data-bs-keyboard="false"
    tabindex="-1" aria-labelledby="editDataIkanLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="editDataIkanLabel">edit Ikan Hias</h1>
            </div>
            <form action="" id="form-edit-ikan" method="post" enctype="multipart/form-data">
                <div class="modal-body">
                    @csrf
                    <div class="mb-3">
                        <label class="form-label">Nama Ikan Hias</label>
                        <div class="input-group">
                            <input type="text" class="form-control" name="nama" id="namaIkan" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Deskripsi</label>
                        <div class="input-group">
                            <textarea type="text" class="form-control" name="deskripsi" id="deskripsiIkan" required></textarea>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Perawatan</label>
                        <div class="input-group">
                            <textarea type="text" class="form-control" name="perawatan" id="perawatanIkan" required></textarea>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Image Ikan Hias</label>
                        <div class="input-group">
                            <input type="file" class="form-control" name="gambar[]" multiple accept="image/png, image/jpeg" required>
                        </div>
                        <span class="form-text">Disarankan rasio gambar 16:9</span>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Harga Ikan Hias</label>
                        <div class="input-group">
                            <span class="input-group-text">Rp.</span>
                            <input type="number" class="form-control" name="harga" id="hargaIkan" required>
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
{{-- Modal Tambah Ikan--}}
<div data-bs-theme="light" class="modal fade" id="tambahDataIkan" data-bs-backdrop="static" data-bs-keyboard="false"
    tabindex="-1" aria-labelledby="tambahDataIkanLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="tambahDataIkanLabel">Tambah Ikan Hias</h1>
            </div>
            <form action="/katalog/ikan-hias/tambah" method="post" enctype="multipart/form-data">
                <div class="modal-body">
                    @csrf
                    <div class="mb-3">
                        <label class="form-label">Nama Ikan Hias</label>
                        <div class="input-group">
                            <input type="text" class="form-control" name="nama" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Deskripsi</label>
                        <div class="input-group">
                            <textarea type="text" class="form-control" name="deskripsi" required></textarea>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Perawatan</label>
                        <div class="input-group">
                            <textarea type="text" class="form-control" name="perawatan" required></textarea>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Image Ikan Hias</label>
                        <div class="input-group">
                            <input type="file" class="form-control" name="gambar[]" multiple accept="image/png, image/jpeg" required>
                        </div>
                        <span class="form-text">Disarankan rasio gambar 16:9</span>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Harga Ikan Hias</label>
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
{{-- Modal Hapus Ikan--}}
<div data-bs-theme="light" class="modal fade" id="hapusDataIkan" data-bs-backdrop="static" data-bs-keyboard="false"
    tabindex="-1" aria-labelledby="hapusabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="hapusabel">Hapus Ikan Hias</h1>
            </div>
            <div class="modal-body">
                Apakah anda yakin ingin menghapus data ini?
            </div>
            <form action="" id="form-hapus-ikan" method="post">
                <div class="modal-footer">
                    @csrf
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-danger">Hapus</button>
                </div>
            </form>
        </div>
    </div>
</div>

<h3 class="fw-bold mt-5">Kolam Budi Daya Ikan</h3>
<button type="button" data-bs-target="#tambahDataKolam" data-bs-toggle="modal" class="btn btn-success mt-2">Tambah Kolam</button>

<div id="kolamContainer" class="row mt-5">
</div>

{{-- Modal --}}
{{-- Modal Edit Kolam--}}
<div data-bs-theme="light" class="modal fade" id="editDataKolam" data-bs-backdrop="static" data-bs-keyboard="false"
    tabindex="-1" aria-labelledby="editDataKolamLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="editDataKolamLabel">Edit Kolam Ikan</h1>
            </div>
            <form action="" id="form-edit-kolam" method="post" enctype="multipart/form-data">
                <div class="modal-body">
                    @csrf
                    <div class="mb-3">
                        <label class="form-label">Nama Kolam Ikan</label>
                        <div class="input-group">
                            <input type="text" class="form-control" name="nama" id="namaKolam" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Deskripsi</label>
                        <div class="input-group">
                            <textarea type="text" class="form-control" name="deskripsi" id="deskripsiKolam" required></textarea>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Jenis Ikan</label>
                        <div class="input-group">
                            <textarea type="text" class="form-control" name="jenis" id="jenisKolam" required></textarea>
                        </div>
                        <div class="form-text">Pisahkan dengan koma</div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Image Kolam Ikan</label>
                        <div class="input-group">
                            <input type="file" class="form-control" name="gambar[]" multiple accept="image/png, image/jpeg" required>
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
{{-- Modal Tambah Kolam--}}
<div data-bs-theme="light" class="modal fade" id="tambahDataKolam" data-bs-backdrop="static" data-bs-keyboard="false"
    tabindex="-1" aria-labelledby="tambahDataKolamLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="tambahDataKolamLabel">Tambah Kolam Ikan</h1>
            </div>
            <form action="/katalog/kolam-ikan/tambah" method="post" enctype="multipart/form-data">
                <div class="modal-body">
                    @csrf
                    <div class="mb-3">
                        <label class="form-label">Nama Kolam Ikan</label>
                        <div class="input-group">
                            <input type="text" class="form-control" name="nama" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Deskripsi</label>
                        <div class="input-group">
                            <textarea type="text" class="form-control" name="deskripsi" required></textarea>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Jenis Ikan</label>
                        <div class="input-group">
                            <textarea type="text" class="form-control" name="jenis" required></textarea>
                        </div>
                        <div class="form-text">Pisahkan dengan koma</div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Image Kolam Ikan</label>
                        <div class="input-group">
                            <input type="file" class="form-control" name="gambar[]" multiple accept="image/png, image/jpeg" required>
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
{{-- Modal Hapus Kolam--}}
<div data-bs-theme="light" class="modal fade" id="hapusDataKolam" data-bs-backdrop="static" data-bs-keyboard="false"
    tabindex="-1" aria-labelledby="hapusabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="hapusabel">Hapus Kolam Ikan</h1>
            </div>
            <div class="modal-body">
                Apakah anda yakin ingin menghapus data ini?
            </div>
            <form action="" id="form-hapus-kolam" method="post">
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
        $.getJSON('/api/katalog/ikan-hias', function(data){
            $.each(data.ikanhias,function(index, ikanhias){
                var images = ikanhias.gambar.split(',');

                var card = `
                <div class="col-lg-4 col-md-6">
                    <div class="card mb-3 bg-light">
                        <div class="image-container">
                            <img src="${images[0]}" class="card-img" alt="ikanhias1">
                            <div class="overlay">
                                <h5 class="card-title">${ikanhias.nama}</h5>
                                <p class="card-text">${ikanhias.harga}</p>
                                <div class="icon-container">
                                    <button class="btn btn-primary me-2" data-bs-target="#editDataIkan" data-bs-toggle="modal" onclick="editDataIkan('${ikanhias.id_ikan_hias}')">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-danger" data-bs-target="#hapusDataIkan" data-bs-toggle="modal" onclick="deleteDataIkan('${ikanhias.id_ikan_hias}')">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `

                $('#ikanHiasContainer').append(card);
            })
        })
        $.getJSON('/api/katalog/kolam', function(data){
            $.each(data.kolam,function(index, kolam){
                var images = kolam.gambar.split(',');

                var card = `
                <div class="col-lg-4 col-md-6">
                    <div class="card mb-3 bg-light">
                        <div class="image-container">
                            <img src="${images[0]}" class="card-img" alt="kolam1">
                            <div class="overlay">
                                <h5 class="card-title">${kolam.nama}</h5>
                                <div class="icon-container">
                                    <button class="btn btn-primary me-2" data-bs-target="#editDataKolam" data-bs-toggle="modal" onclick="editDataKolam('${kolam.id_kolam}')">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-danger" data-bs-target="#hapusDataKolam" data-bs-toggle="modal" onclick="deleteDataKolam('${kolam.id_kolam}')">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `

                $('#kolamContainer').append(card);
            })
        })
    })
// Function for ikan hias
    function editDataIkan(id){
        $('#form-edit-ikan').attr('action','/katalog/ikan-hias/edit/'+id)

        $.getJSON('/api/katalog/ikan-hias'+id, function(data){
            $('#namaIkan').val(data.nama)
            $('#deskripsiIkan').val(data.deskripsi)
            $('#hargaIkan').val(data.harga)
            $('#perawatanIkan').val(data.perawatan)
        })
    }

    function deleteDataIkan(id){
        $('#form-hapus-ikan').attr('action', '/katalog/ikan-hias/hapus/'+id)
    }

// Function for kolam
    function editDataKolam(id){
        $('#form-edit-kolam').attr('action','/katalog/kolam-ikan/edit/'+id)

        $.getJSON('/api/katalog/kolam'+id, function(data){
            $('#namaKolam').val(data.nama)
            $('#deskripsiKolam').val(data.deskripsi)
            $('#jenisKolam').val(data.jenis_ikan)
        })
    }

    function deleteDataKolam(id){
        $('#form-hapus-kolam').attr('action', '/katalog/kolam-ikan/hapus/'+id)
    }
</script>

@endsection

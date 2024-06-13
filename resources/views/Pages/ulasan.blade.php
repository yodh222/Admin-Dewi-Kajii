@extends('template.sidebar')
@section('title','Ulasan')
@section('content')
<h1 class="fw-bold mt-4">Ulasan & FAQ</h1>

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

{{-- Ulasan --}}
<h3 class="fw-bold mt-5">Ulasan Konsumen</h3>
<button type="button" class="btn btn-success mt-2" data-bs-toggle="modal" data-bs-target="#tambahDataUlasan" onclick="addDataUlasan()">Tambah Ulasan</button>

<div id="ulasanContainer" class="row mt-5">
</div>

{{-- Modal --}}
{{-- Modal Edit --}}
<div data-bs-theme="light" class="modal fade" id="editDataUlasan" data-bs-backdrop="static" data-bs-keyboard="false"
    tabindex="-1" aria-labelledby="editDataUlasanLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="editDataUlasanLabel">Edit Ulasan</h1>
            </div>
            <form action="" id="form-edit-ulasan" method="post" enctype="multipart/form-data">
                <div class="modal-body">
                    @csrf
                    <div class="mb-3">
                        <label class="form-label">Nama Pengunjung</label>
                        <div class="input-group">
                            <select class="form-control id_user" name="id_user" id="user" required>
                                <option selected>Pilih Pengunjung</option>
                            </select>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Ulasan Pengunjung</label>
                        <div class="input-group">
                            <input type="text" class="form-control" name="ulasan"  id="ulasan"
                                required>
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
<div data-bs-theme="light" class="modal fade" id="tambahDataUlasan" data-bs-backdrop="static" data-bs-keyboard="false"
    tabindex="-1" aria-labelledby="tambahDataUlasanLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="tambahDataUlasanLabel">Tambah Ulasan</h1>
            </div>
            <form action="/ulasan/tambah" method="post" enctype="multipart/form-data">
                <div class="modal-body">
                    @csrf
                    <div class="mb-3">
                        <label class="form-label">Nama Pengunjung</label>
                        <div class="input-group">
                            <select class="form-control id_user" name="id_user" id="user" required>
                                <option selected>Pilih Pengunjung</option>
                            </select>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Ulasan Pengunjung</label>
                        <div class="input-group">
                            <input type="text" class="form-control" name="ulasan"
                                required>
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
<div data-bs-theme="light" class="modal fade" id="hapusDataUlasan" data-bs-backdrop="static" data-bs-keyboard="false"
    tabindex="-1" aria-labelledby="hapusDataUlasan" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="hapusDataUlasan">Hapus Ulasan</h1>
            </div>
            <div class="modal-body">
                Apakah anda yakin ingin menghapus data ini?
            </div>
            <form action="" id="form-hapus-ulasan" method="post">
                <div class="modal-footer">
                    @csrf
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-danger">Hapus</button>
                </div>
            </form>
        </div>
    </div>
</div>

{{-- FAQ --}}
<h3 class="fw-bold mt-5">Pertayaan Sering Ditanyakan</h3>
<button type="button" class="btn btn-success mt-2" data-bs-toggle="modal" data-bs-target="#tambahDataPertanyaan">Tambah Pertanyaan</button>

<div id="pertanyaanContainer" class="row mt-5">
</div>

{{-- Modal --}}
{{-- Modal Edit --}}
<div data-bs-theme="light" class="modal fade" id="editDataPertanyaan" data-bs-backdrop="static" data-bs-keyboard="false"
    tabindex="-1" aria-labelledby="editDataPertanyaanLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="editDataPertanyaanLabel">Edit FAQ</h1>
            </div>
            <form action="" id="form-edit-pertanyaan" method="post" enctype="multipart/form-data">
                <div class="modal-body">
                    @csrf
                    <div class="mb-3">
                        <label class="form-label">Pertanyaan Yang Sering Ditanyakan</label>
                        <div class="input-group">
                            <input type="text" class="form-control" name="pertanyaan" id="pertanyaan" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Jawaban</label>
                        <div class="input-group">
                            <textarea type="text" class="form-control" name="jawaban" id="jawaban"
                                required rows="5"></textarea>
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
<div data-bs-theme="light" class="modal fade" id="tambahDataPertanyaan" data-bs-backdrop="static" data-bs-keyboard="false"
    tabindex="-1" aria-labelledby="tambahDataPertanyaanLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="tambahDataPertanyaanLabel">Tambah FAQ</h1>
            </div>
            <form action="/faq/tambah" method="post">
                <div class="modal-body">
                    @csrf
                    <div class="mb-3">
                        <label class="form-label">Pertanyaan Yang Sering Ditanyakan</label>
                        <div class="input-group">
                            <input type="text" class="form-control" name="pertanyaan" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Jawaban</label>
                        <div class="input-group">
                            <textarea type="text" class="form-control" name="jawaban"
                                required rows="5"></textarea>
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
<div data-bs-theme="light" class="modal fade" id="hapusDataPertanyaan" data-bs-backdrop="static" data-bs-keyboard="false"
    tabindex="-1" aria-labelledby="hapusDataPertanyaan" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="hapusDataPertanyaan">Hapus FAQ</h1>
            </div>
            <div class="modal-body">
                Apakah anda yakin ingin menghapus data ini?
            </div>
            <form action="" id="form-hapus-pertanyaan" method="post">
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
        $.getJSON('/api/ulasan/', function(data){
            $.each(data.ulasan, function(index, ulasan){

                var card = `
                <div class="col-sm-3">
                    <div class="card mb-3 bg-light">
                        <div class="row no-gutters text-black">
                            <div class="row-md-8 align-self-center">
                                <div class="card-body text-center">
                                    <h5 class="card-title">${ulasan.nama}</h5>
                                    <p class="card-text">${ulasan.ulasan}</p>
                                    <div class="rounded-circle overflow-hidden mx-auto" style="width: 100px; height: 100px;">
                                        <img src="${ulasan.profil}" class="card-img mb-2" alt="Penulis"
                                        style="width: 100%; height: 100%; object-fit: cover;">
                                    </div>
                                    <button class="btn btn-primary me-2" data-bs-target="#editDataUlasan" data-bs-toggle="modal" onclick="editDataUlasan('${ulasan.id_ulasan}')">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-danger" data-bs-target="#hapusDataUlasan" data-bs-toggle="modal" onclick="deleteDataUlasan('${ulasan.id_ulasan}')">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `

                $('#ulasanContainer').append(card)
            })
        })
        $.getJSON('/api/faq/', function(data){
            $.each(data.faq, function(index, faq){

                var card = `
                <div class="card mb-3">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">

                            <h5 class="card-title fw-bolder">${faq.pertanyaan}</h5>
                            <span>
                                <button class="btn btn-primary me-2" data-bs-target="#editDataPertanyaan" data-bs-toggle="modal" onclick="editDataPertanyaan('${faq.id_faq}')">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-danger" data-bs-target="#hapusDataPertanyaan" data-bs-toggle="modal" onclick="deleteDataPertanyaan('${faq.id_faq}')">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </span>
                        </div>
                        <p class="card-text ms-2">- ${faq.jawaban}</p>
                    </div>
                </div>
                `

                $('#pertanyaanContainer').append(card)
            })
        })
    })

    // Ulasan
    function addDataUlasan(){
        $.getJSON('/api/admin/user', function(data){
            $.each(data, function(index, user){
                console.log(user.nama)
                var user = `<option value="${user.id_user}">${user.nama}</option>`

                $('.id_user').append(user)
            })
        })
    }
    function editDataUlasan(id){
        $('#form-edit-ulasan').attr('action','/ulasan/edit/'+id)

        $.getJSON('/api/ulasan/'+id, function(data){
            $('#user').val(data.id_user)
            $('#ulasan').val(data.ulasan)
        })
    }

    function deleteDataUlasan(id){
        $('#form-hapus-ulasan').attr('action', '/ulasan/hapus/'+id)
    }

    // Pertanyaan
    function editDataPertanyaan(id){
        $('#form-edit-pertanyaan').attr('action','/faq/edit/'+id)

        $.getJSON('/api/faq/'+id, function(data){
            $('#pertanyaan').val(data.pertanyaan)
            $('#jawaban').val(data.jawaban)
        })
    }

    function deleteDataPertanyaan(id){
        $('#form-hapus-pertanyaan').attr('action', '/faq/hapus/'+id)
    }
</script>

@endsection

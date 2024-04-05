@extends('template.sidebar')
@section('title','Paket')
@section('content')
<h1 class="fw-bold mt-5">Paket Wisata</h1>

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
    Paket Wisata</button>

<div class="row mt-5" id="paketContainer">
</div>

{{-- Modal --}}
{{-- Modal Edit --}}
<div data-bs-theme="light" class="modal fade" id="editData" data-bs-backdrop="static" data-bs-keyboard="false"
    tabindex="-1" aria-labelledby="editabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="editabel">Edit Paket Wisata</h1>
            </div>
            <form action="" id="form-edit" method="post" enctype="multipart/form-data">
                <div class="modal-body">
                    @csrf
                    <div class="mb-3">
                        <label class="form-label">Nama Paket Wisata</label>
                        <div class="input-group">
                            <input type="text" class="form-control" name="nama" id="judul" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Durasi Wisata</label>
                        <div class="input-group">
                            <input type="text" class="form-control" name="waktu" id="waktu" required>
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
                        <label class="form-label">Image Paket Wisata</label>
                        <div class="input-group">
                            <input type="file" class="form-control" name="gambar" accept="image/png, image/jpeg" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Harga Paket Wisata</label>
                        <div class="input-group">
                            <span class="input-group-text">Rp.</span>
                            <input type="text" class="form-control" name="harga" id="harga" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Promo Paket Wisata</label>
                        <div class="input-group">
                            <span class="input-group-text">Rp.</span>
                            <input type="text" class="form-control" name="promo" id="promo" required>
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
                <h1 class="modal-title fs-5" id="tambahDataLabel">Tambah Paket Wisata</h1>
            </div>
            <form action="/paket/tambah" method="post" enctype="multipart/form-data">
                <div class="modal-body">
                    @csrf
                    <div class="mb-3">
                        <label class="form-label">Nama Paket Wisata</label>
                        <div class="input-group">
                            <input type="text" class="form-control" name="nama" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Durasi Wisata</label>
                        <div class="input-group">
                            <input type="text" class="form-control" name="waktu" required>
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
                        <label class="form-label">Image Paket Wisata</label>
                        <div class="input-group">
                            <input type="file" class="form-control" name="gambar" accept="image/png, image/jpeg" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Harga Paket Wisata</label>
                        <div class="input-group">
                            <span class="input-group-text">Rp.</span>
                            <input type="text" class="form-control" name="harga" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Promo Paket Wisata</label>
                        <div class="input-group">
                            <span class="input-group-text">Rp.</span>
                            <input type="text" class="form-control" name="promo" required>
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
                <h1 class="modal-title fs-5" id="hapusabel">Hapus Paket Wisata</h1>
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
        $.getJSON('/api/paket-wisata', function(data){
            $.each(data.paket,function(index, paket){
                var fasilitas = paket.fasilitas;
                var fasilitasArray = fasilitas.split(',');

                var elementFasilitas = [];
                for (let i = 0; i < fasilitasArray.length; i++) {
                    const element = fasilitasArray[i];
                    elementFasilitas.push('<li><i class="fas fa-square-check text-success"></i> ' + element + '</li>');
                }

                // Menggabungkan array elemen fasilitas menjadi satu string
                var fasilitasString = elementFasilitas.join('\n');

                var hargaFormatted = paket.harga.toLocaleString('id-ID');

                var card = `
                <div class="col-3">
                    <div class="card border-0 mb-3 bg-light shadow">
                        <div class="row no-gutters text-black">
                            <div class="col-md-12 align-self-center text-center">
                                <img src="${paket.gambar}" class="card-img" alt="Homestay"
                                    style="width: 100%; height: 150px; object-fit: cover;">
                            </div>
                            <div class="col-md-12 align-self-center">
                                <div class="card-body">
                                    <h4 class="card-title  text-center">${paket.judul}</h4>
                                    <p class="card-subtitle mb-2 text-muted  text-center">${paket.waktu}</p>
                                    <div class="mx-4 d-flex justify-content-start flex-column">
                                        <p class="card-subtitle mt-4 fs-6 fw-bold text-left">Fasilitas :</p>
                                        <ul class="list-unstyled text-left">
                                            ${fasilitasString}
                                        </ul>
                                    </div>
                                    <p class="text-center fs-5 fw-bold">Rp. ${paket.harga}/orang</p>
                                    <div class="d-flex justify-content-center">
                                        <button class="btn btn-primary me-2" data-bs-target="#editData" data-bs-toggle="modal" onclick="editData('${paket.id_paket_wisata}')">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn btn-danger" data-bs-target="#hapusData" data-bs-toggle="modal" onclick="deleteData('${paket.id_paket_wisata}')">
                                            <i class="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `;

                $('#paketContainer').append(card)
            })
        })
    })

    function editData(id){
        $('#form-edit').attr('action','/paket/edit/'+id)
        $.getJSON('/api/paket-wisata/'+id, function(data){
            $('#judul').val(data.judul)
            $('#waktu').val(data.waktu)
            $('#harga').val(data.harga)
            $('#promo').val(data.promo)
            $('#fasilitas').val(data.fasilitas)
        })
    }

    function deleteData(id){
        $('#form-hapus').attr('action', '/paket/hapus/'+id)
    }
</script>

@endsection

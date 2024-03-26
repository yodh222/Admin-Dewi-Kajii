@extends('template.sidebar')
@section('title','Dashboard')
@section('content')

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

<h1 class="fw-bold mt-4">Dashboard</h1>

<div class="row mb-3">
    <div class="col-4 p-2">
        <div class="p-3 shadow">
            <span class="fs-6">Perlu Konfirmasi</span>
            <div class="row d-flex align-items-center" style="height: 7rem">
                <div class="col-6 fs-2" style="font-weight: bolder" id="konfirmasi"></div>
                <div class="col-6 fs-2 d-flex justify-content-end" >
                    <div class="rounded-4 p-3 d-flex justify-content-center" style="width:4.5rem;background-color:#ffead8;color:#ff9971;">
                        <i class="fa-solid fa-clock-rotate-left"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-4 p-2">
        <div class="p-3 shadow">
            <span class="fs-6">Pembayaran Depan Muka</span>
            <div class="row d-flex align-items-center" style="height: 7rem">
                <div class="col-6 fs-2" style="font-weight: bolder" id="pembayaran"></div>
                <div class="col-6 fs-2 d-flex justify-content-end" >
                    <div class="rounded-4 p-3 d-flex justify-content-center" style="width:4.5rem;background-color:#e4d8ff;color:#6226ef;">
                        {{-- <i class="fa-solid fa-receipt"></i> --}}
                        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-receipt-2">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16l-3 -2l-2 2l-2 -2l-2 2l-2 -2l-3 2" />
                            <path d="M14 8h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5m2 0v1.5m0 -9v1.5" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-4 p-2">
        <div class="p-3 shadow">
            <span class="fs-6">Pembatalan</span>
            <div class="row d-flex align-items-center" style="height: 7rem">
                <div class="col-6 fs-2" style="font-weight: bolder" id="pembatalan"></div>
                <div class="col-6 fs-2 d-flex justify-content-end" >
                    <div class="rounded-4 p-3 d-flex justify-content-center" style="width:4.5rem;background-color:#ffdedb;color:#f04231;">
                        <i class="fa-solid fa-xmark"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="column">
    <div class="col-6 shadow mb-3 p-3 pt-4" style="width: 100%">
        <span class="fs-6">Chart Pendapatan</span>
        <div class="p-3">
            <canvas id="Chart1" height="100"></canvas>
        </div>
    </div>
    <div class="col-6 shadow mb-3 p-3 pt-4" style="width: 100%">
        <span class="fs-6">Chart Penjualan Paket Wisata</span>
        <div class="p-3">
            <canvas id="Chart2" height="100"></canvas>
        </div>
    </div>
</div>

<h3 class="fw-bold mt-4">Banner Promo</h3>

<button class="btn btn-success mb-3" data-bs-toggle="modal" data-bs-target="#ModalTambah">Tambah Promo</button>
<div class="row" id="promoContainer">

</div>


{{-- Modal Add --}}
<div data-bs-theme="light" class="modal fade" id="ModalTambah" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="ModalTambahLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
            <h1 class="modal-title fs-5" id="ModalTambahLabel">Tambah Artikel</h1>
            </div>
            <form action="{{route('promo.tambah')}}" method="post" enctype="multipart/form-data">
            <div class="modal-body">
                    @csrf
                    <div class="mb-3">
                        <label class="form-label">Judul Promo</label>
                        <div class="input-group">
                            <input type="text" class="form-control" name="judul" aria-describedby="basic-addon3 basic-addon4" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Image Artikel/Berita</label>
                        <div class="input-group">
                            <input type="file" class="form-control" name="gambar" accept="image/png, image/jpeg" aria-describedby="basic-addon3 basic-addon4" required>
                        </div>
                        <div class="form-text" id="basic-addon4">Disarankan rasio gambar adalah 16:9</div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                    <button type="submit" class="btn btn-success">Simpan</button>
                </form>
            </div>
        </div>
    </div>
</div>
{{-- Modal Edit --}}
<div data-bs-theme="light" class="modal fade" id="ModalEdit" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="ModalEditLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
            <h1 class="modal-title fs-5" id="ModalEditLabel">Tambah Artikel</h1>
            </div>
            <form action="{{route('promo.tambah')}}" method="post" enctype="multipart/form-data">
            <div class="modal-body">
                    @csrf
                    <div class="mb-3">
                        <label class="form-label">Judul Promo</label>
                        <div class="input-group">
                            <input type="text" id="judul" class="form-control" name="judul" aria-describedby="basic-addon3 basic-addon4" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Image Artikel/Berita</label>
                        <div class="input-group">
                            <input type="file" class="form-control" name="gambar" accept="image/png, image/jpeg" aria-describedby="basic-addon3 basic-addon4" required>
                        </div>
                        <div class="form-text" id="basic-addon4">Disarankan rasio gambar adalah 16:9</div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                    <button type="submit" class="btn btn-success">Simpan</button>
                </form>
            </div>
        </div>
    </div>
</div>
{{-- Modal Hapus --}}
<div data-bs-theme="light" class="modal fade" id="ModalHapus" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="ModalHapusLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
            <h1 class="modal-title fs-5" id="ModalHapusLabel">Tambah Artikel</h1>
            </div>
            <div class="modal-body">
                Apakah anda yakin ingin menghapus promo ini?
            </div>
            <form action="" method="post" id="formHapus">
                <div class="modal-footer">
                    @csrf
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                    <button type="submit" class="btn btn-success">Hapus</button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
    function editData(id){
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: 'api/promo/'+id,
            success:function(data){
                $('#judul').val(data.promo.judul)
            }
        })
    }

    function hapusData(id){
        $('#formHapus').attr('action', '/promo/hapus/'+id);
    }

    $(document).ready(function(){
        lightbox.option({
            'resizeDuration': 200,
            'wrapAround': true
        });
        $.ajax({
            type: 'GET',
            url: 'api/transaksi/get?data=dashboard',
            dataType: 'json',
            success: function(data){
                $('#konfirmasi').text(data.Data.Process)
                $('#pembayaran').text(data.Data.Dp)
                $('#pembatalan').text(data.Data.Batal)
            }
        });
        $.ajax({
            type: 'GET',
            url: '/api/transaksi/get?data=dashboard',
            dataType: 'json',
            success: function(data){
                // Mengambil data untuk chart dari objek JSON
                var tahunIni = new Date().getFullYear();
                var pendapatan = {};
                var penjualan = {};
                pendapatan[tahunIni] = Object.values(data.Data['Chart Pendapatan'][tahunIni]);
                pendapatan[tahunIni - 1] = Object.values(data.Data['Chart Pendapatan'][tahunIni - 1]);
                penjualan[tahunIni] = Object.values(data.Data['Chart Penjualan Paket Wisata'][tahunIni]);
                penjualan[tahunIni - 1] = Object.values(data.Data['Chart Penjualan Paket Wisata'][tahunIni - 1]);

                var myChart1 = new Chart($('#Chart1'), {
                    type: 'line',
                    data: {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                        datasets: [{
                            label: 'Pendapatan Tahun ' + tahunIni,
                            data: pendapatan[tahunIni],
                            backgroundColor: 'rgba(82,219,150,255)', // Warna latar belakang
                            borderColor: 'rgba(82,219,150,255)',
                            tension: 0.5,
                            fill: false
                        },{
                            label: 'Pendapatan Tahun ' + (tahunIni - 1),
                            data: pendapatan[tahunIni - 1],
                            backgroundColor: 'rgb(192, 75, 192)', // Warna latar belakang
                            borderColor: 'rgb(192, 75, 192)',
                            tension: 0.5,
                            fill: false
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
                var myChart2 = new Chart($('#Chart2'), {
                    type: 'line',
                    data: {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                        datasets: [{
                            label: 'Penjualan Paket ' + tahunIni,
                            data: penjualan[tahunIni],
                            backgroundColor: 'rgb(75, 192, 192)', // Warna latar belakang
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.5,
                            fill: false
                        },{
                            label: 'Penjualan Paket ' + (tahunIni - 1),
                            data: penjualan[tahunIni - 1],
                            backgroundColor: 'rgb(192, 75, 192)', // Warna latar belakang
                            borderColor: 'rgb(192, 75, 192)',
                            tension: 0.5,
                            fill: false
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                                max:50
                            }
                        }
                    }
                });
            }
        });

        $.getJSON('api/promo', function(data){
            $.each(data.promo, function(index, promo){
                var cardHtml = `
                <div class="col-6">
                    <div class="p-2 shadow banner-promo">
                        <span class="fs-3 fw-bolder">${promo.judul}</span>
                        <a href="${promo.gambar}"  data-lightbox="Promo" data-title="Promo Image">
                            <img src="${promo.gambar}" class="card-img-top" alt="...">
                        </a>
                        <div class="card-body mt-2">
                            <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#ModalEdit" onclick='editData(${promo.id_promo})'>
                                <i class="fas fa-edit"></i>
                                Edit
                            </button>
                            <button class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#ModalHapus" onclick='hapusData(${promo.id_promo})'>
                                <i class="fas fa-trash-alt"></i>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>`;

                $('#promoContainer').append(cardHtml);
            });
        });
    })
</script>
@endsection

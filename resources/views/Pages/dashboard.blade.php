@extends('template.sidebar')
@section('title','Dashboard')
@section('content')
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

<script>
    $(document).ready(function(){
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


    })
</script>
@endsection

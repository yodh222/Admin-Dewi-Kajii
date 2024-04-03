@extends('template.sidebar')
@section('title','Transaksi')
@section('content')
<h1 class="fw-bold mt-4">Transaksi</h1>

<div class="mt-3 shadow rounded border p-3 row">
    <div class="col-10">
        <table class="table mb-0 d-flex align-items-center justify-content-between" style="width: 100%">
            <tr>
                <th class="fs-4"><i class="fa-solid fa-filter"></i> Filter By</th>
                <th>
                    <div class="input-group">
                        <span class="input-group-text">Tanggal Pemesanan :</span>
                        <input type="date" class="form-control" id="filter-tanggal-pesanan">
                    </div>
                </th>
                <th>
                    <div class="input-group">
                        <span class="input-group-text">Jenis Order :</span>
                        <select name="" class="form-control" id="filter-jenis-order">
                            <option value="Jenis Order" selected>Jenis Order</option>
                            <option value="1">1</option>
                            <option value="1">1</option>
                            <option value="1">1</option>
                            <option value="1">1</option>
                            <option value="1">1</option>
                        </select>
                    </div>
                </th>
            </tr>
        </table>
    </div>
    <div class="col-2 d-flex justify-content-end align-items-center">
        <span class="fs-5 fw-bold text-danger" id="reset-filter"><i class="fa-solid fa-rotate-right"></i> Reset Filter</span>
    </div>
</div>

<div class="mt-3 border rounded shadow p-3">
    <table id="tableTransaksi" class="table table-striped" style="width:100%">
        <thead>
            <tr>
                <th>Nama Pemesan</th>
                <th>Email</th>
                <th>Kontak</th>
                <th>Jenis Pemesanan</th>
                <th>Code Invoice</th>
                <th>Total Pembayaran</th>
                <th>Bukti Pembayaran</th>
                <th>Check In</th>
                <th>Status Check In</th>
                <th>Tanggal Pemesanan</th>
                <th>Status Pesanan</th>
            </tr>
        </thead>
        <tbody>

        </tbody>
    </table>
</div>

{{-- Modal --}}

<div class="modal fade" id="sendMessage" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="sendMessageLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
            <h1 class="modal-title fs-5" id="sendMessageLabel">Kirim Pesan Ke Pelanggan</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <input type="hidden" name="no_telp" id="no_telp" value="">
                <div class="mb-3">
                    <label for="message" class="form-label">Pesan Anda</label>
                    <div class="input-group">
                        <textarea class="form-control" id="message" cols="30" rows="5"></textarea>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                <button type="button" class="btn btn-primary" onclick="sendMessage()">Kirim</button>
            </div>
        </div>
    </div>
</div>

<script>
    $(document).ready(function() {
        // Set Datatable
        var table = $('#tableTransaksi').DataTable({
            ajax: {
            url: "{{ route('transaksi',['method' => 'get']) }}",
            dataSrc: 'Data'

        },
        columns: [
            {
                data: "nama"
            }, {
                data: 'email'
            }, {
                data: 'no_telp',
                orderable:false,
                render: function(data,type,row){
                    return '<button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#sendMessage" onclick="message(\''+data+'\')"><i class="fa-brands fa-whatsapp"></i></button>';
                }
            }, {
                data: 'jenis_booking'
            }, {
                data: 'code_invoice'
            }, {
                data: 'harga',
                orderable: false,
                render: function(data, type, row){
                    return 'Rp. '+data
                }
            }, {
                data: 'bukti_pembayaran',
                orderable: false,
                render: function(data, type, row) {
                    return '<a class="btn btn-secondary" href="' + data + '" data-lightbox="Bukti Pembayaran" data-title="Bukti Pembayaran"><i class="fas fa-image"></i> Bukti</a>';
                }
            }, {
                data: 'check_in'
            },{
                data: 'status_check_in'
            },{
                data: 'created_at',
                render: function(data, type, row) {
                    return data.substr(0, 10);
                }
            },{
                data: 'status',
                orderable: false,
                render: function(data, type, row) {
                    var color, hover, icon;
                    if (data == 'Process') {
                        bgcolor = '#ff9971';
                        icon = '<i class="fa-solid fa-clock-rotate-left me-1"></i>';
                    }else if (data == 'DP') {
                        bgcolor = '#6226ef';
                        icon = '<i class="fa-solid fa-receipt me-1"></i>';
                    }else if (data == 'Lunas') {
                        bgcolor = '#43F573';
                        icon = '<i class="fa-solid fa-check me-1"></i>';
                    }else{
                        bgcolor = '#f04231';
                        icon = '<i class="fa-solid fa-xmark me-1"></i>';
                    }
                    return '<button class="btn" style="background-color: ' + bgcolor + ';color: #ffffff;" data-bs-toggle="modal" data-bs-target="#editData" onclick="editData(\''+row.id_transaksi+'\')">'+icon+data+' </button>';
                }
            }
        ],
        });

        // Set Feature filtering table
        $('#filter-tanggal-pesanan').change(function(){
            var tanggalPesanan = $('#filter-tanggal-pesanan').val();
            table.columns(7).search(tanggalPesanan).draw();
        })
        $('#filter-jenis-order').change(function(){
            var jenisOrder = $('#filter-jenis-order').val();
            table.columns(3).search(jenisOrder).draw();
        })

        $('#reset-filter').click(function() {
            $('#filter-tanggal-pesanan').val('');
            $('#filter-jenis-order').val('Jenis Order');
            table.columns(7).search('').draw();
            table.columns(3).search('').draw();
        });



        // Initialization Glightbox for previewing image
        lightbox.option({
            'resizeDuration': 200,
            'wrapAround': true
        })
    })

    // Function Section
    function message(no_telp){
            $('#no_telp').val(no_telp);
    }

    function sendMessage(){
        // Set
        $.ajax({
            url: '/api/transaksi/send',
            type: 'get',
            dataType: 'json',
            data: {
                no_telp: $('#no_telp').val(),
                message: $('#message').val()
            },
            success: function(data){
                location.reload()
            }
        })
    }

</script>

@endsection

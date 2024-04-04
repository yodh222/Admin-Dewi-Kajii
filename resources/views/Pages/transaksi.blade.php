@extends('template.sidebar')
@section('title','Transaksi')
@section('content')
<h1 class="fw-bold mt-4">Transaksi</h1>

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

<button class="btn btn-success" data-bs-target="#tambahData" data-bs-toggle="modal">Tambah Transaksi</button>

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
                            <option selected>Jenis Order</option>
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
{{-- Modal Send Message --}}
<div class="modal fade" id="sendMessage" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="sendMessageLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
            <h1 class="modal-title fs-5" id="sendMessageLabel">Kirim Pesan Ke Pelanggan</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label for="no_telp" class="form-label">Nomor Tujuan</label>
                    <div class="input-group">
                        <input class="form-control" type="text" name="no_telp" id="no_telp" disabled>
                    </div>
                </div>
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
{{-- Modal Edit Data --}}
<div class="modal fade" id="editData" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="editDataLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
            <h1 class="modal-title fs-5" id="editDataLabel">Edit Data Transaksi</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form action="" method="post" id="form-edit-data">
                <div class="modal-body">
                    @csrf
                    <div class="mb-3">
                        <label for="check_in" class="form-label">Tanggal Check-In</label>
                        <div class="input-group">
                            <input type="date" name="check_in" class="form-control" id="check_in" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="jenis_pesanan" class="form-label">Jenis Pemesanan</label>
                        <div class="input-group">
                            <select name="id_jenis" class="form-control selectJenis" id="jenis_pesanan" required>
                                <option selected>Jenis Pesanan</option>
                            </select>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="total" class="form-label">Total Pembayaran</label>
                        <div class="input-group">
                            <span class="input-group-text">Rp.</span>
                            <input type="number" name="harga" class="form-control total" id="total" disabled>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="dibayarkan" class="form-label">Total yang dibayarkan</label>
                        <div class="input-group">
                            <span class="input-group-text">Rp.</span>
                            <input type="number" name="dibayarkan" class="form-control" id="dibayarkan" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="status" class="form-label">Status</label>
                        <div class="input-group">
                            <select name="status" class="form-control" id="status" required>
                                <option value="Lunas">Lunas</option>
                                <option value="DP">DP</option>
                                <option value="Process">Process</option>
                                <option value="Batal">Batal</option>
                            </select>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="status_check_in" class="form-label">Status Check-In</label>
                        <div class="input-group">
                            <select name="status_check_in" class="form-control" id="status_check_in" required>
                                <option value="Sudah">Sudah</option>
                                <option value="Belum">Belum</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                    <button type="submit" class="btn btn-primary">Kirim</button>
                </div>
            </form>
        </div>
    </div>
</div>
{{-- Modal Tambah Data --}}
<div class="modal fade" id="tambahData" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="tambahDataLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
            <h1 class="modal-title fs-5" id="tambahDataLabel">Tambah Data Transaksi</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form action="/transaksi/tambah" method="post" enctype="multipart/form-data">
                <div class="modal-body">
                    @csrf

                    <div class="mb-3">
                        <label class="form-label">Nama Pemesan</label>
                        <div class="input-group">
                            <select name="id_user" class="form-control" id="id_user" required>
                                <option selected>Nama Pemesan</option>
                            </select>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Email Pemesan</label>
                        <div class="input-group">
                            <input type="text" class="form-control" id="email_pemesan" disabled>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Nomor Telepon</label>
                        <div class="input-group">
                            <input type="text" class="form-control" id="nomor_telepon" disabled>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Bukti Pembayaran</label>
                        <div class="input-group">
                            <input type="file" name="bukti_pembayaran" class="form-control" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Tanggal Check-In</label>
                        <div class="input-group">
                            <input type="date" name="check_in" class="form-control" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Jenis Pemesanan</label>
                        <div class="input-group">
                            <select name="id_jenis" class="form-control selectJenis" required>
                                <option selected>Jenis Pesanan</option>
                            </select>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Total Pembayaran</label>
                        <div class="input-group">
                            <span class="input-group-text">Rp.</span>
                            <input type="number" class="form-control total" disabled>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Total yang dibayarkan</label>
                        <div class="input-group">
                            <span class="input-group-text">Rp.</span>
                            <input type="number" name="dibayarkan" class="form-control" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Status</label>
                        <div class="input-group">
                            <select name="status" class="form-control" required>
                                <option value="Lunas">Lunas</option>
                                <option value="DP">DP</option>
                                <option value="Process" selected>Process</option>
                                <option value="Batal">Batal</option>
                            </select>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Status Check-In</label>
                        <div class="input-group">
                            <select name="status_check_in" class="form-control" required>
                                <option value="Sudah">Sudah</option>
                                <option value="Belum" selected>Belum</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                    <button type="submit" class="btn btn-primary">Kirim</button>
                </div>
            </form>
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
                    data: 'status_check_in',
                    orderable: false,
                    render: function(data, type, row){
                        if (data == 'Belum') {
                            color = 'btn-danger';
                            icon = '<i class="fa-solid fa-xmark me-1"></i>';
                        }else{
                            color = 'btn-success';
                            icon = '<i class="fa-solid fa-check me-1"></i>';
                        }
                        return '<span class="btn '+color+'">'+icon+'</span>';
                    }
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

        // Set filtering table
        $('#filter-tanggal-pesanan').change(function(){
            var tanggalPesanan = $('#filter-tanggal-pesanan').val();
            table.columns(7).search(tanggalPesanan).draw();
        })
        $('#filter-jenis-order').change(function(){
            var jenisOrder = $('#filter-jenis-order').val();
            console.log(jenisOrder)
            table.columns(3).search(jenisOrder).draw();
        })

        $('#reset-filter').click(function() {
            $('#filter-tanggal-pesanan').val('');
            $('#filter-jenis-order').val('Jenis Order');
            table.columns(7).search('').draw();
            table.columns(3).search('').draw();
        });

        // Checking input on edit data
        $('#dibayarkan').on('input', function() {
            var dibayarkan = $(this).val();
            var total = $('#total').val();
            if (dibayarkan == total) {
                $('#status').val('Lunas');
            } else {
                $('#status').val('Process');
            }
        });

        // Set Option for select Jenis Pemesanan
        $.getJSON('/api/transaksi/jenis-booking', function(data){
            $.each(data.jenis, function(index, jenis){
                var cardHtml = `<option value="${jenis.id_jenis}">${jenis.nama}</option>`;
                $('.selectJenis').append(cardHtml);
                $('#filter-jenis-order').append(cardHtml);
            });
        });
        // Auto set value on total pembayaran
        $('.selectJenis').change(function(){
            $.getJSON('/api/transaksi/jenis-booking/'+$(this).val(), function(data){
                $('.total').val(data.harga)
            })
        })

        // Set Option for select User
        $.getJSON('/api/user', function(data){
            $.each(data.users, function(index, users){
                var cardHtml = `<option value="${users.id_user}">${users.nama}</option>`;
                $('#id_user').append(cardHtml);
            });
        });
        // Auto set value on field email and nomor telepon
        $('#id_user').change(function() {
            var idUser = $(this).val();
            $.getJSON('/api/user/'+idUser, function(data){
                $('#email_pemesan').val(data.email);
                $('#nomor_telepon').val(data.no_telp);
            })
        })

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

    function editData(id){
        $('#form-edit-data').attr('action', '/transaksi/edit/'+id);
        $.ajax({
            url: '/api/transaksi/get?id='+id,
            dataType: 'json',
            type: 'get',
            success: function(data){
                $('.selectJenis').val(data.id_jenis)
                $('#check_in').val(data.check_in)
                $('#total').val(data.harga)
                $('#dibayarkan').val(data.dibayarkan)
                $('#status').val(data.status)
                $('#status_check_in').val(data.status_check_in)
            }
        })
    }

</script>

@endsection

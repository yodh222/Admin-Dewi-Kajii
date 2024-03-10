<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Adadssad</title>
    <link href="{{ asset('vendor/bootstrap/css/bootstrap.css') }}" rel="stylesheet">
    <script src="https://kit.fontawesome.com/ac8a45e20d.js" crossorigin="anonymous"></script>
    <script src="{{ asset('vendor/bootstrap/js/bootstrap.js') }}"></script>

    <link rel="stylesheet" href="{{asset('vendor/datatable/css/dataTables.bootstrap5.min.css')}}">
    <script src="{{asset('vendor/jquery/jquery-3.7.1.js')}}"></script>
    <script src="{{asset('vendor/datatable/js/jquery.dataTables.min.js')}}"></script>
    <script src="{{asset('vendor/datatable/js/dataTables.bootstrap5.min.js')}}"></script>
</head>

<body class="p-4">

    <button class="btn btn-primary mb-3">
        Tambah Data
    </button>
    <input type="text" id="custom-filter" placeholder="Cari nama...">
    <div class="card px-2 py-0 pt-1">
        <table class="table mb-0" id="table" style="width: 100%;">
            <thead>
                <tr>
                    <th scope="col">No</th>
                    <th>Nama</th>
                    <th>No Telp</th>
                    <th>Jenis Pesanan</th>
                    <th>Code Invoice</th>
                    <th>Check In</th>
                    <th>Total</th>
                    <th>Bukti Pembayaran</th>
                    <th>Status</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>

            </tbody>
        </table>
    </div>

</body>

<script>
$(document).ready(function() {
    var table = $('#table').DataTable({
        ajax: {
            url: "{{ route('api') }}",
            dataSrc: 'Data'

        },
        columns: [{
                data: null,
                render: function(data, type, row, meta) {
                    return meta.row + 1;
                }
            },
            {
                data: "nama"
            }, {
                data: 'no_telp'
            }, {
                data: 'id_jenis'
            }, {
                data: 'code_invoice'
            }, {
                data: 'check_in'
            }, {
                data: 'total_pembayaran'
            }, {
                data: 'bukti_pembayaran'
            }, {
                data: 'status'
            }
        ]
    });
    $('#custom-filter').on('keyup', function() {
        var keyword = $(this).val().toLowerCase(); // Ambil nilai input filter dan ubah ke huruf kecil

        // Update filter pada DataTables
        table.search(keyword).draw();
    });

    $.ajax({
        url: "{{ route('api') }}",
        type: 'GET',
        success: function(response) {
            console.log(response.Data);
        },
        error: function(xhr, status, error) {
            console.error(xhr.responseText);
        }
    });

});
</script>

</html>
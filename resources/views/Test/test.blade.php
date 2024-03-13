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

    <div class="modal fade" id="editData" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="editDataLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="editDataLabel">Edit Transaksi</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form action="" id="editForm" method="post" enctype="multipart/form-data">
                    <div class="modal-body">
                        @csrf
                        <div class="mb-3">
                            <label for="id_user" class="form-label">Nama User</label>
                            <div class="input-group">
                                <select class="form-select" aria-label="Default select example" name="id_user">
                                    <option selected>Pilih User</option>
                                    @foreach($User as $user)
                                    <option value="{{ $user->id_user }}">{{ $user->nama }}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="id_jenis" class="form-label">Jenis Pesanan</label>
                            <div class="input-group">
                                <select class="form-select" aria-label="Default select example" name="id_user">
                                    <option selected>Pilih Jenis Pesanan</option>
                                    @foreach($User as $user)
                                    <option value="{{ $user->id_user }}">{{ $user->nama }}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="check_in" class="form-label">Check In</label>
                            <div class="input-group">
                                <input type="date" class="form-control" id="check_in"
                                    aria-describedby="basic-addon3 basic-addon4" name="check_in"
                                    placeholder="Tanggal Check In">
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="dibayarkan" class="form-label">Dibayarkan</label>
                            <div class="input-group">
                                <input type="number" class="form-control" id="dibayarkan"
                                    aria-describedby="basic-addon3 basic-addon4" name="dibayarkan"
                                    placeholder="Jumlah yang telah dibayarkan">
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="bukti_pembayaran" class="form-label">Bukti Pembayaran</label><br>
                            <img src="{{asset('uploads/bukti_pembayaran/dummy.png')}}" id="myImg" class="img-fluid">
                            <div id="myModel" class="modal">
                                <span class="close">&times;</span>
                                <img src="{{asset('uploads/bukti_pembayaran/dummy.png')}}" id="preview"
                                    class="modal-content">
                            </div>

                            <div class="input-group">
                                <input type="file" class="form-control" id="bukti_pembayaran"
                                    aria-describedby="basic-addon3 basic-addon4" name="bukti_pembayaran">
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                        <button type="submit" class="btn btn-warning">Edit</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <br><br><br><br>
    <form action="" method="post" enctype="multipart/form-data">
        @csrf
        <input type="file" name="bukti_pembayaran" accept="image/png, image/jpeg">
        <input type="submit" value="Kirim">
    </form>
</body>

<script>
$(document).ready(function() {
    var table = $('#table').DataTable({
        ajax: {
            url: "{{ route('transaksi',['method' => 'get']) }}",
            dataSrc: 'Data'

        },
        columns: [{
                data: null,
                orderable: false,
                render: function(data, type, row, meta) {
                    return meta.row + 1;
                }
            },
            {
                data: "nama"
            }, {
                data: 'no_telp'
            }, {
                data: 'jenis_wisata'
            }, {
                data: 'code_invoice'
            }, {
                data: 'check_in'
            }, {
                data: 'harga'
            }, {
                data: 'bukti_pembayaran'
            }, {
                data: 'status'
            }, {
                data: null,
                orderable: false,
                render: function(data, type, row) {
                    return '<button type="button" data-bs-toggle="modal" data-bs-target="#editData" class="btn btn-warning btn-sm"><i class="fa-solid fa-pen-to-square"></i></button> ' +
                        '<button type="button" data-bs-toggle="modal" data-bs-target="#deleteData" class="btn btn-danger btn-sm"><i class="fa-solid fa-trash-can"></i></button>';
                }
            }
        ],
        order: [1, 'asc']
    });
    $('#custom-filter').on('keyup', function() {
        var keyword = $(this).val().toLowerCase();

        table.column(7).search(keyword)
            .draw();
    });

    function editAnggota(id) {
        $.ajax({
            url: '/Admin/api/anggota/' + id,
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                $('#editForm').attr('action', '/Admin/Anggota/Edit/' + data.id)
                $('#NamaLengkap').val(data.nama_lengkap);
                $('#Email').val(data.email);
                $('#NoTelp').val(data.no_telp);
                $('#Alamat').val(data.alamat);
                $('#Password').val(data.password);
            }
        });
    }

    function deleteAnggota(id) {
        $('#deleteForm').attr('action', '/Admin/Anggota/Delete/' + id);
    }

    // Ketika gambar diklik, tampilkan modals
    $("#myImg").click(function() {
        console.log("fuck");
        $("#myModal").css("display", "block");
        // $("#preview").attr("src", $(this).attr("src")); // Set gambar dalam modals ke gambar yang diklik
    });

    // Ketika tombol penutup diklik, sembunyikan modals
    $(".close").click(function() {
        $("#myModal").css("display", "none");
    });


});
</script>

</html>
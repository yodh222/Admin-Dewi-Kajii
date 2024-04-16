@extends('template.sidebar')
@section('title', 'Tentang Kami')
@section('content')
<h1 class="fw-bold mt-5">Tentang Kami</h1>

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

<h3 class="fw-bold mt-5">Profil Desa</h3>

{{-- Profile --}}

<div id="profile"></div>

{{-- Modal Edit --}}
<div data-bs-theme="light" class="modal fade" id="editDataProfile" data-bs-backdrop="static" data-bs-keyboard="false"
    tabindex="-1" aria-labelledby="editDataProfileLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="editDataProfileLabel">Edit Profile</h1>
            </div>
            <form action="/profile/edit/1" method="post">
                <div class="modal-body">
                    @csrf
                    <div class="mb-3">
                        <label class="form-label">Deskripsi Profile</label>
                        <div class="input-group">
                            <textarea class="form-control" name="deskripsi" id="deskripsi" rows="10"></textarea>
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

{{-- Timeline --}}

<h3 class="fw-bold mt-5">Timeline</h3>
<button type="button" class="mb-3 btn btn-success">Tambah Timeline</button>

<div id="timeline"></div>

{{-- Modal --}}
{{-- Modal Edit --}}
<div data-bs-theme="light" class="modal fade" id="editDataTimeline" data-bs-backdrop="static" data-bs-keyboard="false"
    tabindex="-1" aria-labelledby="editDataTimelineLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="editDataTimelineLabel">Edit Timeline</h1>
            </div>
            <form action="" id="form-edit-timeline" method="post" enctype="multipart/form-data">
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
<div data-bs-theme="light" class="modal fade" id="tambahDataTimeline" data-bs-backdrop="static" data-bs-keyboard="false"
    tabindex="-1" aria-labelledby="tambahDataTimelineLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="tambahDataTimelineLabel">Tambah timeline</h1>
            </div>
            <form action="/timeline/tambah" method="post" enctype="multipart/form-data">
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
<div data-bs-theme="light" class="modal fade" id="hapusDataTimeline" data-bs-backdrop="static" data-bs-keyboard="false"
    tabindex="-1" aria-labelledby="hapusDataTimeline" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="hapusDataTimeline">Hapus Timeline</h1>
            </div>
            <div class="modal-body">
                Apakah anda yakin ingin menghapus data ini?
            </div>
            <form action="" id="form-hapus-timeline" method="post">
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
        $.getJSON('/api/profile/', function(data) {
            var card = `
            <div class="shadow-lg p-3 card">
                <div class="card-body">
                    <p class="card-text fs-6">${data.profile.deskripsi}</p>
                </div>
                <div class="d-flex justify-content-end">
                    <button class="btn btn-primary me-2" data-bs-target="#editDataProfile" data-bs-toggle="modal" onclick="editDataProfile()">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </div>
            `

            $('#profile').append(card)

            $.each(data.timeline, function(index, timeline) {
                var date = timeline.tanggal.split('-')
                var dateInt = parseInt(date[1])
                var month = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

                var time = date[2] + ' ' + month[dateInt - 1] + ', ' + date[0]

                var timeline = `
                <div class="shadow p-3 card">
                    <div class="card-body">
                        <div class="my-1 d-flex justify-content-end">
                            <button class="btn btn-primary me-2" data-bs-target="#editDataTimeline" data-bs-toggle="modal" onclick="editDataTimeline('${timeline.id_timeline}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger" data-bs-target="#hapusDataTimeline" data-bs-toggle="modal" onclick="deleteDataTimeline('${timeline.id_timeline}')">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                        <span class="fs-6">${time}</span><br>
                        <span class="fw-bolder fs-4">Pembukaan Desa Wisata Kajii</span>
                        <p>${timeline.deskripsi}</p>
                        <img width="200" src="${timeline.gambar}" alt="">
                    </div>
                </div>
                `

                $('#timeline').append(timeline)
            })
        })
    })

    function editDataProfile(){
        $.getJSON('/api/profile', function(data){
            console.log(data.profile)

            $('#deskripsi').val(data.profile.deskripsi)
        })
    }
</script>

@endsection

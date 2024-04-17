@extends('template.sidebar')
@section('title','Profile Admin')
@section('content')


<form action="/profile/edit" method="post" enctype="multipart/form-data">
    @csrf
    <div class="mx-3 my-4 ">
        <div class="d-flex justify-content-center">
            <div class="d-flex flex-column">
                <img src="/assets/image/default-profile.jpg" alt="Profil Image" width="150" height="150" class="rounded-circle">
            </div>
        </div>
        <div class="row mt-2">
            <div class="col-6">
                <div class="mb-3">
                    <label for="nama" class="form-label">Nama</label>
                    <div class="input-group">
                        <input type="text" class="form-control" id="nama" name="nama" aria-describedby="basic-addon3 basic-addon4" required value="{{$user->nama}}" readonly>
                    </div>
                </div>
            </div>
            <div class="col-6">
                <div class="mb-3">
                    <label for="no_telp" class="form-label">Nomor Telepon</label>
                    <div class="input-group">
                        <input type="text" class="form-control" id="no_telp" name="no_telp" aria-describedby="basic-addon3 basic-addon4" required value="{{$user->no_telp}}">
                    </div>
                </div>
            </div>
            <div class="col-6">
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <div class="input-group">
                        <input type="text" class="form-control" id="email" name="email" aria-describedby="basic-addon3 basic-addon4" required value="{{$user->email}}">
                    </div>
                </div>
            </div>
            <div class="col-6">
                <div class="mb-3">
                    <label for="alamat" class="form-label">Alamat</label>
                    <div class="input-group">
                        <textarea class="form-control" id="alamat" name="alamat" aria-describedby="basic-addon3 basic-addon4" required>{{$user->alamat}}</textarea>
                    </div>
                </div>
            </div>
            <div class="col-6">
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <div class="input-group">
                        <input type="password" class="form-control" id="password" name="password" aria-describedby="basic-addon3 basic-addon4" required autocomplete="off">
                        <span class="input-group-text toggle-password">
                            <i class="fa-solid fa-eye"></i>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="d-flex justify-content-center mt-4">
            <button type="submit" class="btn btn-primary"><i class="fa-solid fa-pen-to-square"></i> Update</button>
            <a href="/dashboard" class="btn btn-danger ms-3"><i class="fa-solid fa-xmark"></i> Batal</a>
        </div>
    </div>
</form>

<script>
    $(document).ready(function(){
        $('.toggle-password').click(function(){
            var passwordField = $('#password');
            var eyeIcon = $(this).find('i');

            if(passwordField.attr('type') === 'password'){
                passwordField.attr('type', 'text');
                eyeIcon.removeClass('fa-eye').addClass('fa-eye-slash');
            } else {
                passwordField.attr('type', 'password');
                eyeIcon.removeClass('fa-eye-slash').addClass('fa-eye');
            }
        });
    });
</script>

@endsection

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login Test</title>

    <link rel="stylesheet" href="/vendor/bootstrap/css/bootstrap.css">
    <script src="https://kit.fontawesome.com/ae360af17e.js" crossorigin="anonymous"></script>
    <script src="/vendor/jquery/jquery-3.7.1.js"></script>
</head>

<body style="height: 100vh;" class="d-flex justify-content-center align-items-center">
    <div style="width: 25rem;" class="border p-3">
        <form action="{{route('admin-login')}}" method="post">
            @csrf
                <h3 align="center" class="mb-3">Login Admin</h3>
                <div class="mb-3">
                    <label for="basic-url" class="form-label">Email</label>
                    <div class="input-group">
                        <input type="text" name="email" class="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4" required>
                        </div>
                </div>
                <div class="mb-3">
                    <label for="basic-url" class="form-label">Password</label>
                    <div class="input-group">
                        <input type="password" id="inputPassword" name="password" class="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4" required>
                        <span class="input-group-text toggle-password">
                            <i class="fa-solid fa-eye"></i>
                        </span>
                    </div>
                </div>
                <input type="submit" class="form-control btn btn-success mt-4" id="basic-url" aria-describedby="basic-addon3 basic-addon4" value="Log In">
        </form>
    </div>

    @if(session('sessionError'))
    <div class="alert alert-success">
        {{ session('sessionError') }}
    </div>
    @endif

    <script>
        $(document).ready(function(){
            $('.toggle-password').click(function(){
                var passwordField = $('#inputPassword');
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
</body>

</html>

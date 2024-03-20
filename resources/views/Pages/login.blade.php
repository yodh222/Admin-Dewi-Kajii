<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login Test</title>

    <style>
    body {
        font-family: 'Inter', sans-serif;
        background-image: url("{{asset ('image/Ikan-Hias-Air-Tawar.jpg')}}");
        background-size: cover;
        background-position: center;
    }

    .logintitle {
        font-size: 30px;
        text-align: center;
        font-weight: bolder;
    }

    .container {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
    }

    form {
        width: 400px;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    form input{
        width: 395px;
        padding: 10px;
        margin-bottom: 15px;
        align-items: center;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    form button {
        font-weight: bolder;
        background-color: #22861d;
        color: white;
        padding: 10px 15px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        margin-top: 20px;
        width: 100%;
    }

    form button:hover {
        background-color: #ffffff;
        color: #22861d;
        border: 1px solid #22861d;
        font-weight: bolder;
    }

    label {
        font-size: 15px;
    }
    </style>
</head>

<body>
    <div class="container">
        <form action="{{route('admin-login')}}" method="post">
            @csrf
            <table>
                <tr>
                    <div class="logintitle">LOGIN ADMIN</div>
                </tr>
                <tr>
                    <td><label for="email">Email</label></td>
                </tr>
                <tr>
                    <td><input type="text" name="email" id="" required></td>
                </tr>
                <br>
                <tr>
                    <td><label for="password">Password</label></td>
                </tr>
                <tr>
                    <td><input type="password" name="password" id="" required><br></td>
                </tr>
                <tr>
                    <td><button type="submit" value="kirim">Log In</td>
                </tr>
            </table>
        </form>
    </div>

    @if(session('sessionError'))
    <div class="alert alert-success">
        {{ session('sessionError') }}
    </div>
    @endif

</body>

</html>

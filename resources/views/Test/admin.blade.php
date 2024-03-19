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
    }

    .container {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
    }

    form {
        width: 400px;
        margin: 20px auto;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    form input[type="password"],
    form input[type="text"],
    form textarea {
        width: 395px;
        padding: 10px;
        margin-bottom: 15px;
        align-items: center;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    form button {
        background-color: #097804;
        color: white;
        padding: 10px 15px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        margin-top: 20px;
        position: relative;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-style: bold;
    }

    form button:hover {
        background-color: #ffffff;
        color: #097804;
        padding: 10px 15px;
        border: 1px solid #097804;
        border-radius: 8px;
        cursor: pointer;
        margin-bottom: 5px;
        font-style: bold;
    }

    label {
        font-size: 15px;
    }

    form a {
        text-decoration: none;
        background-color: #1640D6;
        color: white;
        padding: 5px 10px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    form a:hover {
        background-color: #001B79;
    }
    </style>
</head>

<body>
    <div class="container">
        <form action="{{route('admin-login')}}" method="post">
            @csrf
            <table>
                <tr>
                    <div class="logintitle"> LOGIN ADMIN </div>
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
                    <td><input type="text" name="password" id="" required><br></td>
                </tr>
                <tr>
                    <td><button type="submit" value="kirim">LOGIN</td>
                </tr>
            </table>
        </form>
    </div>

    <!-- <form action="{{route('admin-login')}}" method="post">
        @csrf
        <label for="email">Email</label><br>
        <input type="text" name="email" id=""><br>
        <label for="password">Password</label><br>
        <input type="text" name="password" id=""><br><br>
        <input type="submit" value="kirim">
    </form> -->

    @if(session('sessionError'))
    <div class="alert alert-success">
        {{ session('sessionError') }}
    </div>
    @endif

</body>

</html>
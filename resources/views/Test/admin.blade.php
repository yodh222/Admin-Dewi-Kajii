<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login Test</title>
</head>

<body>
    <form action="{{route('admin-login')}}" method="post">
        @csrf
        <label for="email">Email</label><br>
        <input type="text" name="email" id=""><br>
        <label for="password">Password</label><br>
        <input type="text" name="password" id=""><br><br>
        <input type="submit" value="kirim">
    </form>
</body>

</html>
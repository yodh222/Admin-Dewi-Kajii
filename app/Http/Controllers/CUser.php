<?php

namespace App\Http\Controllers;

use App\Models\MUser;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Validator;

class CUser extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $authorizationHeader = $request->header('Authorization');
        if ($authorizationHeader) {
            $token = explode(' ', $authorizationHeader)[1];

            $data = MUser::where('token', $token)->first();
            if ($data) {
                return response()->json($data, 200, [], JSON_PRETTY_PRINT);
            } else {
                return response()->json([
                    'message' => 'error',
                    'info' => 'User tidak ditemukan'
                ], 404, [], JSON_PRETTY_PRINT);
            }
        } else {
            return response()->json(['message' => 'error', 'info' => 'Token kosong'], 400);
        }
    }

    public function adminGet($id = null)
    {
        if ($id != null) {
            $data = MUser::where('id_user', $id)->first();
            return response()->json($data, 200, [], JSON_PRETTY_PRINT);
        }
        return response()->json(MUser::all(), 200, [], JSON_PRETTY_PRINT);
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'nama' => 'required|string|max:255',
            'username' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:tb_user',
            'no_telp' => 'required|string|max:255',
            'password' => 'required|string|max:255',
        ]);

        if ($validation->fails()) {
            $info = $validation->errors()->has('email') ? 'Email yang anda masukkan sudah ada' : 'Data yang anda masukkan tidak valid';
            return response()->json([
                'message' => 'error',
                'info' => $info,
            ], 400, [], JSON_PRETTY_PRINT);
        }

        $path_file = 'assets/image/avatar-1.png';

        MUser::create([
            'nama' => $request->input('nama'),
            'username' => $request->input('username'),
            'email' => $request->input('email'),
            'no_telp' => $request->input('no_telp'),
            'password' => Hash::make($request->input('password')),
            'profil' => $path_file,
            'token' => ''
        ]);

        return response()->json([
            'message' => 'success',
            'info' => 'Data user berhasil ditambahkan',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(MUser $mUser)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validation = Validator::make($request->all(), [
            'nama' => 'required|string|max:255',
            'username' => 'required|string|max:255',
            'email' => [
                'required',
                'lowercase',
                'string',
                'email',
                'max:255',
                Rule::unique('tb_user')->ignore($id, 'id_user'),
            ],
            'no_telp' => 'required|string|max:255',
            'password' => 'required|string|max:255',
        ]);

        if ($validation->fails()) {
            $info = $validation->errors()->has('email') ? 'Email yang anda masukkan sudah ada' : 'Data yang anda masukkan tidak valid';
            return response()->json([
                'message' => 'error',
                'info' => $info,
            ], 400, [], JSON_PRETTY_PRINT);
        }

        $user = MUser::where('id_user', $id);

        $user->update([
            'nama' => $request->input('nama'),
            'username' => $request->input('username'),
            'email' => $request->input('email'),
            'no_telp' => $request->input('no_telp'),
            'password' => Hash::make($request->input('password')),
        ]);

        return response()->json([
            'message' => 'success',
            'info' => 'Data user berhasil diupdate',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MUser $mUser)
    {
        //
    }

    public function login(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'email' => 'required|string|lowercase|email|max:255',
            'password' => 'required|string|max:255',
        ]);
        if ($validation->fails()) {
            return response()->json([
                'message' => 'error',
                'info' => 'Data yang anda masukkan tidak valid',
            ], 200, [], JSON_PRETTY_PRINT);
        }

        $user = MUser::where('email', $request->input('email'))->first();
        if ($user->password && Hash::check($request->input('password'), $user->password)) {
            $token = $user ? $this->encrypt([
                'id_user' => $user->id_user,
                'email' => $user->email,
            ], 'DewiiKajiiSecret') : '';
            $user->update(['token' => $token]);
            return response()->json([
                'message' => 'success',
                'token' => $token
            ]);
        } else if (!Hash::check($request->input('password'), $user->password)) {
            return response()->json(['message' => 'error', 'info' => 'Password yang anda masukkan salah'], 400, [], JSON_PRETTY_PRINT);
        } else if (!$user) {
            return response()->json(['message' => 'error', 'info' => 'Email yang anda masukkan tidak terdaftar'], 400, [], JSON_PRETTY_PRINT);
        }
    }

    public function logout(Request $request)
    {
        $user = MUser::where('token', $request->token)->first();
        if ($user) {
            $user->update(['token' => '']);
            return response()->json(['message' => 'success', 'info' => 'Logout Berhasil'], 200, [], JSON_PRETTY_PRINT);
        } else {
            return response()->json(['message' => 'error', 'info' => 'Logout Gagal'], 400, [], JSON_PRETTY_PRINT);
        }
    }

    public function checkToken(Request $request)
    {
        $authorizationHeader = $request->header('Authorization');
        if ($authorizationHeader) {
            // Mengekstrak token dari header Authorization
            $token = explode(' ', $authorizationHeader)[1];

            // Memeriksa apakah token valid
            $data = MUser::where('token', $token)->first();

            return response()->json([
                'message' =>  $data ? 'success' : 'error',
                'info' => $data ? 'Token valid' : 'Token tidak valid'
            ], $data ? 200 : 400);
        } else {
            // Jika header Authorization tidak ada atau tidak memiliki nilai
            return response()->json(['message' => 'error', 'info' => 'Token kosong'], 400);
        }
    }

    private function encrypt($value, $key)
    {
        // Konversi array menjadi string JSON
        $jsonValue = json_encode($value);
        $cipher = "AES-256-CBC";
        $options = 0;
        $iv_length = openssl_cipher_iv_length($cipher);
        $iv = openssl_random_pseudo_bytes($iv_length);
        $encrypted = openssl_encrypt($jsonValue, $cipher, $key, $options, $iv);
        return base64_encode($iv . $encrypted);
    }

    private function decrypt(Request $request, $key)
    {
        $value = $request->cipher;
        $cipher = "AES-256-CBC";
        $options = 0;
        $iv_length = openssl_cipher_iv_length($cipher);
        $decodedValue = base64_decode($value);
        $iv = substr($decodedValue, 0, $iv_length);
        $encrypted = substr($decodedValue, $iv_length);
        $decrypted = openssl_decrypt($encrypted, $cipher, $key, $options, $iv);
        return json_decode($decrypted, true);
    }
}

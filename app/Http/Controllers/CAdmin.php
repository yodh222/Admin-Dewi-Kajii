<?php

namespace App\Http\Controllers;

use App\Models\MAdmin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CAdmin extends Controller
{
    public function index()
    {
        return view('Test/admin');
        // return response()->json([
        //     'Encrypt' => $this->encrypt(['Data' => 'Simple', 'Data2' => 'Simple2'], 'admin'),
        //     'Decrypt' => $this->decrypt($this->encrypt(['Data' => 'Simple', 'Data2' => 'Simple2'], 'admin'), 'admin')
        // ], 200, [], JSON_PRETTY_PRINT);
    }

    public function login(Request $request)
    {

        $credentials = $request->only('email', 'password');

        if (Auth::guard('admin')->attempt($credentials)) {
            $user = Auth::guard('admin')->user();
            $request->session()->put([
                'Auth' => $this->encrypt($user, 'DewiiKajiiSecret')
            ]);
            // return response()->json([
            //     'Status' => 'Success',
            //     'Message' => 'Anda berhasil login',
            //     'User' => $this->encrypt($user, 'DewiiKajiiSecret'),

            // ], 200, [], JSON_PRETTY_PRINT);
        }

        // return response()->json([
        //     'Status' => 'Error',
        //     'Message' => 'Anda gagal login'
        // ], 400, [], JSON_PRETTY_PRINT);
    }
    public function register(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:tb_admin',
            'password' => 'required|string|',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }

        $admin = MAdmin::create([
            'nama' => $request->get('nama'),
            'email' => $request->get('email'),
            'password' => Hash::make($request->get('password')),
            'no_telp' => $request->get('no_telp'),
            'alamat' => $request->get('alamat'),
        ]);
    }


    // How to set Cookie
    // public function cookie(Request $request)
    // {
    //     $cookieValue = cookie('Auth', "Ambatudin", $minutes = 60);
    //     return response()
    //         ->json(['Status' => 'Success', 'Cookie' => strval($request->cookie('Auth')), 'Aas'], 200, [], JSON_PRETTY_PRINT)
    //         ->withCookie($cookieValue);
    // }


    private function findUser($request)
    {

        $user = MAdmin::where('email', $request->email)->first();

        if (!$user || !password_verify($request->password, $user->password)) {
            return false;
        }

        return $user;
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

        // Kembalikan hasil enkripsi beserta IV
        return base64_encode($iv . $encrypted);
    }

    private function decrypt($value, $key)
    {
        $cipher = "AES-256-CBC";
        $options = 0;
        $iv_length = openssl_cipher_iv_length($cipher);

        // Dekode nilai yang dienkripsi
        $decodedValue = base64_decode($value);

        // Pisahkan IV dari nilai terenkripsi
        $iv = substr($decodedValue, 0, $iv_length);
        $encrypted = substr($decodedValue, $iv_length);

        // Dekripsi nilai
        $decrypted = openssl_decrypt($encrypted, $cipher, $key, $options, $iv);

        // Konversi kembali string JSON menjadi array
        return json_decode($decrypted, true);
    }
}
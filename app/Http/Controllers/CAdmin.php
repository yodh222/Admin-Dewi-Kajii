<?php

namespace App\Http\Controllers;

use App\Models\MAdmin;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;

class CAdmin extends Controller
{
    public function index()
    {
        return view('Pages.login');
    }

    public function profile()
    {
        $user = Auth::guard('admin')->user();
        return view('AdminProfile.profile', ['user' => $user]);
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::guard('admin')->attempt($credentials)) {
            $user = Auth::guard('admin')->user();
            $request->session()->put([
                'Auth' => $this->encrypt($user, 'DewiiKajiiSecret')
            ]);
            return redirect('dashboard')->with('success', 'Anda berhasil login');
        }

        return redirect('Login')->with('error', 'Anda gagal login');
    }

    // public function register(Request $request)
    // {

    //     $validator = Validator::make($request->all(), [
    //         'nama' => 'required|string|max:255',
    //         'email' => 'required|string|email|max:255|unique:tb_admin',
    //         'password' => 'required|string|',
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json([
    //             'message' => 'error',
    //             'info' => 'Data yang anda masukkan tidak valid',
    //         ], 400, [], JSON_PRETTY_PRINT);
    //     }

    //     MAdmin::create([
    //         'nama' => $request->get('nama'),
    //         'email' => $request->get('email'),
    //         'password' => Hash::make($request->get('password')),
    //         'no_telp' => $request->get('no_telp'),
    //         'alamat' => $request->get('alamat'),
    //     ]);
    // }
    public function update(Request $request)
    {
        $admin = MAdmin::where('id_admin', $this->decrypt(Session::get('Auth'), 'DewiiKajiiSecret')['id_admin'])->first();
        if (!$admin) {
            return redirect()->back()->with('srror', 'Admin tidak ditemukan');
        }
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('tb_admin')->ignore($admin->email, 'email')
            ],
            'password' => 'required|string',
            'no_telp' => 'required|string',
            'alamat' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'error',
                'info' => 'Data yang anda masukkan tidak valid',
            ], 400, [], JSON_PRETTY_PRINT);
        }


        $admin->update([
            'nama' => $request->nama,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'no_telp' => $request->no_telp,
            'alamat' => $request->alamat,
        ]);

        return redirect()->back()->with('success', 'Admin berhasil diupdate');
    }
    public function logout(Request $request)
    {
        Auth::guard('admin')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('Login')->with('success', 'Anda berhasil logout');
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

    public function decrypt(Request $request, $key = 'DewiiKajiiSecret')
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

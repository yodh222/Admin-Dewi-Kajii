<?php

namespace App\Http\Controllers;

use App\Models\MUser;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CUser extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($id = null)
    {
        if ($id != null) {
            $user = MUser::find($id);
            if ($user) {
                return response()->json($user, 200, [], JSON_PRETTY_PRINT);
            } else {
                return response()->json([
                    'message' => 'Error',
                    'info' => 'User tidak ditemukan'
                ], 404, [], JSON_PRETTY_PRINT);
            }
        } else {
            $users = MUser::all();
            return response()->json([
                'message' => 'Success',
                'users' => $users
            ], 200, [], JSON_PRETTY_PRINT);
        }
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $file = $request->file('profil');
        if (!$this->isImage($file)) {
            return redirect()->back()->with('error', 'File yang anda kirimkan bukan sebuah gambar');
        }

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
                'message' => 'Error',
                'info' => $info,
            ], 400, [], JSON_PRETTY_PRINT);
        }

        $uniq = uniqid();
        $fileName = $uniq . '.' . $file->getClientOriginalExtension();
        $file->move('uploads/user-profile/', $fileName);
        $path_file = 'uploads/user-profile/' . $fileName;

        MUser::create([
            'nama' => $request->input('nama'),
            'username' => $request->input('username'),
            'email' => $request->input('email'),
            'no_telp' => $request->input('no_telp'),
            'password' => Hash::make($request->input('password')),
            'profil' => $path_file
        ]);

        return response()->json([
            'message' => 'Success',
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
                'message' => 'Error',
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
            'message' => 'Success',
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
                'message' => 'Error',
                'info' => 'Data yang anda masukkan tidak valid',
            ], 200, [], JSON_PRETTY_PRINT);
        }

        $user = MUser::where('email', $request->input('email'))->first();

        if ($user->password && Hash::check($request->input('password'), $user->password)) {
            return response()->json([
                'message' => 'Success',
                'user' => $this->encrypt($user, "DewiiKajiiSecret"),
                'raw' => $user,
            ]);
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

    private function decrypt($value, $key)
    {
        $cipher = "AES-256-CBC";
        $options = 0;
        $iv_length = openssl_cipher_iv_length($cipher);
        $decodedValue = base64_decode($value);
        $iv = substr($decodedValue, 0, $iv_length);
        $encrypted = substr($decodedValue, $iv_length);
        $decrypted = openssl_decrypt($encrypted, $cipher, $key, $options, $iv);
        return json_decode($decrypted, true);
    }

    private function isImage($file)
    {
        if ($file !== null && $file instanceof \SplFileInfo) {
            $extension = strtolower($file->getClientOriginalExtension());
            $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif']; // Ekstensi file gambar yang diizinkan
            return in_array($extension, $allowedExtensions);
        }
        return false;
    }
}

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
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'nama' => 'required|string|max:255',
            'username' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:tb_user',
            'no_telp' => 'required|string|max:255',
            'password' => 'required|string|max:255',
        ]);

        if ($validation->fails()) {
            return response()->json([
                'message' => 'Error',
                'info' => 'Data yang anda masukkan tidak valid',
            ], 400, [], JSON_PRETTY_PRINT);
        }

        MUser::create([
            'nama' => $request->input('nama'),
            'username' => $request->input('username'),
            'email' => $request->input('email'),
            'no_telp' => $request->input('no_telp'),
            'password' => Hash::make($request->input('password')),
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
                'string',
                'email',
                'max:255',
                Rule::unique('tb_user')->ignore($id, 'id_user'),
            ],
            'no_telp' => 'required|string|max:255',
            'password' => 'required|string|max:255',
        ]);

        if ($validation->fails()) {
            return response()->json([
                'message' => 'Error',
                'info' => 'Data yang anda masukkan tidak valid',
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
}

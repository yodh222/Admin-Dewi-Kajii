<?php

namespace App\Http\Controllers;

use App\Models\MAdmin;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CAdmin extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login','register']]);
    }
    public function login()
    {
        $credentials = request(['nama', 'password']);

        if (!$token = JWTAuth::guard('admins')->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $this->respondWithToken($token);
    }

    public function register()
    {
        $validator = Validator::make(request()->all(),[
            'nama' => 'required',
            'no_telp' => 'required',
            'alamat' => 'required',
            'email' => 'required|email|unique:tb_admin',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->messages());
        }

        $admin = MAdmin::create([
            'nama' => request('nama'),
            'email' => request('email'),
            'no_telp' => request('no_telp'),
            'alamat' => request('alamat'),
            'password' => Hash::make(request('password')),
        ]);

        if ($admin) {
            return response()->json(['Message' => 'User created successfully']);
        }else{
            return response()->json(['Message' => 'Failed to create user']);
        }
    }
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ]);
    }
}
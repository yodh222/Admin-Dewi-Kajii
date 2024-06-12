<?php

namespace App\Http\Controllers;

use App\Models\MUlasan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CUlasan extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($id = null)
    {
        if ($id !== null) {
            try {
                $ulasan = MUlasan::leftJoin('tb_user', 'tb_user.id_user', 'tb_ulasan.id_user')
                    ->select('tb_ulasan.id_ulasan', 'tb_ulasan.id_user', 'tb_user.nama', 'tb_user.profil', 'tb_ulasan.ulasan')
                    ->findOrFail($id);
                return response()->json([
                    'message' => 'success',
                    'ulasan' => $ulasan
                ], 200, [], JSON_PRETTY_PRINT);
            } catch (ModelNotFoundException $e) {
                return response()->json([
                    'message' => 'error',
                    'info' => 'Data tidak ditemukan',
                ], 400, [], JSON_PRETTY_PRINT);
            }
        }

        $semuaUlasan = MUlasan::leftJoin('tb_user', 'tb_user.id_user', 'tb_ulasan.id_user')
            ->select('id_ulasan', 'tb_ulasan.id_user', 'nama', 'profil', 'ulasan')
            ->get();

        return response()->json([
            'message' => 'success',
            'ulasan' => $semuaUlasan
        ], 200, [], JSON_PRETTY_PRINT);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'id_user' => 'required|int',
            'ulasan' => 'required|string',
        ]);

        if ($validation->fails()) {
            return redirect()->back()->with('error', 'Data yang anda kirimkan tidak valid');
        }

        MUlasan::create([
            'id_user' => $request->id_user,
            'ulasan' => $request->ulasan
        ]);

        return redirect()->back()->with('success', "Berhasil menambahkan ulasan");
    }

    /**
     * Display the specified resource.
     */
    public function show(MUlasan $mUlasan)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $data = MUlasan::findOrFail($id);
        $validation = Validator::make($request->all(), [
            'id_user' => 'required|int',
            'ulasan' => 'required|string',
        ]);

        if ($validation->fails()) {
            return redirect()->back()->with('error', 'Data yang anda kirimkan tidak valid');
        }

        $data->update([
            'id_user' => $request->id_user,
            'ulasan' => $request->ulasan
        ]);

        return redirect()->back()->with('success', "Berhasil mengedit Ulasan");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $data = MUlasan::findOrFail($id);
            $data->delete();
            return redirect()->back()->with('success', 'Berhasil menghapus Ulasan');
        } catch (ModelNotFoundException $e) {
            return redirect()->back()->with('error', 'Ulasan tidak ditemukan.');
        }
    }
}
<?php

namespace App\Http\Controllers;

use App\Models\MPaket;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CPaket extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($id = null)
    {
        if ($id != null) {
            return response()->json(MPaket::find($id), 200, [], JSON_PRETTY_PRINT);
        }
        return response()->json([
            'message' => 'success',
            'paket' => MPaket::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $file = $request->file('gambar');
        if (!$this->isImage($file)) {
            return redirect()->back()->with('error', 'File yang anda kirimkan bukan sebuah gambar');
        }
        $uniq = uniqid();
        $fileName = $uniq . '.' . $file->getClientOriginalExtension();
        $file->move('uploads/paket-wisata/', $fileName);
        $path_file = 'uploads/paket-wisata/' . $fileName;

        $validation = Validator::make($request->all(), [
            'nama' => 'required|string|max:150|unique:tb_jenis_booking,nama',
            'harga' => 'required|numeric',
        ]);

        if ($validation->fails()) {
            $errorMess = $validation->errors()->has('nama') ? 'Judul yang anda masukkan sudah tersedia' : 'Input yang anda masukkan tidak sesuai';
            return redirect()->back()->with('error', $errorMess);
        }

        MPaket::create([
            'judul' => $request->input('nama'),
            'gambar' => $path_file,
            'harga' => $request->input('harga'),
            'waktu' => $request->input('waktu'),
            'fasilitas' => $request->input('fasilitas'),
            'promo' => $request->input('promo'),
        ]);

        DB::table('tb_jenis_booking')
            ->insert([
                'nama' => $request->input('nama'),
                'harga' => $request->input('harga') - $request->input('promo'),
            ]);

        return redirect()->back()->with('success', 'Paket wisata berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(MPaket $mPaket)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $data = MPaket::findOrFail($id);

        $file = $request->file('gambar');
        if (!$this->isImage($file)) {
            return redirect()->back()->with('error', 'File yang anda kirimkan bukan sebuah gambar');
        }

        $validation = Validator::make($request->all(), [
            // 'nama' => 'required|string|max:150|unique:tb_jenis_booking,nama',
            'nama' => [
                'required',
                'string',
                'max:150',
                Rule::unique('tb_jenis_booking')->ignore($data->judul, 'nama')
            ],
            'harga' => 'required|numeric',
        ]);

        if ($validation->fails()) {
            $errorMess = $validation->errors()->has('nama') ? 'Judul yang anda masukkan sudah tersedia' : 'Input yang anda masukkan tidak sesuai';
            return redirect()->back()->with('error', $errorMess);
        }

        $uniq = uniqid();
        $fileName = $uniq . '.' . $file->getClientOriginalExtension();
        $file->move('uploads/paket-wisata/', $fileName);
        $path_file = 'uploads/paket-wisata/' . $fileName;


        DB::table('tb_jenis_booking')
            ->where('nama', $data->judul)
            ->update([
                'nama' => $request->input('nama'),
                'harga' => $request->input('harga') - $request->input('promo'),
            ]);

        $data->update([
            'judul' => $request->input('nama'),
            'gambar' => $path_file,
            'harga' => $request->input('harga'),
            'waktu' => $request->input('waktu'),
            'fasilitas' => $request->input('fasilitas'),
            'promo' => $request->input('promo'),
        ]);

        return redirect()->back()->with('success', 'Paket Wisata berhasil diedit');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $data = MPaket::findOrFail($id);

            DB::table('tb_jenis_booking')
                ->where('nama', $data->judul)
                ->delete();

            $file_path = public_path($data->gambar);
            unlink($file_path);
            $data->delete();
            return redirect()->back()->with('success', 'Berhasil menghapus Paket Wisata');
        } catch (ModelNotFoundException $e) {
            return redirect()->back()->with('error', 'Paket Wisata tidak ditemukan.');
        }
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

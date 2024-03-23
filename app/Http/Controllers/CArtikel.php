<?php

namespace App\Http\Controllers;

use App\Models\MArtikel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CArtikel extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
            'message' => 'success',
            'artikel' => MArtikel::all(),
        ], 200, [], JSON_PRETTY_PRINT);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $file = $request->file('gambar');
        if (!$this->isImage($file)) {
            return redirect()->back()->with('imageError', 'File yang anda kirimkan bukan sebuah gambar');
        }
        $uniq = uniqid();
        $fileName = $uniq . '.' . $file->getClientOriginalExtension();
        $file->move('uploads/artikel/', $fileName);
        $path_file = '/uploads/artikel/' . $fileName;

        $validator = Validator::make($request->all(), [
            'judul' => 'required|string',
            'tanggal' => 'required|date',
            'deskripsi' => 'required|string',
        ]);

        if ($validator->fails()) {
            return redirect()->route('Login')->with('error', 'Data yang anda kirimkan tidak valid');
        }

        MArtikel::create([
            'judul' => $request->judul,
            'dibuat' => $request->tanggal,
            'deskripsi' => $request->deskripsi,
            'gambar' => $path_file,
        ]);

        return redirect()->back()->with('success', 'Berhasil menambahkan timeline');
    }

    /**
     * Display the specified resource.
     */
    public function show(MArtikel $mArtikel)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MArtikel $mArtikel)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MArtikel $mArtikel)
    {
        //
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

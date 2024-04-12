<?php

namespace App\Http\Controllers;

use App\Models\MArtikel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CArtikel extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($id = null)
    {
        if ($id !== null) {
            return response()->json(MArtikel::find($id), 200, [], JSON_PRETTY_PRINT);
        }
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
        if (count($file) < 3) {
            return redirect()->back()->with('error', 'Gambar yang dikirimkan minimal 3 file');
        } else if (count($file) > 10) {
            return redirect()->back()->with('error', 'Gambar yang dikirimkan maksimal 10 file');
        }
        foreach ($request->file('gambar') as $Imagefile) {
            if (!$this->isImage($Imagefile)) {
                return redirect()->back()->with('error', 'File yang anda kirimkan bukan sebuah gambar');
            }
        }

        $validator = Validator::make($request->all(), [
            'judul' => 'required|string',
            'tanggal' => 'required|date',
            'deskripsi' => 'required|string',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->with('error', 'Data yang anda kirimkan tidak valid');
        }

        $path_file = '';
        $c = 0;
        foreach ($file as $Imagefile) {
            $fileName = uniqid() . '.' . $Imagefile->getClientOriginalExtension();
            $Imagefile->move('uploads/artikel/', $fileName);
            if ($c > 0) {
                $path_file .= ',uploads/artikel/' . $fileName;
            } else {
                $path_file .= 'uploads/artikel/' . $fileName;
            }
            $c += 1;
        }

        MArtikel::create([
            'judul' => $request->judul,
            'dibuat' => $request->tanggal,
            'deskripsi' => $request->deskripsi,
            'gambar' => $path_file,
        ]);

        return redirect()->back()->with('success', 'Berhasil menambahkan Artikel');
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
    public function update(Request $request, $id)
    {
        $data = MArtikel::findOrFail($id);
        $file = $request->file('gambar');
        if (count($file) < 3) {
            return redirect()->back()->with('error', 'Gambar yang dikirimkan minimal 3 file');
        } else if (count($file) > 10) {
            return redirect()->back()->with('error', 'Gambar yang dikirimkan maksimal 10 file');
        }
        foreach ($request->file('gambar') as $Imagefile) {
            if (!$this->isImage($Imagefile)) {
                return redirect()->back()->with('error', 'File yang anda kirimkan bukan sebuah gambar');
            }
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $data = MArtikel::findOrFail($id);

            $image = explode(',', $data->gambar);

            foreach ($image as $gambar) {
                $file_path = public_path($gambar);
                unlink($file_path);
            }
            $data->delete();
            return redirect()->back()->with('success', 'Berhasil menghapus Artikel');
        } catch (ModelNotFoundException $e) {
            return redirect()->back()->with('error', 'Artikel tidak ditemukan.');
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
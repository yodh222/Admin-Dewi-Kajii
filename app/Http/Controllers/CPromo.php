<?php

namespace App\Http\Controllers;

use App\Models\MPromo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CPromo extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($id = null)
    {
        if ($id != null) {
            try {
                $data = MPromo::findOrFail($id);
                return response()->json([
                    'message' => 'success',
                    'promo' => $data
                ], 200, [], JSON_PRETTY_PRINT);
            } catch (ModelNotFoundException $e) {
                return response()->json([
                    'message' => 'error',
                    'info' => 'Data tidak ditemukan',
                ], 400, [], JSON_PRETTY_PRINT);
            }
        }

        $data = MPromo::find(2);
        return response()->json([
            'message' => 'success',
            'promo' => MPromo::all(),
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

        $validator = Validator::make($request->all(), [
            'judul' => 'required|string',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->with('error', 'Data yang anda kirimkan tidak valid');
        }

        $uniq = uniqid();
        $fileName = $uniq . '.' . $file->getClientOriginalExtension();
        $file->move('uploads/promo/', $fileName);
        $path_file = '/uploads/promo/' . $fileName;


        MPromo::create([
            'judul' => $request->judul,
            'gambar' => $path_file,
        ]);

        return redirect()->back()->with('success', 'Berhasil menambahkan banner promo');
    }

    /**
     * Display the specified resource.
     */
    public function show(MPromo $mPromo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update($id, Request $request)
    {
        $data = MPromo::find($id);

        $file = $request->file('gambar');
        if (!$this->isImage($file)) {
            return redirect()->back()->with('imageError', 'File yang anda kirimkan bukan sebuah gambar');
        }

        $validator = Validator::make($request->all(), [
            'judul' => 'required|string',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->with('error', 'Data yang anda kirimkan tidak valid');
        }

        $fileName = explode('/', $data->gambar);
        $file->move('uploads/promo/', end($fileName));
        $path_file = '/uploads/promo/' . end($fileName);

        $data->update([
            'judul' => $request->judul,
            'gambar' => $path_file,
        ]);
        return redirect()->back()->with('success', 'Berhasil mengedit banner promo');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $data = MPromo::find($id);

        if ($data) {
            $file_path = public_path($data->gambar);
            unlink($file_path);
            $data->delete();
            return redirect()->back()->with('success', 'Banner Promo berhasil dihapus');
        } else {
            return redirect()->back()->with('error', 'Banner Promo gagal dihapus');
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

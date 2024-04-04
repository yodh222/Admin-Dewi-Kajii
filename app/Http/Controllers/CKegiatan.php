<?php

namespace App\Http\Controllers;

use App\Models\MKegiatan;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CKegiatan extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($id = null)
    {
        if ($id != null) {
            return response()->json(MKegiatan::find($id), 200, [], JSON_PRETTY_PRINT);
        }
        return response()->json([
            'message' => 'success',
            'kegiatan' => MKegiatan::all()
        ], 200, [], JSON_PRETTY_PRINT);
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
        $file->move('uploads/kegiatan/', $fileName);
        $path_file = 'uploads/kegiatan/' . $fileName;

        $validation = Validator::make($request->all(), [
            'judul' => 'required|string|max:150',
            'harga' => 'required|numeric',
        ]);

        if ($validation->fails()) {
            return redirect()->back()->with('error', 'Input yang anda masukkan tidak sesuai');
        }

        MKegiatan::create([
            'judul' => $request->input('judul'),
            'gambar' => $path_file,
            'harga' => $request->input('harga')
        ]);

        DB::table('tb_jenis_booking')
            ->insert([
                'nama' => $request->input('judul'),
                'harga' => $request->input('harga')
            ]);

        return redirect()->back()->with('succes', 'Kegiatan berhasil ditambahkan');
    }


    /**
     * Display the specified resource.
     */
    public function show(MKegiatan $mKegiatan)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $data = MKegiatan::findOrFail($id);

        $file = $request->file('gambar');
        if (!$this->isImage($file)) {
            return redirect()->back()->with('error', 'File yang anda kirimkan bukan sebuah gambar');
        }

        // $fileName = end(explode('/', $data->gambar));
        $fileName = explode('/', $data->gambar);
        $file->move('uploads/kegiatan/', end($fileName));
        $path_file = 'uploads/kegiatan/' . end($fileName);

        $validation = Validator::make($request->all(), [
            'judul' => [
                'required',
                'string',
                'max:150',
                Rule::unique('tb_kegiatan')->ignore($id, 'id_kegiatan')
            ],
            'harga' => 'required|numeric',
        ]);

        if ($validation->fails()) {
            return redirect()->back()->with('error', 'Input yang anda masukkan tidak sesuai');
        }


        DB::table('tb_jenis_booking')
            ->where('nama', $data->judul)
            ->update([
                'nama' => $request->input('judul'),
                'harga' => $request->input('harga')
            ]);

        $data->update([
            'judul' => $request->input('judul'),
            'gambar' => $path_file,
            'harga' => $request->input('harga')
        ]);

        return redirect()->back()->with('success', 'Kegiatan berhasil diedit');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $id)
    {
        try {
            $data = MKegiatan::findOrFail($id);
            $file_path = public_path($data->gambar);
            unlink($file_path);
            $data->delete();
            return redirect()->back()->with('success', 'Berhasil menghapus kegiatan');
        } catch (ModelNotFoundException $e) {
            return redirect()->back()->with('error', 'Kegiatan tidak ditemukan.');
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

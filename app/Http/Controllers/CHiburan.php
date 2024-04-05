<?php

namespace App\Http\Controllers;

use App\Models\MHiburan;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CHiburan extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($id = null)
    {
        if ($id != null) {
            return response()->json(MHiburan::find($id), 200, [], JSON_PRETTY_PRINT);
        }
        return response()->json([
            'message' => 'success',
            'hiburan' => MHiburan::all(),
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

        $validation = Validator::make($request->all(), [
            'nama' => 'required|string|max:150|unique:tb_jenis_booking,nama',
            'harga' => 'required|numeric',
        ]);

        if ($validation->fails()) {
            $errorMess = $validation->errors()->has('nama') ? 'Judul yang anda masukkan sudah tersedia' : 'Input yang anda masukkan tidak sesuai';
            return redirect()->back()->with('error', $errorMess);
        }

        $uniq = uniqid();
        $fileName = $uniq . '.' . $file->getClientOriginalExtension();
        $file->move('uploads/hiburan/', $fileName);
        $path_file = 'uploads/hiburan/' . $fileName;


        MHiburan::create([
            'judul' => $request->input('nama'),
            'gambar' => $path_file,
            'harga' => $request->input('harga')
        ]);

        DB::table('tb_jenis_booking')
            ->insert([
                'nama' => $request->input('nama'),
                'harga' => $request->input('harga')
            ]);

        return redirect()->back()->with('success', 'Hiburan berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(MHiburan $mHiburan)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $data = MHiburan::findOrFail($id);

        $file = $request->file('gambar');
        if (!$this->isImage($file)) {
            return redirect()->back()->with('error', 'File yang anda kirimkan bukan sebuah gambar');
        }

        $validation = Validator::make($request->all(), [
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

        $fileName = explode('/', $data->gambar);
        $file->move('uploads/hiburan/', end($fileName));
        $path_file = 'uploads/hiburan/' . end($fileName);

        DB::table('tb_jenis_booking')
            ->where('nama', $data->judul)
            ->update([
                'nama' => $request->input('nama'),
                'harga' => $request->input('harga')
            ]);

        $data->update([
            'judul' => $request->input('nama'),
            'gambar' => $path_file,
            'harga' => $request->input('harga')
        ]);

        return redirect()->back()->with('success', 'Kegiatan berhasil diedit');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $data = MHiburan::findOrFail($id);

            DB::table('tb_jenis_booking')
                ->where('nama', $data->judul)
                ->delete();

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

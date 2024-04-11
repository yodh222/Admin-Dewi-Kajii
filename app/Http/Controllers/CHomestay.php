<?php

namespace App\Http\Controllers;

use App\Models\MHomestay;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CHomestay extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($id = null)
    {
        if ($id != null) {
            return response()->json(MHomestay::find($id), 200, [], JSON_PRETTY_PRINT);
        }

        return response()->json([
            'message' => 'success',
            'homestay' => MHomestay::all(),
        ], 200, [], JSON_PRETTY_PRINT);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $file = $request->file('gambar');
        foreach ($request->file('gambar') as $Imagefile) {
            if (!$this->isImage($Imagefile)) {
                return redirect()->back()->with('error', 'File yang anda kirimkan bukan sebuah gambar');
            }
        }

        $validation = Validator::make($request->all(), [
            'nama' => 'required|string|max:150|unique:tb_jenis_booking,nama',
            'harga' => 'required|numeric',
            'fasilitas' => 'required|string',
            'deskripsi' => 'required|string',
            'peraturan' => 'required|string',
        ]);

        if ($validation->fails()) {
            $errorMess = $validation->errors()->has('nama') ? 'Judul yang anda masukkan sudah tersedia' : 'Input yang anda masukkan tidak sesuai';
            return redirect()->back()->with('error', $errorMess);
        }

        $path_file = '';
        $c = 0;
        foreach ($request->file('gambar') as $Imagefile) {
            $fileName = uniqid() . '.' . $Imagefile->getClientOriginalExtension();
            $Imagefile->move('uploads/homestay/', $fileName);
            if ($c > 0) {
                $path_file .= ',/uploads/homestay/' . $fileName;
            } else {
                $path_file .= '/uploads/homestay/' . $fileName;
            }
            $c += 1;
        }

        MHomestay::create([
            'nama' => $request->input('nama'),
            'gambar' => $path_file,
            'harga' => $request->input('harga'),
            'fasilitas' => $request->input('fasilitas'),
            'deskripsi' => $request->input('deskripsi'),
            'peraturan' => $request->input('peraturan'),
        ]);

        DB::table('tb_jenis_booking')
            ->insert([
                'nama' => $request->input('nama'),
                'harga' => $request->input('harga') - $request->input('promo'),
            ]);

        return redirect()->back()->with('success', 'Homestay berhasil ditambahkan');
    }


    /**
     * Display the specified resource.
     */
    public function show(MHomestay $mHomestay)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $data = MHomestay::findOrFail($id);

        $validation = Validator::make($request->all(), [
            'nama' => [
                'required',
                'string',
                'max:150',
                Rule::unique('tb_jenis_booking')->ignore($data->nama, 'nama')
            ],
            'harga' => 'required|numeric',
            'fasilitas' => 'required|string',
            'deskripsi' => 'required|string',
            'peraturan' => 'required|string',
        ]);

        if ($validation->fails()) {
            $errorMess = $validation->errors()->has('nama') ? 'Judul yang anda masukkan sudah tersedia' : 'Input yang anda masukkan tidak sesuai';
            return redirect()->back()->with('error', $errorMess);
        }

        DB::table('tb_jenis_booking')
            ->where('nama', $data->nama)
            ->update([
                'nama' => $request->input('nama'),
                'harga' => $request->input('harga'),
            ]);

        if ($request->file('gambar')) {
            // Jika ada file gambar yang dikirimkan
            $file = $request->file('gambar');
            foreach ($request->file('gambar') as $Imagefile) {
                if (!$this->isImage($Imagefile)) {
                    return redirect()->back()->with('error', 'File yang anda kirimkan bukan sebuah gambar');
                }
            }

            $file->move($data->gambar);
            $path_file = $data->gambar;

            $data->update([
                'nama' => $request->input('nama'),
                'gambar' => $path_file,
                'harga' => $request->input('harga'),
                'fasilitas' => $request->input('fasilitas'),
                'deskripsi' => $request->input('deskripsi'),
                'peraturan' => $request->input('peraturan'),
            ]);
        } else {
            // Jika tidak ada file gambar yang dikirimkan
            $data->update([
                'nama' => $request->input('nama'),
                'harga' => $request->input('harga'),
                'fasilitas' => $request->input('fasilitas'),
                'deskripsi' => $request->input('deskripsi'),
                'peraturan' => $request->input('peraturan'),
            ]);
        }


        return redirect()->back()->with('success', 'Homestay berhasil diedit');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $data = MHomestay::findOrFail($id);

            DB::table('tb_jenis_booking')
                ->where('nama', $data->nama)
                ->delete();

            $file_path = public_path($data->gambar);
            unlink($file_path);
            $data->delete();
            return redirect()->back()->with('success', 'Berhasil menghapus Homestay');
        } catch (ModelNotFoundException $e) {
            return redirect()->back()->with('error', 'Homestay tidak ditemukan.');
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
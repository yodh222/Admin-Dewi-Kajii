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
            try {
                $data = MHomestay::findOrFail($id);
                return response()->json($data, 200, [], JSON_PRETTY_PRINT);
            } catch (ModelNotFoundException $e) {
                return response()->json([
                    'message' => 'error',
                    'info' => 'Data tidak ditemukan',
                ], 400, [], JSON_PRETTY_PRINT);
            }
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

        $validation = Validator::make($request->all(), [
            'judul' => 'required|string|max:150|unique:tb_jenis_booking,nama',
            'harga' => 'required|numeric',
            'fasilitas' => 'required|string',
            'deskripsi' => 'required|string',
            'peraturan' => 'required|string',
        ]);

        if ($validation->fails()) {
            $errorMess = $validation->errors()->has('judul') ? 'Judul yang anda masukkan sudah tersedia' : 'Input yang anda masukkan tidak sesuai';
            return redirect()->back()->with('error', $errorMess);
        }

        $path_file = '';
        $c = 0;
        foreach ($file as $Imagefile) {
            $fileName = uniqid() . '.' . $Imagefile->getClientOriginalExtension();
            $Imagefile->move('uploads/homestay/', $fileName);
            if ($c > 0) {
                $path_file .= ',uploads/homestay/' . $fileName;
            } else {
                $path_file .= 'uploads/homestay/' . $fileName;
            }
            if ($c == 0) {
                DB::table('tb_jenis_booking')
                    ->insert([
                        'nama' => $request->input('judul'),
                        'harga' => $request->input('harga') - $request->input('promo'),
                        'gambar' => $path_file,
                    ]);
            }
            $c += 1;
        }

        MHomestay::create([
            'judul' => $request->input('judul'),
            'gambar' => $path_file,
            'harga' => $request->input('harga'),
            'fasilitas' => $request->input('fasilitas'),
            'deskripsi' => $request->input('deskripsi'),
            'peraturan' => $request->input('peraturan'),
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
            'judul' => [
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

        $image_path = explode(',', $data->gambar);
        $path_file = '';
        $c = 0;
        foreach ($file as $Imagefile) {
            if (isset($image_path[$c])) {
                $image_name = explode('/', $image_path[$c]);
                $image_name = end($image_name);
                $Imagefile->move('uploads/homestay/', $image_name);
                if ($c > 0) {
                    $path_file .= ',';
                }
                $path_file .= $image_path[$c];
            } else {
                $newFileName = uniqid() . '.' . $Imagefile->getClientOriginalExtension();
                $Imagefile->move('uploads/homestay/', $newFileName);
                if ($c > 0) {
                    $path_file .= ',';
                }
                $path_file .= 'uploads/homestay/' . $newFileName;
            }
            if ($c == 0) {
                DB::table('tb_jenis_booking')
                    ->where('nama', $data->nama)
                    ->update([
                        'nama' => $request->input('judul'),
                        'harga' => $request->input('harga'),
                        'gambar' => $path_file,
                    ]);
            }
            $c += 1;
        }
        if ($c < count($image_path)) {
            for ($c; $c < count($image_path); $c++) {
                unlink(public_path($image_path[$c]));
            }
        }

        $data->update([
            'judul' => $request->input('judul'),
            'gambar' => $path_file,
            'harga' => $request->input('harga'),
            'fasilitas' => $request->input('fasilitas'),
            'deskripsi' => $request->input('deskripsi'),
            'peraturan' => $request->input('peraturan'),
        ]);


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

            $image = explode(',', $data->gambar);

            foreach ($image as $gambar) {
                $file_path = public_path($gambar);
                unlink($file_path);
            }
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

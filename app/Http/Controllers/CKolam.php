<?php

namespace App\Http\Controllers;

use App\Models\MKolam;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CKolam extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($id = null)
    {
        if ($id != null) {
            return response()->json(MKolam::find($id), 200, [], JSON_PRETTY_PRINT);
        }

        return response()->json([
            'message' => 'success',
            'kolam' => MKolam::all(),
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
            'nama' => 'required|string|max:150',
            'deskripsi' => 'required|string',
            'jenis' => 'required|string',
        ]);

        if ($validation->fails()) {
            return redirect()->back()->with('error', 'Data yang anda kirimkan tidak valid');
        }

        $path_file = '';
        $c = 0;
        foreach ($file as $Imagefile) {
            $fileName = uniqid() . '.' . $Imagefile->getClientOriginalExtension();
            $Imagefile->move('uploads/kolam-ikan/', $fileName);
            if ($c > 0) {
                $path_file .= ',uploads/kolam-ikan/' . $fileName;
            } else {
                $path_file .= 'uploads/kolam-ikan/' . $fileName;
            }
            $c += 1;
        }

        MKolam::create([
            'nama' => $request->nama,
            'deskripsi' => $request->deskripsi,
            'jenis_ikan' => $request->jenis,
            'gambar' => $path_file,
        ]);

        return redirect()->back()->with('success', 'Berhasil menambahkan Kolam Ikan');
    }

    /**
     * Display the specified resource.
     */
    public function show(MKolam $mKolam)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $data = MKolam::findOrFail($id);

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
            'nama' => 'required|string|max:150',
            'deskripsi' => 'required|string',
            'jenis' => 'required|string',
        ]);

        if ($validation->fails()) {
            return redirect()->back()->with('error', 'Data yang anda kirimkan tidak valid');
        }

        $image_path = explode(',', $data->gambar);
        $path_file = '';
        $c = 0;
        foreach ($file as $Imagefile) {
            if (isset($image_path[$c])) {
                $image_name = explode('/', $image_path[$c]);
                $image_name = end($image_name);
                $Imagefile->move('uploads/kolam-ikan/', $image_name);
                if ($c > 0) {
                    $path_file .= ',';
                }
                $path_file .= $image_path[$c];
                $c += 1;
            } else {
                $newFileName = uniqid() . '.' . $Imagefile->getClientOriginalExtension();
                $Imagefile->move('uploads/kolam-ikan/', $newFileName);
                if ($c > 0) {
                    $path_file .= ',';
                }
                $path_file .= 'uploads/kolam-ikan/' . $newFileName;
                $c += 1;
            }
        }
        if ($c < count($image_path)) {
            for ($c; $c < count($image_path); $c++) {
                unlink(public_path($image_path[$c]));
            }
        }

        $data->update([
            'nama' => $request->nama,
            'deskripsi' => $request->deskripsi,
            'jenis_ikan' => $request->jenis,
            'gambar' => $path_file,
        ]);


        return redirect()->back()->with('success', 'Berhasil mengedit Ikan Hias');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $data = MKolam::findOrFail($id);

            DB::table('tb_jenis_booking')
                ->where('nama', $data->nama)
                ->delete();

            $image = explode(',', $data->gambar);

            foreach ($image as $gambar) {
                $file_path = public_path($gambar);
                unlink($file_path);
            }
            $data->delete();
            return redirect()->back()->with('success', 'Berhasil menghapus Ikan Hias');
        } catch (ModelNotFoundException $e) {
            return redirect()->back()->with('error', 'Ikan Hias tidak ditemukan.');
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

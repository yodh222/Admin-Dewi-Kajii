<?php

namespace App\Http\Controllers;

use App\Models\MProfile;
use App\Models\MTimeline;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CProfile extends Controller
{
    public function index()
    {
        return response()->json([
            'message' => 'success',
            'profile' => MProfile::find(1),
            'timeline' => MTimeline::all(),
        ], 200, [], JSON_PRETTY_PRINT);
    }

    // CRUD
    public function editProfile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'deskripsi' => 'required|string',
        ]);
        if ($validator->fails()) {
            return redirect()->back()->with('error', 'Data yang anda kirimkan tidak valid');
        }

        $profile = MProfile::find('1');
        $profile->update([
            'deskripsi' => $request->deskripsi
        ]);
    }

    public  function addTimeline(Request $request)
    {
        $file = $request->file('gambar');
        if (!$this->isImage($file)) {
            return redirect()->back()->with('imageError', 'File yang anda kirimkan bukan sebuah gambar');
        }
        $uniq = uniqid();
        $fileName = $uniq . '.' . $file->getClientOriginalExtension();
        $file->move('uploads/timeline/', $fileName);
        $path_file = asset('uploads/timeline/' . $fileName);

        $validator = Validator::make($request->all(), [
            'judul' => 'required|string',
            'tanggal' => 'required|date',
            'deskripsi' => 'required|string',
            'gambar' => 'required|string',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->with('error', 'Data yang anda kirimkan tidak valid');
        }

        $timeline = MTimeline::create([
            'judul' => $request->judul,
            'tanggal' => $request->tanggal,
            'deskripsi' => $request->deskripsi,
            'gambar' => $path_file,
        ]);

        return redirect()->back()->with('success', 'Berhasil menambahkan timeline');
    }

    public function editTimeline(Request $request)
    {
        $file = $request->file('gambar');
        if (!$this->isImage($file)) {
            return redirect()->back()->with('imageError', 'File yang anda kirimkan bukan sebuah gambar');
        }
        $uniq = uniqid();
        $fileName = $uniq . '.' . $file->getClientOriginalExtension();
        $file->move('uploads/timeline/', $fileName);
        $path_file = asset('uploads/timeline/' . $fileName);

        $validator = Validator::make($request->all(), [
            'judul' => 'required|string',
            'tanggal' => 'required|date',
            'deskripsi' => 'required|string',
            'gambar' => 'required|string',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->with('error', 'Data yang anda kirimkan tidak valid');
        }

        $timeline = MTimeline::find($request->id_timeline);

        $timeline->update([
            'judul' => $request->judul,
            'tanggal' => $request->tanggal,
            'deskripsi' => $request->deskripsi,
            'gambar' => $path_file,
        ]);

        return redirect()->back()->with('success', 'Berhasil mengedit timeline');
    }

    public function deleteTimeline(Request $request)
    {
        try {
            $timeline = MTimeline::findOrFail($request->id_timeline);
            $timeline->delete();
            return redirect()->back()->with('success', 'Berhasil menghapus timeline');
        } catch (ModelNotFoundException $e) {
            return redirect()->back()->with('error', 'Timeline tidak ditemukan.');
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

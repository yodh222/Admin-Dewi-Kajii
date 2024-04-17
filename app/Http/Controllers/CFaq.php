<?php

namespace App\Http\Controllers;

use App\Models\MFaq;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CFaq extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($id = null)
    {
        if ($id != null) {
            try {
                $data = MFaq::findOrFail($id);
                return response()->json($data, 200, [], JSON_PRETTY_PRINT);
            } catch (ModelNotFoundException $e) {
                return response()->json([
                    'message' => 'error',
                    'info' => 'Data tidak ditemukan'
                ], 400, [], JSON_PRETTY_PRINT);
            }
        }
        return response()->json([
            'message' => 'success',
            'faq' => MFaq::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'pertanyaan' => 'required|string',
            'jawaban' => 'required|string'
        ]);

        if ($validation->fails()) {
            return redirect()->back()->with('error', 'Data yang anda kirimkan tidak valid');
        }

        MFaq::create([
            'pertanyaan' => $request->pertanyaan,
            'jawaban' => $request->jawaban
        ]);

        return redirect()->back()->with('success', 'Berhasil menambahkan FAQ');
    }

    /**
     * Display the specified resource.
     */
    public function show(MFaq $mFaq)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $data = MFaq::findOrFail($id);

        $validation = Validator::make($request->all(), [
            'pertanyaan' => 'required|string',
            'jawaban' => 'required|string'
        ]);

        if ($validation->fails()) {
            return redirect()->back()->with('error', 'Data yang anda kirimkan tidak valid');
        }

        $data->update([
            'pertanyaan' => $request->pertanyaan,
            'jawaban' => $request->jawaban
        ]);

        return redirect()->back()->with('success', 'Berhasil mengedit FAQ');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $data = MFaq::findOrFail($id);
            $data->delete();
            return redirect()->back()->with('success', 'Berhasil menghapus FAQ');
        } catch (ModelNotFoundException $e) {
            return redirect()->back()->with('error', 'FAQ tidak ditemukan.');
        }
    }
}

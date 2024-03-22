<?php

namespace App\Http\Controllers;

use App\Models\MKegiatan;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CKegiatan extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
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
        //
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
    public function update(Request $request)
    {
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        try {
            $timeline = MKegiatan::findOrFail($request->id_kegiatan);
            $timeline->delete();
            return redirect()->back()->with('success', 'Berhasil menghapus timeline');
        } catch (ModelNotFoundException $e) {
            return redirect()->back()->with('error', 'Timeline tidak ditemukan.');
        }
    }
}

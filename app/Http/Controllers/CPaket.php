<?php

namespace App\Http\Controllers;

use App\Models\MPaket;
use Illuminate\Http\Request;

class CPaket extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($id = null)
    {
        if ($id != null) {
            return response()->json(MPaket::find($id), 200, [], JSON_PRETTY_PRINT);
        }
        return response()->json([
            'message' => 'success',
            'paket' => MPaket::all(),
        ]);
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
    public function show(MPaket $mPaket)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MPaket $mPaket)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MPaket $mPaket)
    {
        //
    }
}

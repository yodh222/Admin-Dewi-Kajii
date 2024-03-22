<?php

namespace App\Http\Controllers;

use App\Models\MArtikel;
use Illuminate\Http\Request;

class CArtikel extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
            'message' => 'success',
            'artikel' => MArtikel::all(),
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
    public function show(MArtikel $mArtikel)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MArtikel $mArtikel)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MArtikel $mArtikel)
    {
        //
    }
}

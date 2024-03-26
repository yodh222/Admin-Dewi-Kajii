<?php

namespace App\Http\Controllers;

use App\Models\MHomestay;
use Illuminate\Http\Request;

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
        //
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
    public function update(Request $request, MHomestay $mHomestay)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MHomestay $mHomestay)
    {
        //
    }
}

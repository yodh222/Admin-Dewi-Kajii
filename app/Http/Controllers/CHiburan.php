<?php

namespace App\Http\Controllers;

use App\Models\MHiburan;
use Illuminate\Http\Request;

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
        //
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
    public function update(Request $request, MHiburan $mHiburan)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MHiburan $mHiburan)
    {
        //
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\MHomestay;
use Illuminate\Http\Request;

class CHomestay extends Controller
{
    public function index(){
        $data = MHomestay::all();

        return response()->json(['Data' => $data],200,[],JSON_PRETTY_PRINT);
    }
}
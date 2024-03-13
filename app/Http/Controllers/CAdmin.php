<?php

namespace App\Http\Controllers;

use App\Models\MAdmin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CAdmin extends Controller
{
    public function login()
    {
        $credentials = request(['email', 'password']);
    }
}

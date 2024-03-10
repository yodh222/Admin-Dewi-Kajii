<?php

use App\Http\Controllers\CTransaksi;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', [CTransaksi::class, 'index'])->name('dashboard');
Route::get('/api', [CTransaksi::class, 'api'])->name('api');

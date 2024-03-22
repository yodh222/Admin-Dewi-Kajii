<?php

use App\Http\Controllers\CAdmin;
use App\Http\Controllers\CArtikel;
use App\Http\Controllers\CHomestay;
use App\Http\Controllers\CKegiatan;
use App\Http\Controllers\CProfile;
use App\Http\Controllers\CTransaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::get('test', [CHomestay::class, 'index'])->name('a');

Route::get('transaksi/{method}', [CTransaksi::class, 'api'])->name('transaksi');
Route::get('profile', [CProfile::class, 'index'])->name('profile');
Route::get('kegiatan', [CKegiatan::class, 'index'])->name('kegiatan');
Route::get('artikel', [CArtikel::class, 'index'])->name('artikel');


// Route::get('/test', [CAdmin::class, 'cookie'])->name('test');

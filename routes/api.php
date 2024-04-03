<?php

use App\Http\Controllers\CAdmin;
use App\Http\Controllers\CArtikel;
use App\Http\Controllers\CHiburan;
use App\Http\Controllers\CHomestay;
use App\Http\Controllers\CKegiatan;
use App\Http\Controllers\CPaket;
use App\Http\Controllers\CProfile;
use App\Http\Controllers\CPromo;
use App\Http\Controllers\CTransaksi;
use App\Http\Controllers\CUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!`
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });
// Route::get('test', [CHomestay::class, 'index'])->name('a');


Route::get('transaksi/{method}', [CTransaksi::class, 'api'])->name('transaksi');
Route::get('profile', [CProfile::class, 'index'])->name('profile');
Route::get('kegiatan/{id?}', [CKegiatan::class, 'index'])->name('kegiatan');
Route::get('artikel/{id?}', [CArtikel::class, 'index'])->name('artikel');
Route::get('promo/{id?}', [CPromo::class, 'index'])->name('promo');
Route::get('hiburan/{id?}', [CHiburan::class, 'index'])->name('hiburan');
Route::get('paket-wisata/{id?}', [CPaket::class, 'index'])->name('paket-wisata');
Route::get('homestay/{id?}', [CHomestay::class, 'index'])->name('homstay');
Route::get('user/{id?}', [CUser::class, 'index'])->name('user');


Route::post('user/register', [CUser::class, 'store'])->name('user.register');
Route::post('user/update/{id}', [CUser::class, 'update'])->name('user.register');
Route::post('transaksi/post', [CTransaksi::class, 'postData'])->name('transaksi.post');
Route::post('transaksi/post/{id}', [CTransaksi::class, 'postDataPembayaran'])->name('transaksi.update');

// Route::get('/test', [CAdmin::class, 'cookie'])->name('test');
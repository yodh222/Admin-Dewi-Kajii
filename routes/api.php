<?php

use App\Http\Controllers\CAdmin;
use App\Http\Controllers\CArtikel;
use App\Http\Controllers\CFaq;
use App\Http\Controllers\CHiburan;
use App\Http\Controllers\CHomestay;
use App\Http\Controllers\CIkanHias;
use App\Http\Controllers\CKegiatan;
use App\Http\Controllers\CKolam;
use App\Http\Controllers\CPaket;
use App\Http\Controllers\CProfile;
use App\Http\Controllers\CPromo;
use App\Http\Controllers\CTransaksi;
use App\Http\Controllers\CUlasan;
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

Route::get('transaksi/{method}/{id?}', [CTransaksi::class, 'api'])->name('transaksi');
Route::get('admin/transaksi/get', [CTransaksi::class, 'adminGet'])->name('transaksi');
Route::get('profile/{id?}', [CProfile::class, 'index'])->name('profile');
Route::get('kegiatan/{id?}', [CKegiatan::class, 'index'])->name('kegiatan');
Route::get('artikel/{id?}', [CArtikel::class, 'index'])->name('artikel');
Route::get('promo/{id?}', [CPromo::class, 'index'])->name('promo');
Route::get('hiburan/{id?}', [CHiburan::class, 'index'])->name('hiburan');
Route::get('paket-wisata/{id?}', [CPaket::class, 'index'])->name('paket-wisata');
Route::get('homestay/{id?}', [CHomestay::class, 'index'])->name('homstay');
Route::get('katalog/ikan-hias{id?}', [CIkanHias::class, 'index'])->name('ikan-hias');
Route::get('katalog/kolam{id?}', [CKolam::class, 'index'])->name('kolam-ikan');
Route::get('ulasan/{id?}', [CUlasan::class, 'index'])->name('ulasan');
Route::get('faq/{id?}', [CFaq::class, 'index'])->name('faq');
Route::get('user/', [CUser::class, 'index'])->where('id', '[0-9]+');
Route::get('admin/user/{id?}', [CUser::class, 'index'])->where('id', '[0-9]+');

// User
Route::post('user/register', [CUser::class, 'store'])->name('user.register');
Route::post('user/update/{id}', [CUser::class, 'update'])->name('user.register');
Route::post('user/login', [CUser::class, 'login'])->name('user.login');
Route::get('user/logout', [CUser::class, 'logout'])->name('user.logout');
Route::get('user/check', [CUser::class, 'checkToken'])->name('user.check');

Route::post('transaksi/post', [CTransaksi::class, 'postData'])->name('transaksi.post');
Route::post('transaksi/post/{id}', [CTransaksi::class, 'postDataPembayaran'])->name('transaksi.update');

<?php

use App\Http\Controllers\CAdmin;
use App\Http\Controllers\CArtikel;
use App\Http\Controllers\CKegiatan;
use App\Http\Controllers\CProfile;
use App\Http\Controllers\CPromo;
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

// Route::get('/', function () {
//     return view('Test/test');
// })->name('dashboard');


Route::group(['middleware' => 'adminMiddleware', 'name' => 'Administrator'], function () {
    Route::get('/dashboard', function () {
        return view('Pages.dashboard');
    });
    Route::get('/artikel', function () {
        return view('Pages.artikel');
    });
    Route::get('/hiburan', function () {
        return view('Pages.hiburan');
    });
    Route::get('/homestay', function () {
        return view('Pages.homestay');
    });
    Route::get('/katalog', function () {
        return view('Pages.katalog');
    });
    Route::get('/kegiatan', function () {
        return view('Pages.kegiatan');
    });
    Route::get('/paket', function () {
        return view('Pages.paket');
    });
    Route::get('/tentang', function () {
        return view('Pages.tentang');
    });
    Route::get('/transaksi', function () {
        return view('Pages.transaksi');
    });
    Route::get('/ulasan', function () {
        return view('Pages.ulasan');
    });
    Route::get('', [CTransaksi::class, 'index']);

    Route::post('/artikel/add', [CArtikel::class, 'store'])->name('artikel.tambah');
    // Promo
    Route::post('/promo/tambah', [CPromo::class, 'store'])->name('promo.tambah');
    Route::post('/promo/hapus/{id}', [CPromo::class, 'destroy'])->name('promo.hapus');

    // Transaksi
    Route::post('/transaksi/edit/{id}', [CTransaksi::class, 'edit'])->name('transaksi.edit');
    Route::post('/transaksi/tambah', [CTransaksi::class, 'add'])->name('transaksi.tambah');

    // Kegiatan
    Route::post('/kegiatan/tambah', [CKegiatan::class, 'store'])->name('kegiatan.tambah');
    Route::post('/kegiatan/edit/{id}', [CKegiatan::class, 'update'])->name('kegiatan.edit');
    Route::post('/kegiatan/hapus/{id}', [CKegiatan::class, 'destroy'])->name('kegiatan.hapus');
});

Route::get('Login', [CAdmin::class, 'index'])->name('login');
Route::get('Logout', [CAdmin::class, 'logout'])->name('logout');
Route::post('Register', [CAdmin::class, 'register'])->name('register');

Route::post('admin-login', [CAdmin::class, 'login'])->name('admin-login');

Route::get('test', function () {
    return view('Test.test');
});

// Route::get('check', [CProfile::class, 'index'])->name('test');
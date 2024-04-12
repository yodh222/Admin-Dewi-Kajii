<?php

use App\Http\Controllers\CAdmin;
use App\Http\Controllers\CArtikel;
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

    // Artikel
    Route::post('/artikel/tambah', [CArtikel::class, 'store'])->name('artikel.tambah');
    Route::post('/artikel/edit/{id}', [CArtikel::class, 'update'])->name('artikel.edit');
    Route::post('/artikel/hapus/{id}', [CArtikel::class, 'destroy'])->name('artikel.hapus');

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

    // Hiburan
    Route::post('/hiburan/tambah', [CHiburan::class, 'store'])->name('hiburan.tambah');
    Route::post('/hiburan/edit/{id}', [CHiburan::class, 'update'])->name('hiburan.edit');
    Route::post('/hiburan/hapus/{id}', [CHiburan::class, 'destroy'])->name('hiburan.hapus');

    // Paket Wisata
    Route::post('/paket/tambah', [CPaket::class, 'store'])->name('paket.tambah');
    Route::post('/paket/edit/{id}', [CPaket::class, 'update'])->name('paket.edit');
    Route::post('/paket/hapus/{id}', [CPaket::class, 'destroy'])->name('paket.hapus');

    // Homestay
    Route::post('/homestay/tambah', [CHomestay::class, 'store'])->name('homestay.tambah');
    Route::post('/homestay/edit/{id}', [CHomestay::class, 'update'])->name('homestay.edit');
    Route::post('/homestay/hapus/{id}', [CHomestay::class, 'destroy'])->name('homestay.hapus');

    // Ikan Hias
    Route::post('/katalog/ikan-hias/tambah', [CIkanHias::class, 'store'])->name('ikanhias.tambah');
    Route::post('/katalog/ikan-hias/edit/{id}', [CIkanHias::class, 'update'])->name('ikanhias.edit');
    Route::post('/katalog/ikan-hias/hapus/{id}', [CIkanHias::class, 'destroy'])->name('ikanhias.hapus');

    // Kolam Ikan
    Route::post('/katalog/kolam-ikan/tambah', [CKolam::class, 'store'])->name('kolam.tambah');
    Route::post('/katalog/kolam-ikan/edit/{id}', [CKolam::class, 'update'])->name('kolam.edit');
    Route::post('/katalog/kolam-ikan/hapus/{id}', [CKolam::class, 'destroy'])->name('kolam.hapus');

    // Ulasan
    Route::post('/ulasan/tambah', [CUlasan::class, 'store'])->name('ulasan.tambah');
    Route::post('/ulasan/edit/{id}', [CUlasan::class, 'update'])->name('ulasan.edit');
    Route::post('/ulasan/hapus/{id}', [CUlasan::class, 'destroy'])->name('ulasan.hapus');
});

Route::get('Login', [CAdmin::class, 'index'])->name('login');
Route::get('Logout', [CAdmin::class, 'logout'])->name('logout');
Route::post('Register', [CAdmin::class, 'register'])->name('register');

Route::post('admin-login', [CAdmin::class, 'login'])->name('admin-login');

Route::get('test', function () {
    return view('Test.test');
});

// Route::get('check', [CProfile::class, 'index'])->name('test');
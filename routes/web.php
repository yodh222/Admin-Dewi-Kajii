<?php

use App\Http\Controllers\CAdmin;
use App\Http\Controllers\CArtikel;
use App\Http\Controllers\CProfile;
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
    Route::post('/artikel/add', [CArtikel::class, 'store'])->name('artikel.add');

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
});

Route::get('Login', [CAdmin::class, 'index'])->name('login');
Route::get('Logout', [CAdmin::class, 'logout'])->name('logout');
Route::post('Register', [CAdmin::class, 'register'])->name('register');

Route::post('admin-login', [CAdmin::class, 'login'])->name('admin-login');

// Route::get('check', [CProfile::class, 'index'])->name('test');

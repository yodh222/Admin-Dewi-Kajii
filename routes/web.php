<?php

use App\Http\Controllers\CAdmin;
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

Route::get('/dashboard', function () {
    return view('dashboard');
});
Route::get('/artikel', function () {
    return view('artikel');
});
Route::get('/hiburan', function () {
    return view('hiburan');
});
Route::get('/homestay', function () {
    return view('homestay');
});
Route::get('/katalog', function () {
    return view('katalog');
});
Route::get('/kegiatan', function () {
    return view('kegiatan');
});
Route::get('/paket', function () {
    return view('paket');
});
Route::get('/tentang', function () {
    return view('tentang');
});
Route::get('/transaksi', function () {
    return view('transaksi');
});
Route::get('/ulasan', function () {
    return view('ulasan');
});

// Testing Route
Route::get('/', [CTransaksi::class, 'index'])->name('dashboard');
Route::get('/admlogin', [CAdmin::class, 'index'])->name('login');
Route::post('login', [CAdmin::class, 'login'])->name('admin-login');
Route::post('register', [CAdmin::class, 'register'])->name('admin-register');
Route::get('/check', [CAdmin::class, 'check'])->name('test');

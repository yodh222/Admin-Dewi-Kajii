<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\MUser;
use GuzzleHttp\Client;
use App\Models\MTransaksi;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Requests\RTransaksi;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CTransaksi extends Controller
{
    public function index()
    {

        return view('Test/test', ['Transaksi' => $this->get("none"), 'User' => MUser::all()]);
    }

    // CRUD
    public function get($id = null, $user = null)
    {
        $arr = [];

        if ($user != null) {
            $dataWId = MTransaksi::leftJoin('tb_user', 'tb_user.id_user', 'tb_transaksi.id_user')
                ->leftJoin('tb_jenis_booking', 'tb_jenis_booking.id_jenis', 'tb_transaksi.id_jenis')
                ->select('tb_transaksi.id_transaksi', 'tb_user.nama', 'tb_user.email', 'tb_user.no_telp', 'tb_jenis_booking.nama as jenis_booking', 'tb_jenis_booking.id_jenis', 'tb_transaksi.code_invoice', 'tb_transaksi.bukti_pembayaran', 'tb_transaksi.check_in', 'tb_transaksi.status_check_in', 'tb_jenis_booking.harga', 'tb_transaksi.dibayarkan', 'tb_transaksi.status', 'created_at')
                ->where('tb_user.id_user', $user)
                ->get();

            // Mengubah format created_at
            $dataWId->map(function ($item) {
                $item->created_at = date('Y-m-d', strtotime($item->created_at));
                return $item;
            });

            return $dataWId;
        }
        if ($id != null) {
            $dataWId = MTransaksi::leftJoin('tb_user', 'tb_user.id_user', 'tb_transaksi.id_user')
                ->leftJoin('tb_jenis_booking', 'tb_jenis_booking.id_jenis', 'tb_transaksi.id_jenis')
                ->select('tb_transaksi.id_transaksi', 'tb_user.nama',  'tb_user.email', 'tb_user.no_telp', 'tb_jenis_booking.nama as jenis_booking', 'tb_jenis_booking.id_jenis', 'tb_transaksi.code_invoice', 'tb_transaksi.bukti_pembayaran', 'tb_transaksi.check_in', 'tb_transaksi.status_check_in', 'tb_jenis_booking.harga', 'tb_transaksi.dibayarkan', 'tb_transaksi.status', 'created_at')
                ->where('tb_transaksi.id_transaksi', $id)
                ->first();
            return $dataWId;
        }

        $data = MTransaksi::leftJoin('tb_user', 'tb_user.id_user', 'tb_transaksi.id_user')
            ->leftJoin('tb_jenis_booking', 'tb_jenis_booking.id_jenis', 'tb_transaksi.id_jenis')
            ->select('id_transaksi', 'tb_user.nama', 'tb_user.email', 'no_telp', 'tb_jenis_booking.nama as jenis_booking', 'tb_jenis_booking.id_jenis', 'code_invoice', 'bukti_pembayaran', 'check_in', 'status_check_in', 'harga', 'dibayarkan', 'status', 'created_at')
            ->get();

        $arr['Data'] = $data;
        return $arr;
    }

    public function add(Request $request)
    {
        // try {
        // Validasi Bukti Pembayaran
        $file = $request->file('bukti_pembayaran');
        if (!$this->isImage($file)) {
            return redirect()->back()->with('error', 'File yang anda kirimkan bukan sebuah gambar');
        }
        $uniq = uniqid();
        $fileName = $uniq . '.' . $file->getClientOriginalExtension();
        $file->move('uploads/bukti_pembayaran/', $fileName);
        $path_bukti = 'uploads/bukti_pembayaran/' . $fileName;

        // Generate Invoice
        $invoice = "INV/" . date('dmY') . "/" . $uniq;

        MTransaksi::create([
            'id_user' => $request->input('id_user'),
            'id_jenis' => $request->input('id_jenis'),
            'code_invoice' => $invoice,
            'bukti_pembayaran' => $path_bukti,
            'status_check_in' => 'Belum',
            'check_in' => $request->input('check_in'),
            'dibayarkan' => $request->input('dibayarkan'),
            'status' => $request->input('status'),
        ]);
        return redirect()->back()->with('success', 'Berhasil menambahkan transaksi');
        // } catch (QueryException $e) {
        //     return redirect()->back()->with('error', 'Gagal menambahkan Transaksi');
        // }
    }

    public function edit(Request $request, $id)
    {
        try {
            // Temukan data transaksi berdasarkan ID
            $transaksi = MTransaksi::findOrFail($id);

            // Update data transaksi
            $transaksi->update([
                'id_jenis' => $request->input('id_jenis'),
                'check_in' => $request->input('check_in'),
                'dibayarkan' => $request->input('dibayarkan'),
                'status' => $request->input('status'),
            ]);

            return redirect()->back()->with('success', 'Berhasil mengedit transaksi');
        } catch (ModelNotFoundException $e) {
            return redirect()->back()->with('error', 'Transaksi tidak ditemukan.');
        }
    }

    public function delete($id)
    {
        try {
            $transaksi = MTransaksi::findOrFail($id);
            $transaksi->delete();
            return redirect()->back()->with('success', 'Berhasil menghapus transaksi');
        } catch (ModelNotFoundException $e) {
            return redirect()->back()->with('error', 'Transaksi tidak ditemukan.');
        }
    }

    // API
    public function postData(Request $request)
    {
        try {
            if (!$request->input('id_user') || !$request->input('id_jenis') || !$request->input('check_in') || !$request->input('dibayarkan') || !$request->input('status')) {
                return response()->json([
                    'message' => 'Error',
                    'info' => 'Parameter yang anda berikan tidak lengkap'
                ], 400, [], JSON_PRETTY_PRINT);
            }

            $invoice = "INV/" . date('dmY') . "/" . uniqid();

            MTransaksi::create([
                'id_user' => $request->input('id_user'),
                'id_jenis' => $request->input('id_jenis'),
                'code_invoice' => $invoice,
                'bukti_pembayaran' => '',
                'status_check_in' => 'Belum',
                'check_in' => $request->input('check_in'),
                'dibayarkan' => $request->input('dibayarkan'),
                'status' => $request->input('status'),
            ]);

            return response()->json([
                'message' => 'Success',
                'info' => 'Transaksi berhasil ditambahkan'
            ], 200, [], JSON_PRETTY_PRINT);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error',
                'info' => 'Terjadi kesalahan saat menambahkan transaksi: ' . $e->getMessage()
            ], 500, [], JSON_PRETTY_PRINT);
        }
    }

    public function postDataPembayaran(Request $request, $id)
    {
        try {
            $data = MTransaksi::where('id_transaksi', $id)->first();

            if (!$data) {
                return response()->json([
                    'message' => 'Error',
                    'info' => 'Transaksi tidak ditemukan'
                ], 404, [], JSON_PRETTY_PRINT);
            }

            $uniq = explode('/', $data->code_invoice);
            $uniq = end($uniq);

            $file = $request->file('bukti_pembayaran');
            if (!$file) {
                return response()->json([
                    'message' => 'Error',
                    'info' => 'Tidak ada file bukti pembayaran yang diunggah'
                ], 400, [], JSON_PRETTY_PRINT);
            }

            $fileName = $uniq . '.' . $file->getClientOriginalExtension();
            $file->move('uploads/bukti_pembayaran/', $fileName);
            $path_bukti = 'uploads/bukti_pembayaran/' . $fileName;

            // Update data transaksi dengan menyediakan kriteria pencarian yang tepat
            $data->update([
                'bukti_pembayaran' => $path_bukti
            ]);

            return response()->json([
                'message' => 'Success',
                'info' => 'Transaksi berhasil diupdate'
            ], 200, [], JSON_PRETTY_PRINT);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error',
                'info' => 'Terjadi kesalahan saat mengupdate transaksi: ' . $e->getMessage()
            ], 500, [], JSON_PRETTY_PRINT);
        }
    }




    public function api(Request $request, $method = null, $id = null)
    {

        if ($method != null) {
            switch ($method) {
                case 'get':
                    if ($request->input('id') != null) {
                        return response()->json($this->get($request->input('id')), 200, [], JSON_PRETTY_PRINT);
                    }
                    if ($request->input('user') != null) {
                        return response()->json($this->get('', $request->input('user')), 200, [], JSON_PRETTY_PRINT);
                    }
                    if ($request->input('data') == 'dashboard') {
                        return response()->json($this->dashboard(), 200, [], JSON_PRETTY_PRINT);
                    }
                    return response()->json($this->get(), 200, [], JSON_PRETTY_PRINT);
                    break;
                case 'send':
                    if (!$request->has('no_telp') || !$request->has('message')) {
                        return response()->json([
                            'status' => 'Error',
                            'info' => 'Parameter tidak lengkap'
                        ], 400, [], JSON_PRETTY_PRINT);
                    }
                    return response()->json($this->sendMessage($request->input('no_telp'), $request->input('message')), 200, [], JSON_PRETTY_PRINT);
                    break;
                case 'jenis-booking':
                    if ($id) {
                        return response()->json(DB::table('tb_jenis_booking')->where('id_jenis', $id)->first(), 200, [], JSON_PRETTY_PRINT);
                    }
                    return response()->json([
                        'status' => 'Success',
                        'jenis' => DB::table('tb_jenis_booking')
                            ->get()
                    ], 200, [], JSON_PRETTY_PRINT);
            }
        }
    }


    // Send Message WhatsApp
    private function sendMessage($no_telp = null, $message = null)
    {

        $client = new Client();
        $token = 'qMZ+vU84E_mmu#uRkscp';
        $target = $no_telp;
        $response = $client->post('https://api.fonnte.com/send', [
            'headers' => [
                'Authorization' => $token,
            ],
            'form_params' => [
                'target' => $target,
                'message' => $message,
                'url' => 'https://md.fonnte.com/images/wa-logo.png',
                'countryCode' => '62',
            ],
        ]);

        $body = $response->getBody()->getContents();
        $data = json_decode($body, true);
        return response()->json([
            'status' => 'Error',
            'info' => 'Pesan berhasil terkirim'
        ], 200, [], JSON_PRETTY_PRINT);
    }

    private function isImage($file)
    {
        if ($file !== null && $file instanceof \SplFileInfo) {
            $extension = strtolower($file->getClientOriginalExtension());
            $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif']; // Ekstensi file gambar yang diizinkan
            return in_array($extension, $allowedExtensions);
        }
        return false;
    }

    private function dashboard()
    {
        $tahunIni = Carbon::now()->year;
        $process = MTransaksi::where('status', 'process')
            ->whereYear('created_at', $tahunIni)
            ->count();
        $dp = MTransaksi::where('status', 'dp')
            ->whereYear('created_at', $tahunIni)
            ->count();
        $batal = MTransaksi::where('status', 'batal')
            ->whereYear('created_at', $tahunIni)
            ->count();

        // Loop untuk menghitung pendapatan dan penjualan paket wisata untuk tahun ini dan tahun sebelumnya
        for ($i = 0; $i < 12; $i++) {
            $pendapatan[$tahunIni][$i] = MTransaksi::whereMonth('created_at', $i + 1)
                ->whereYear('created_at', $tahunIni)
                ->sum('dibayarkan');

            $pendapatan[$tahunIni - 1][$i] = MTransaksi::whereMonth('created_at', $i + 1)
                ->whereYear('created_at', $tahunIni - 1)
                ->sum('dibayarkan');

            $wisata[$tahunIni][$i] = MTransaksi::whereMonth('created_at', $i + 1)
                ->whereYear('created_at', $tahunIni)
                ->where('status', 'Lunas')
                ->count();

            $wisata[$tahunIni - 1][$i] = MTransaksi::whereMonth('created_at', $i + 1)
                ->whereYear('created_at', $tahunIni - 1)
                ->where('status', 'Lunas')
                ->count();
        }

        return ['Data' => [
            'Process' => $process,
            'Dp' => $dp,
            'Batal' => $batal,
            'Chart Pendapatan' => $pendapatan,
            'Chart Penjualan Paket Wisata' => $wisata,
        ]];
    }
}

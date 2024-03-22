<?php

namespace App\Http\Controllers;

use Illuminate\Database\QueryException;
use App\Http\Requests\RTransaksi;
use App\Models\MTransaksi;
use App\Models\MUser;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use GuzzleHttp\Client;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CTransaksi extends Controller
{
    public function index()
    {

        return view('Test/test', ['Transaksi' => $this->get("none"), 'User' => MUser::all()]);
    }

    // CRUD
    public function get($req = null, $id = null, $user = null)
    {
        $arr = [];

        if ($user != null) {
            $dataWId = MTransaksi::leftJoin('tb_user', 'tb_user.id_user', 'tb_transaksi.id_user')
                ->leftJoin('tb_jenis_wisata', 'tb_jenis_wisata.id_jenis', 'tb_transaksi.id_jenis')
                ->select('tb_transaksi.id_transaksi', 'tb_user.nama', 'tb_user.no_telp', 'tb_jenis_wisata.nama as jenis_wisata', 'tb_transaksi.code_invoice', 'tb_transaksi.bukti_pembayaran', 'tb_transaksi.check_in', 'tb_jenis_wisata.harga', 'tb_transaksi.dibayarkan', 'tb_transaksi.status')
                ->where('tb_user.id_user', $user)
                ->get();
            $arr['User'] = $dataWId;
        }
        if ($id != null) {
            $dataWId = MTransaksi::leftJoin('tb_user', 'tb_user.id_user', 'tb_transaksi.id_user')
                ->leftJoin('tb_jenis_wisata', 'tb_jenis_wisata.id_jenis', 'tb_transaksi.id_jenis')
                ->select('tb_transaksi.id_transaksi', 'tb_user.nama', 'tb_user.no_telp', 'tb_jenis_wisata.nama as jenis_wisata', 'tb_transaksi.code_invoice', 'tb_transaksi.bukti_pembayaran', 'tb_transaksi.check_in', 'tb_jenis_wisata.harga', 'tb_transaksi.dibayarkan', 'tb_transaksi.status')
                ->where('tb_transaksi.id_transaksi', $id)
                ->first();
            $arr['Id'] = $dataWId;
        }

        $data = MTransaksi::leftJoin('tb_user', 'tb_user.id_user', 'tb_transaksi.id_user')
            ->leftJoin('tb_jenis_wisata', 'tb_jenis_wisata.id_jenis', 'tb_transaksi.id_jenis')
            ->select('id_transaksi', 'tb_user.nama', 'no_telp', 'tb_jenis_wisata.nama as jenis_wisata', 'code_invoice', 'bukti_pembayaran', 'check_in', 'harga', 'dibayarkan', 'status')
            ->get();
        if ($req == "none") {
            return $data;
        }
        $arr['Data'] = $data;
        return $arr;
    }

    public function add(RTransaksi $request)
    {
        try {
            // Validasi Bukti Pembayaran
            $file = $request->file('bukti_pembayaran');
            if (!$this->isImage($file)) {
                return redirect()->back()->with('imageError', 'File yang anda kirimkan bukan sebuah gambar');
            }
            $uniq = uniqid();
            $fileName = $uniq . '.' . $file->getClientOriginalExtension();
            $file->move('uploads/bukti_pembayaran/', $fileName);
            $path_bukti = asset('uploads/bukti_pembayaran/' . $fileName);

            // Generate Invoice
            $invoice = "INV/" . date('dmY') . "/" . $uniq;

            MTransaksi::create([
                'id_user' => $request->input('id_user'),
                'no_telp' => $request->input('no_telp'),
                'id_jenis' => $request->input('id_jenis'),
                'code_invoide' => $invoice,
                'bukti_pembayaran' => $path_bukti,
                'check_in' => $request->input('check_in'),
                'dibayarkan' => $request->input('dibayarkan'),
                'status' => $request->input('status'),
            ]);
            return redirect()->back()->with('success', 'Berhasil menambahkan transaksi');
        } catch (QueryException $e) {
            return redirect()->back()->with('error', 'Gagal menambahkan Transaksi');
        }
    }

    public function edit(RTransaksi $request)
    {
        try {
            // Temukan data transaksi berdasarkan ID
            $transaksi = MTransaksi::findOrFail($request->id);

            // Validasi Bukti Pembayaran
            $file = $request->file('bukti_pembayaran');
            if (!$this->isImage($file)) {
                return response()->json([
                    'Status' => 'Error',
                    'Message' => 'File yang anda kirimkan bukan sebuah gambar'
                ], 400, [], JSON_PRETTY_PRINT);
            }
            $uniq = uniqid();
            $fileName = $uniq . '.' . $file->getClientOriginalExtension();
            $file->move('uploads/bukti_pembayaran/', $fileName);
            $path_bukti = asset('uploads/bukti_pembayaran/' . $fileName);

            // Update data transaksi
            $transaksi->update([
                'id_user' => $request->input('id_user'),
                'no_telp' => $request->input('no_telp'),
                'id_jenis' => $request->input('id_jenis'),
                'bukti_pembayaran' => $path_bukti,
                'check_in' => $request->input('check_in'),
                'dibayarkan' => $request->input('dibayarkan'),
                'status' => $request->input('status'),
            ]);

            return redirect()->back()->with('success', 'Berhasil mengedit transaksi');
        } catch (ModelNotFoundException $e) {
            return redirect()->back()->with('error', 'Transaksi tidak ditemukan.');
        } catch (QueryException $e) {
            return redirect()->back()->with('error', 'Gagal mengedit Transaksi. Error: ' . $e->getMessage());
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
    public function api(Request $request, $method = null)
    {

        if ($method != null) {
            switch ($method) {
                case 'get':
                    if ($request->input('id') != null) {
                        return response()->json($this->get('', $request->input('id')), 200, [], JSON_PRETTY_PRINT);
                    }
                    if ($request->input('user') != null) {
                        return response()->json($this->get('', '', $request->input('user')), 200, [], JSON_PRETTY_PRINT);
                    }
                    if ($request->input('data') == 'dashboard') {
                        return response()->json($this->dashboard(), 200, [], JSON_PRETTY_PRINT);
                    }
                    return response()->json($this->get(), 200, [], JSON_PRETTY_PRINT);
                    break;
                case 'send':
                    if (!$request->has('no_telp') || !$request->has('message')) {
                        return response()->json([
                            'Status' => 'Error',
                            'Message' => 'Parameter tidak ditemukan'
                        ], 400, [], JSON_PRETTY_PRINT);
                    }
                    return response()->json($this->sendMessage($request->input('no_telp'), $request->input('message')), 200, [], JSON_PRETTY_PRINT);
                    break;
            }
        }
    }


    // Send Message WhatsApp
    private function sendMessage($no_telp = null, $message = null)
    {
        if ($no_telp == null || $message == null) {
            return response()->json([
                'Status' => 'Error',
                'Message' => 'Parameter tidak lengkap'
            ]);
        }

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
            'Status' => 'Success',
            'Message' => 'Pesan berhasil terkirimm ke' . $target,
            'Response' => $data
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
                ->sum('dibayarkan');

            $wisata[$tahunIni - 1][$i] = MTransaksi::whereMonth('created_at', $i + 1)
                ->whereYear('created_at', $tahunIni - 1)
                ->sum('dibayarkan');
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

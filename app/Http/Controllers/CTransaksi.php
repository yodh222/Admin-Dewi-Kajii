<?php

namespace App\Http\Controllers;

use Illuminate\Database\QueryException;
use App\Http\Requests\RTransaksi;
use App\Models\MTransaksi;
use App\Models\MUser;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use GuzzleHttp\Client;

class CTransaksi extends Controller
{
    public function index()
    {

        return view('Test/test',['Transaksi' => $this->get("none"), 'User' => MUser::all()]);
    }
    public function get($req = "json"){

        $data = MTransaksi::leftJoin('tb_user','tb_user.id_user','tb_transaksi.id_user')->select('id_transaksi', 'nama','no_telp','id_jenis','code_invoice','bukti_pembayaran','check_in','total_pembayaran','dibayarkan','status')->get();

        if ($req == "none") {
            return $data;
        }
        return response()->json(['Data'=>$data],200,[],JSON_PRETTY_PRINT);

    }

    public function add(RTransaksi $request){
        try {
            // Validasi Bukti Pembayaran
            $file = $request->file('bukti_pembayaran');
            if (!$this->isImage($file)) {
                return response()->json([
                    'Status' => 'Error',
                    'Message' => 'File yang anda kirimkan bukan sebuah gambar'
                ], 400, [], JSON_PRETTY_PRINT);
            }
            $uniq = uniqid();

            // $destinationPath = public_path('uploads/bukti_pembayaran');
            $fileName = $uniq . '.' . $file->getClientOriginalExtension();
            $file->move('uploads/bukti_pembayaran/', $fileName);
            $path_bukti = asset('uploads/bukti_pembayaran/' . $fileName);


            // Generate Invoice
            $invoice = "INV/".date('dmY')."/".$uniq;

            MTransaksi::create([
                'id_user' => $request->input('id_user'),
                'no_telp' => $request->input('no_telp'),
                'id_jenis' => $request->input('id_jenis'),
                'code_invoide' => $invoice,
                'bukti_pembayaran' => $path_bukti,
                'check_in' => $request->input('check_in'),
                'total_pembayaran' => $request->input('total_pembayaran'),
                'dibayarkan' => $request->input('dibayarkan'),
                'status' => $request->input('status'),
            ]);
            return response()->json([
                'Status' => 'Success',
                'Message' => 'Data Berhasil Ditambahkan'
            ], 200, [], JSON_PRETTY_PRINT);
        } catch (QueryException $e) {
            return redirect()->back()->with('error', 'Gagal menambahkan Transaksi. Error: ' . $e->getMessage());
        }
    }
    public function testUpload(Request $request){
        // Validasi Bukti Pembayaran
        $file = $request->file('bukti_pembayaran');
        if (!$this->isImage($file)) {
            return response()->json([
                'Status' => 'Error',
                'Message' => 'File yang anda kirimkan bukan sebuah gambar'
            ], 400, [], JSON_PRETTY_PRINT);
        }
        $uniq = uniqid();

        // $destinationPath = public_path('uploads/bukti_pembayaran');
        $fileName = $uniq . '.' . $file->getClientOriginalExtension();
        $file->move('uploads/bukti_pembayaran/', $fileName);
        $path_bukti = asset('uploads/bukti_pembayaran/' . $fileName);


        // Generate Invoice
        $invoice = "INV/".date('dmY')."/".$uniq;
        return response()->json([
            'Status' => 'Success',
            'Invoice' => $invoice,
            'Path File' => $path_bukti,
            'Message' => "Berhasil di Upload"
    ],200,[],JSON_PRETTY_PRINT);
    }

    public function sendMessage(Request $request){

        $client = new Client();

        $token = 'qMZ+vU84E_mmu#uRkscp';
        // $target = '088221629812';
        $target = '082133753551';

        $response = $client->post('https://api.fonnte.com/send', [
            'headers' => [
                'Authorization' => $token,
            ],
            'form_params' => [
                'target' => $target,
                'message' => 'Testing',
                'url' => 'https://md.fonnte.com/images/wa-logo.png',
                'countryCode' => '62',
            ],
        ]);

        $body = $response->getBody()->getContents();
        $data = json_decode($body, true);
        return response()->json([
            'Status' => 'Success',
            'Message' => 'Pesan berhasil terkirimm ke'.$target,
            'Response' => $data
        ],200,[],JSON_PRETTY_PRINT);
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



}
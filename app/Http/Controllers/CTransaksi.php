<?php

namespace App\Http\Controllers;

use App\Models\MTransaksi;
use App\Models\MUser;
use Illuminate\Http\Request;

class CTransaksi extends Controller
{
    public function index()
    {
        return view('Test/test');
    }

    public function api(Request $request){

        $data = MTransaksi::leftJoin('tb_user','tb_user.id_user','tb_transaksi.id_user')->select('id_transaksi', 'nama','no_telp','id_jenis','code_invoice','bukti_pembayaran','check_in','total_pembayaran','dibayarkan','status')->get();
        return response()->json(['Data'=>$data],200,[],JSON_PRETTY_PRINT);
    }
}
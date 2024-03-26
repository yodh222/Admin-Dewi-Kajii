<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\MUser;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class MTransaksi extends Model
{
    use HasFactory;

    protected $table = 'tb_transaksi';
    protected $primaryKey = 'id_transaksi';
    protected $guarded = ['id_transaksi'];
    public $timestamps = true;
}
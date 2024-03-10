<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\MUser;

class MTransaksi extends Model
{
    use HasFactory;

    protected $table = 'tb_transaksi';
    protected $primary = 'id_transaksi';
    protected $guarded = ['id_transaksi'];

    public function user()
    {
        return $this->belongsTo(MUser::class, 'id_user', 'id_user');
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\MUser;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class MTransaksi extends Model implements JWTSubject
{
    use HasFactory;

    protected $table = 'tb_transaksi';
    protected $primary = 'id_transaksi';
    protected $guarded = ['id_transaksi'];
    public $timestamps = true;

    public function user()
    {
        return $this->belongsTo(MUser::class, 'id_user', 'id_user');
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }
    public function getJWTCustomClaims()
    {
        return [];
    }
}
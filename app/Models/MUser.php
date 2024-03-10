<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\MTransaksi;

class MUser extends Model
{
    use HasFactory;
    protected $table = 'tb_user';
    protected $primaryKey = 'id_user';
    protected $guarded = ['id_user'];
    public function transaksis()
    {
        return $this->hasMany(MTransaksi::class);
    }
}
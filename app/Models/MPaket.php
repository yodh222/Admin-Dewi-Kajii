<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MPaket extends Model
{
    use HasFactory;
    protected $table = 'tb_paket_wisata';
    protected $primaryKey = 'id_paket_wisata';
    protected $guarded = ['id_paket_wisata'];
    public $timestamps = false;
}

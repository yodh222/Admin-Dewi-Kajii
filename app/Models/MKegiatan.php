<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MKegiatan extends Model
{
    use HasFactory;
    protected $table = 'tb_kegiatan';
    protected $primaryKey = 'id_kegiatan';
    protected $guarded = ['id_kegiatan'];
    public $timestamps = false;
}

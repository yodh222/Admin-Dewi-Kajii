<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MKolam extends Model
{
    use HasFactory;
    protected $table = 'tb_kolam_ikan';
    protected $primaryKey = 'id_kolam';
    protected $guarded = ['id_kolam'];

    public $timestamps = false;
}

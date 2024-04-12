<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MIkanHias extends Model
{
    use HasFactory;
    protected $table = 'tb_ikan_hias';
    protected $primaryKey = 'id_ikan_hias';
    protected $guarded = ['id_ikan_hias'];

    public $timestamps = false;
}

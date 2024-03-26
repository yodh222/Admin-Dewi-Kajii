<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MHiburan extends Model
{
    use HasFactory;
    protected $table = 'tb_hiburan';
    protected $primaryKey = 'id_hiburan';
    protected $guarded = ['id_hiburan'];

    public $timestamps = false;
}

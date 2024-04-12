<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MUlasan extends Model
{
    use HasFactory;
    protected $table = 'tb_ulasan';
    protected $primaryKey = 'id_ulasan';
    protected $guarded = ['id_ulasan'];

    public $timestamps = false;
}

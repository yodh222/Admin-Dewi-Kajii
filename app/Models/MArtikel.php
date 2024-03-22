<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MArtikel extends Model
{
    use HasFactory;
    protected $table = 'tb_artikel';
    protected $primary = 'id_artikel';
    protected $guarded = ['id_artikel'];
}
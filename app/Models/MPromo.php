<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MPromo extends Model
{
    use HasFactory;

    protected $table = 'tb_promo';
    protected $primaryKey = 'id_promo';
    protected $guarded = ['id_promo'];
    public $timestamps = false;
}
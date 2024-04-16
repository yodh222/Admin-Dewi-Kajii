<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MProfile extends Model
{
    use HasFactory;
    protected $table = 'tb_tentang_kami';
    protected $guarded = ['id'];

    public $timestamps = false;
}

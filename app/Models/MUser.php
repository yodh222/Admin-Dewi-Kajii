<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class MUser extends Authenticatable
{
    use HasFactory;
    protected $table = 'tb_user';
    protected $primaryKey = 'id_user';
    protected $guarded = ['id_user'];
    public $timestamps = false;
}

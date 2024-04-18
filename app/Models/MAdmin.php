<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MAdmin extends Authenticatable
{
    use HasFactory;
    protected $table = 'tb_admin';
    protected $primaryKey = 'id_admin';
    protected $guard = ['id_admin'];

    public $timestamps = false;

    protected $fillable = [
        'nama',
        'no_telp',
        'alamat',
        'email',
        'password'
    ];
}

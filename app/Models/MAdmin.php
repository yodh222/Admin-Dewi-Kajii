<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MAdmin extends Model
{
    use HasFactory;
    protected $table = 'tb_admin';
    protected $primary = 'id_admin';
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

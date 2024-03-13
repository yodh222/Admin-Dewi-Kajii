<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MAdmin extends Model implements JWTSubject
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

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }
    public function getJWTCustomClaims()
    {
        return [];
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MAdmin extends Model
{
    use HasFactory;
    protected $table = 'tb_admin';
    protected $primary = 'id_admin';
    protected $guard = ['id_admin'];
}

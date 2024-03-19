<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MTimeline extends Model
{
    use HasFactory;

    protected $table = 'tb_timeline';
    protected $primary = 'id_timeline';
}

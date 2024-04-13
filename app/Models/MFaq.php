<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MFaq extends Model
{
    use HasFactory;

    protected $table = 'tb_faq';
    protected $primaryKey = 'id_faq';
    protected $guarded = ['id_faq'];

    public $timestamps = false;
}

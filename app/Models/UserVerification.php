<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserVerification extends Model
{
    use HasFactory;

    protected $fillable = [
        'resident_id',
        'type',
        'photo',
        'status',
        'admin_feedback'
    ];

    protected $casts = [
        'type' => 'string',
        'status' => 'string'
    ];

    public function resident()
    {
        return $this->belongsTo(User::class, 'resident_id');
    }
}
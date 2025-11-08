<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Complaint extends Model
{
    use HasFactory;

    protected $fillable = [
        'resident_id',
        'type',
        'barangay',
        'photo',
        'description',
        'status',
    ];

    public function resident()
    {
        return $this->belongsTo(User::class, 'resident_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Barangay extends Model
{
    /** @use HasFactory<\Database\Factories\BarangayFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'district_id',
        'latitude',
        'longitude',
    ];

    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class);
    }
}

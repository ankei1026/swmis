<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class District extends Model
{
    protected $fillable = ['name'];

    public function barangays(): HasMany
    {
        return $this->hasMany(Barangay::class);
    }
}

<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone_number',
        'barangay',
        'status',
    ];


    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class, 'driver_id');
    }

    public function schedulingRoutes()
    {
        return $this->belongsToMany(ScheduleRoute::class, 'driver_scheduling_route', 'driver_id', 'scheduling_route_id');
    }

    // In User model
    public function verifications()
    {
        return $this->hasMany(UserVerification::class, 'resident_id');
    }

    public function pendingVerifications()
    {
        return $this->verifications()->where('status', 'pending');
    }

    public function isFullyVerified()
    {
        $requiredTypes = ['valid_id', 'birth_certificate', 'barangay_certificate'];
        $approvedTypes = $this->verifications()->where('status', 'approved')->pluck('type');

        return $approvedTypes->intersect($requiredTypes)->count() === count($requiredTypes);
    }
}

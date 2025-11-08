<?php

namespace App\Providers;

use App\Http\Controllers\SMSController;
use Illuminate\Support\ServiceProvider;
use App\Models\Schedule;
use App\Observers\ScheduleObserver;

class AppServiceProvider extends ServiceProvider
{
    public function boot()
    {
        Schedule::observe(ScheduleObserver::class);
    }

    public function register()
    {
        // Register the SMS service
        $this->app->singleton(SMSController::class, function ($app) {
            return new SMSController();
        });
    }
}
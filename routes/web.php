<?php

use App\Http\Controllers\{
    AdminController,
    BarangayController,
    ComplaintsController,
    DriverController,
    DriverScheduleController,
    MonitoringController,
    RegisterController,
    ResidentComplaintController,
    ResidentController,
    ResidentProfileController,
    ResidentScheduleController,
    ResidentWasteTrackerController,
    ScheduleRouteController,
    SchedulingController,
    SessionController,
    StationRouteController,
    UserController,
    UserVerificationController,
    WasteTrackerDriverController,
    WelcomePageController
};
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('welcome');
// })->name('home');

Route::get('/', [WelcomePageController::class, 'index'])->name('welcome');

// ======================
// AUTHENTICATION ROUTES
// ======================
Route::prefix('auth')->group(function () {
    Route::get('/login', [SessionController::class, 'index'])->name('login');
    Route::post('/login', [SessionController::class, 'store']);
    Route::post('/logout', [SessionController::class, 'destroy'])->name('logout');

    Route::get('/register', [RegisterController::class, 'index']);
    Route::post('/register', [RegisterController::class, 'store'])->name('register');
});

// ======================
// ADMIN ROUTES
// ======================
Route::prefix('admin')
    ->middleware(['auth', 'role:admin'])
    ->group(function () {
        Route::get('/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');

        // User Management
        Route::get('/users/create', [UserController::class, 'createUser'])->name('admin.users.create');
        Route::get('/users/list', [UserController::class, 'listUser'])->name('admin.users.list');
        Route::post('/users/store', [UserController::class, 'store'])->name('admin.users.store');
        Route::get('/users/edit/{id}', [UserController::class, 'edit'])->name('admin.users.edit');
        Route::put('/users/{id}', [UserController::class, 'update'])->name('admin.users.update');
        Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('admin.users.destroy');

        // In routes/web.php
        Route::get('/monitoring/live-updates', [MonitoringController::class, 'getLiveUpdates'])->name('admin.monitoring.live-updates');

        // Scheduling and Monitoring
        Route::get('/scheduling/create', [SchedulingController::class, 'createScheduling'])->name('admin.scheduling.create');
        Route::get('/scheduling/list', [SchedulingController::class, 'listScheduling'])->name('admin.scheduling.list');
        Route::post('/scheduling/store', [SchedulingController::class, 'store'])->name('admin.scheduling.store');
        Route::get('/scheduling/{schedule}/edit', [SchedulingController::class, 'edit'])->name('admin.scheduling.edit');
        Route::put('/scheduling/{schedule}', [SchedulingController::class, 'update'])->name('admin.scheduling.update');
        Route::delete('/scheduling/{schedule}', [SchedulingController::class, 'destroy'])->name('admin.scheduling.destroy');

        Route::get('/monitoring', [MonitoringController::class, 'index'])->name('admin.monitoring');

        Route::get('/user-verification', [UserVerificationController::class, 'adminIndex'])->name('admin.user-verification');
        Route::get('/user-verification/{id}', [UserVerificationController::class, 'adminShow'])->name('admin.user-verification.show');
        Route::put('/user-verification/{id}', [UserVerificationController::class, 'update'])->name('admin.user-verification.update');
        Route::delete('/user-verification/{id}', [UserVerificationController::class, 'destroy'])->name('admin.user-verification.destroy');

        Route::get('/complaints', [ComplaintsController::class, 'index'])->name('admin.complaints');
        Route::get('/admin/complaints/{id}/edit', [ComplaintsController::class, 'edit'])->name('complaints.edit');
        Route::put('/admin/complaints/{id}', [ComplaintsController::class, 'update'])->name('complaints.update');

        Route::get('profile', [ResidentProfileController::class, 'adminProfile'])->name('admin.profile');
    });

// ======================
// RESIDENT ROUTES
// ======================
Route::prefix('resident')
    ->middleware(['auth', 'role:resident'])
    ->group(function () {
        Route::get('/dashboard', [ResidentController::class, 'index'])->name('resident.dashboard');

        Route::get('/complaint', [ResidentComplaintController::class, 'index'])->name('resident.complaints.index');
        Route::post('/complaint', [ResidentComplaintController::class, 'store'])->name('resident.complaints.store');

        Route::get('/user-verification', [UserVerificationController::class, 'index'])->name('user.user-verification.index');
        Route::post('/user-verification/create', [UserVerificationController::class, 'store'])->name('user.user-verification.store');
        Route::get('/user-verification/{id}', [UserVerificationController::class, 'show'])->name('user.user-verification.show');

        Route::get('/schedule', [ResidentScheduleController::class, 'index'])->name('resident.schedule');

        Route::get('/collectiontracker', [ResidentWasteTrackerController::class, 'index'])->name('resident.collectiontracker');

        Route::get('/monitoring/live-updates', [ResidentWasteTrackerController::class, 'getLiveUpdates'])->name('resident.monitoring.live-updates');

        // Scheduling and Monitoring
        Route::get('/profile', [ResidentProfileController::class, 'index'])->name('resident.profile');
    });

// ======================
// DRIVER ROUTES
// ======================
Route::prefix('driver')
    ->middleware(['auth', 'role:driver'])
    ->group(function () {
        Route::get('/dashboard', [DriverController::class, 'index'])->name('driver.dashboard');

        Route::get('/barangays/create', [BarangayController::class, 'createBarangay'])->name('driver.barangay.create');
        Route::get('/barangays/list', [BarangayController::class, 'listBarangay'])->name('driver.barangay.list');
        Route::post('/barangays/store', [BarangayController::class, 'store'])->name('driver.barangay.store');
        Route::get('/barangays/edit/{id}', [BarangayController::class, 'edit'])->name('driver.barangay.edit');
        Route::put('/barangays/update/{id}', [BarangayController::class, 'update'])->name('driver.barangay.update');
        Route::delete('/barangays/delete/{id}', [BarangayController::class, 'destroy'])->name('driver.barangay.delete');

        Route::get('/stationroute/create', [StationRouteController::class, 'createStationRoute'])->name('driver.stationroute.create');
        Route::get('/stationroute/list', [StationRouteController::class, 'listStationRoute'])->name('driver.stationroute.list');
        Route::post('/stationroute/store', [StationRouteController::class, 'store'])->name('driver.stationroute.store');
        Route::get('/stationroute/edit/{id}', [StationrouteController::class, 'edit'])->name('driver.stationroute.edit');
        Route::put('/stationroute/update/{id}', [StationrouteController::class, 'update'])->name('driver.stationroute.update');
        Route::delete('/stationroute/delete/{id}', [StationrouteController::class, 'destroy'])->name('driver.stationroute.delete');

        Route::get('/scheduleroute/create', [ScheduleRouteController::class, 'createSchedulingRoute'])->name('driver.scheduleroute.create');
        Route::get('/scheduleroute/list', [ScheduleRouteController::class, 'listSchedulingRoute'])->name('driver.scheduleroute.list');
        Route::post('/scheduleroute/store', [ScheduleRouteController::class, 'store'])->name('driver.scheduleroute.store');
        Route::get('/scheduleroute/edit/{id}', [ScheduleRouteController::class, 'editSchedulingRoute'])->name('driver.scheduleroute.edit');
        Route::put('/scheduleroute/{id}', [ScheduleRouteController::class, 'update'])->name('driver.scheduleroute.update');
        Route::delete('/scheduleroute/{id}', [ScheduleRouteController::class, 'destroy'])->name('driver.scheduleroute.destroy');

        Route::get('/collectiontracker', [WasteTrackerDriverController::class, 'index'])->name('driver.collection-tracker');
        Route::post('/schedules/{schedule}/start', [WasteTrackerDriverController::class, 'startSchedule'])->name('driver.schedules.start');
        Route::patch('/schedules/{schedule}/stations/{station}', [WasteTrackerDriverController::class, 'updateStationStatus'])->name('driver.stations.update');
        Route::post('/schedules/{schedule}/complete', [WasteTrackerDriverController::class, 'completeSchedule'])->name('driver.schedules.complete');
        Route::post('/schedules/{schedule}/fail', [WasteTrackerDriverController::class, 'failSchedule'])->name('driver.schedules.fail');
        Route::get('/schedules/{schedule}', [WasteTrackerDriverController::class, 'getSchedule'])->name('driver.schedules.show');
        Route::post('/schedules/{schedule}/abort', [WasteTrackerDriverController::class, 'abortSchedule'])->name('driver.schedules.abort');

        Route::get('/schedule', [DriverScheduleController::class, 'index'])->name('driver.schedule');

        Route::get('/profile', [ResidentProfileController::class, 'driverProfile'])->name('driver.profile');
    });

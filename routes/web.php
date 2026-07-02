<?php

use App\Http\Controllers\MailSettingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ResidentSignupController;

// Route::get('/', function () {
// return Inertia::render('Welcome', [
//     'canLogin' => Route::has('login'),
//     'canRegister' => Route::has('register'),
//     'laravelVersion' => Application::VERSION,
//     'phpVersion' => PHP_VERSION,
// ]);
// });
Route::get('/', function () {
    return redirect()->route('dashboard');
});
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Route::get('/dashboard', [DashboardController::class, 'index'])
//     ->middleware(['auth', 'verified'])
//     ->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('users', UserController::class);
});
Route::prefix('settings')->group(function () {
    Route::get('/mail', [MailSettingController::class, 'index'])->name('settings.mail');
    Route::put('/mail', [MailSettingController::class, 'update'])->name('settings.mail.update');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('properties', PropertyController::class);


// New routes for listing and view
Route::get('/resident-signup/list', [ResidentSignupController::class, 'list'])->name('resident-signup.list');

});

Route::get('/resident-signup', [ResidentSignupController::class, 'index'])->name('resident-signup.index');
Route::get('/resident-signup/property-search', [ResidentSignupController::class, 'searchProperty'])->name('resident-signup.search');
Route::post('/resident-signup', [ResidentSignupController::class, 'store'])->name('resident-signup.store');

Route::get('/resident-signup/{id}', [ResidentSignupController::class, 'show'])->name('resident-signup.show');

// Add this route inside the auth middleware group
Route::delete('/resident-signup-delete/{id}', [ResidentSignupController::class, 'destroy'])->name('resident-signup.destroy');

require __DIR__ . '/auth.php';

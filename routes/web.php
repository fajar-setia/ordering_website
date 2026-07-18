<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Halaman Utama - User (TANPA LOGIN)
Route::get('/', [ProductController::class, 'index'])->name('home');

// Dashboard - Hanya Admin (PERLU LOGIN)
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Profile (Hanya untuk admin yang login)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::post('/checkout', [OrderController::class, 'store'])->name('checkout.store');

Route::get('/pesanan/sukses/{order}', function ($orderId) {
    return Inertia::render('Users/PesananSukses', [
        'orderId' => $orderId
    ]);
})->name('pesanan.sukses');

require __DIR__.'/auth.php';
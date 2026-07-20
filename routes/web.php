<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
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

Route::get('/pesanan', [OrderController::class, 'showActiveOrder'])->name('pesanan.aktif');

Route::prefix('admin')->name('admin.')->group(function () {

    // Route CRUD Manajemen Pesanan
    Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
    Route::patch('/orders/{id}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.update-status');

    //Route CRUD Category
    Route::get('/categories', [AdminCategoryController::class, 'index'])->name('categories.index');
    Route::post('/categories', [AdminCategoryController::class, 'store'])->name('categories.store');
    Route::put('/categories/{id}', [AdminCategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{id}', [AdminCategoryController::class, 'destroy'])->name('categories.destroy');
    
    // Route CRUD Manajemen Menu/Produk
    Route::get('/products', [AdminProductController::class, 'index'])->name('products.index');
    Route::post('/products', [AdminProductController::class, 'store'])->name('products.store');
    // Laravel membutuhkan POST + Form Data _method PATCH untuk request update yang membawa file/gambar
    Route::patch('/products/{id}', [AdminProductController::class, 'update'])->name('products.update'); 
    Route::delete('/products/{id}', [AdminProductController::class, 'destroy'])->name('products.destroy');
});

require __DIR__.'/auth.php';
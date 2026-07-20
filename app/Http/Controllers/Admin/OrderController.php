<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Events\OrderStatusUpdated;

class OrderController extends Controller
{
    /**
     * Menampilkan halaman daftar pesanan untuk admin / dapur.
     */
    public function index()
    {
        // 💡 Gabungkan dengan relasi 'items' dan gunakan paginate
        $orders = Order::with('items')
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Order/Index', [
            'orders' => $orders
        ]);
    }

    public function updateStatus(Request $request, $id)
{
    // 1. Validasi input status
    $validated = $request->validate([
        'status' => 'required|in:pending,processing,completed,cancelled'
    ]);

    // 2. Cari data pesanan berdasarkan ID (Menggunakan $id biasa agar pasti ketemu)
    $order = Order::findOrFail($id);

    // 3. Update status di database
    $order->update([
        'status' => $validated['status']
    ]);

    // 4. 💡 Tembakkan sinyal real-time Reverb ke HP pembeli
    try {
        event(new OrderStatusUpdated($order));
    } catch (\Throwable $e) {
        \Log::error("Gagal broadcast status update: " . $e->getMessage());
    }

    // 5. Kembalikan ke halaman sebelumnya
    return redirect()->back()->with('success', 'Status pesanan berhasil diperbarui.');
}
}
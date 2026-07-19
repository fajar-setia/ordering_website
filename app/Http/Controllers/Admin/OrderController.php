<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

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

    /**
     * Memperbarui status pesanan (pending -> processing -> completed -> cancelled)
     */
    public function updateStatus(Request $request, $id)
    {
        // Validasi input status agar hanya menerima status yang diizinkan
        $validated = $request->validate([
            'status' => 'required|in:pending,processing,completed,cancelled'
        ]);

        // Cari data pesanan berdasarkan ID, jika tidak ketemu akan otomatis memicu error 404
        $order = Order::findOrFail($id);
        
        // Update status di database SQLite
        $order->update([
            'status' => $validated['status']
        ]);

        // Kembalikan ke halaman sebelumnya (dashboard dapur) sambil membawa flash message sukses
        return redirect()->back()->with('success', 'Status pesanan berhasil diperbarui.');
    }
}
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Events\OrderCreated;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nama'            => 'required|string|max:255',
            'nomorMeja'       => 'required|string|max:255',
            'catatan'         => 'nullable|string',
            'items'           => 'required|array',
            'items.*.id'      => 'required|exists:products,id',
            'items.*.name'    => 'required|string|max:255',
            'items.*.price'   => 'required|integer',
            'items.*.qty'     => 'required|integer|min:1',
            'total'           => 'required|integer',
        ]);

        // Tampung hasil return dari transaction ke dalam variabel $order
        $order = DB::transaction(function () use ($validatedData) {
            // 💡 1. Masukkan kolom 'id' secara manual dengan generator UUID
            $newOrder = Order::create([
                'id'            => (string) Str::uuid(), 
                'customer_name' => $validatedData['nama'],
                'table_number'  => $validatedData['nomorMeja'],
                'notes'         => $validatedData['catatan'] ?? null,
                'total'         => $validatedData['total'],
                'status'        => 'pending',
            ]);

            // 2. Simpan ke OrderItem
            foreach ($validatedData['items'] as $item) {
                OrderItem::create([
                    'order_id'   => $newOrder->id,
                    'product_id' => $item['id'],
                    'name'       => $item['name'],
                    'price'      => $item['price'],
                    'qty'        => $item['qty'],
                ]);
            }

            // Kembalikan objek order agar bisa dibaca di luar closure DB::transaction
            return $newOrder;
        });

        try {
            event(new OrderCreated($order));
        } catch (\Throwable $e) { // 💡 Ganti \Exception menjadi \Throwable agar semua jenis error PHP tertangkap
            \Log::error("Gagal memicu event OrderCreated: " . $e->getMessage());
        }
        

        return response()->json([
            'success' => true,
            'message' => 'Pesanan berhasil dikirim ke dapur!',
            'order'   => $order // Objek ini yang dicari oleh response.data.order di React
        ]);
    }
    public function showActiveOrder(Request $request)
    {
        $orderId = $request->query('id');
        $order = null;

        if ($orderId) {
            // Ambil data order beserta item makanan di dalamnya
            $order = Order::with('items')->find($orderId);
        }

        return Inertia::render('Users/PesananAktif', [
            'order' => $order
        ]);
    }
}
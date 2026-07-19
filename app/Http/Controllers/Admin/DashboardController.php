<?php

namespace App\Http\Controllers\Admin;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();

        // 1. STAT CARDS UTAMA
        $totalOrdersToday = Order::whereDate('created_at', $today)->count();
        $revenueToday = Order::whereDate('created_at', $today)
            ->where('status', 'completed')
            ->sum('total');
        $pendingCount = Order::where('status', 'pending')->count();

        // 2. GRAFIK MINGGUAN (7 Hari Terakhir)
        $grafikRaw = Order::select(
            DB::raw("strftime('%w', created_at) as hari_angka"), // 0=Minggu, 1=Senin, dst.
            DB::raw('count(*) as total')
        )
        ->where('created_at', '>=', Carbon::now()->subDays(6)->startOfDay())
        ->groupBy('hari_angka')
        ->get()
        ->pluck('total', 'hari_angka')
        ->toArray();

        $namaHari = ['M', 'S', 'S', 'R', 'K', 'J', 'S'];
        $hariIniAngka = (int) Carbon::now()->format('w');

        $grafikMingguan = [];
        for ($i = 6; $i >= 0; $i--) {
            $targetDate = Carbon::now()->subDays($i);
            $w = (int) $targetDate->format('w');
            
            $grafikMingguan[] = [
                'hari'  => $namaHari[$w],
                'nilai' => $grafikRaw[$w] ?? 0,
                'aktif' => $w === $hariIniAngka // Papan hari ini akan otomatis menyala (highlight)
            ];
        }

        // 3. MENU POPULER (Berdasarkan Qty Terbanyak)
        $badgeColors = ['bg-matcha-500', 'bg-foam-500', 'bg-matcha-700', 'bg-matcha-300', 'bg-gray-400'];
        $menuPopulerRaw = OrderItem::select('name', DB::raw('sum(qty) as total_terjual'))
            ->groupBy('name')
            ->orderBy('total_terjual', 'desc')
            ->take(4)
            ->get();

        $menuPopuler = [];
        foreach ($menuPopulerRaw as $index => $item) {
            $menuPopuler[] = [
                'nama'    => $item->name,
                'terjual' => (int) $item->total_terjual,
                'warna'   => $badgeColors[$index] ?? 'bg-matcha-500'
            ];
        }

        // 4. AKTIVITAS TIM DAPUR (Pesanan Aktif yang Sedang Antre/Diproses)
        $dapurRaw = Order::with('items')
            ->whereIn('status', ['pending', 'processing'])
            ->latest()
            ->take(4)
            ->get();

        $timDapur = [];
        foreach ($dapurRaw as $ord) {
            $daftarMenu = $ord->items->map(fn($it) => "{$it->name} x{$it->qty}")->join(', ');
            $timDapur[] = [
                'nama'   => $ord->customer_name,
                'tugas'  => "Meja {$ord->table_number}: menyiapkan " . \Illuminate\Support\Str::limit($daftarMenu, 30),
                'status' => $ord->status === 'pending' ? 'Menunggu' : 'Diproses'
            ];
        }

        // 5. PESANAN TERBARU MASUK
        $latestOrders = Order::with('items')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('/dashboard', [
            'stats' => [
                'total_orders_today' => $totalOrdersToday,
                'revenue_today'      => (int) $revenueToday,
                'pending_count'      => $pendingCount
            ],
            'latestOrders'   => $latestOrders,
            'grafikMingguan' => $grafikMingguan,
            'menuPopuler'    => $menuPopuler,
            'timDapur'       => $timDapur
        ]);
    }
}
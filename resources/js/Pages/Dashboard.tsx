import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { ArrowUpRight, Plus, TrendingUp, Video } from 'lucide-react';

const statusBadge: Record<string, string> = {
    Menunggu: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
    Diproses: 'bg-foam-100 text-foam-700 dark:bg-foam-500/20 dark:text-foam-400',
    Selesai: 'bg-matcha-100 text-matcha-700 dark:bg-matcha-800 dark:text-matcha-200',
    Dibatalkan: 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400',
};

interface OrderItem {
    id: number;
    name: string;
    qty: number;
}

interface DBOrder {
    id: string;
    customer_name: string;
    total: number;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    created_at: string;
    items: OrderItem[];
}

interface DashboardProps {
    stats?: {
        total_orders_today: number;
        revenue_today: number;
        pending_count: number;
    };
    latestOrders?: DBOrder[];
    grafikMingguan?: Array<{ hari: string; nilai: number; aktif?: boolean }>;
    menuPopuler?: Array<{ nama: string; terjual: number; warna: string }>;
    timDapur?: Array<{ nama: string; tugas: string; status: string }>;
}

const formatRupiah = (angka: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

export default function Dashboard({ 
    stats, 
    latestOrders, 
    grafikMingguan = [], 
    menuPopuler = [], 
    timDapur = [] 
}: DashboardProps) {
    
    // Jaring Pengaman data dasar
    const totalOrdersToday = stats?.total_orders_today ?? 0;
    const revenueToday = stats?.revenue_today ?? 0;
    const pendingCount = stats?.pending_count ?? 0;
    const ordersList = latestOrders ?? [];

    const mapStatus = (status: string) => {
        if (status === 'pending') return 'Menunggu';
        if (status === 'processing') return 'Diproses';
        if (status === 'completed') return 'Selesai';
        return 'Dibatalkan';
    };

    const statCards = [
        {
            label: 'Total Pesanan Hari Ini',
            value: String(totalOrdersToday),
            trend: 'Live dari meja kasir',
            highlight: true,
        },
        { 
            label: 'Pendapatan Hari Ini', 
            value: formatRupiah(revenueToday), 
            trend: 'Berdasarkan pesanan selesai' 
        },
        { 
            label: 'Menu Aktif', 
            value: '12', 
            trend: '2 menu baru minggu ini' 
        },
        { 
            label: 'Pelanggan Terdaftar', 
            value: '156', 
            trend: '+14 pelanggan baru' 
        },
    ];

    const totalMingguan = grafikMingguan.reduce((s, d) => s + d.nilai, 0);
    const nilaiMax = Math.max(...grafikMingguan.map((d) => d.nilai), 1); // cegah pembagian dengan angka 0

    // Kalkulasi dinamis untuk Ring Progress Donut berdasarkan database asli
    const progressSelesai = totalOrdersToday > 0 ? Math.round((ordersList.filter(o => o.status === 'completed').length / totalOrdersToday) * 100) : 0;
    const radius = 60;
    const circumference = 2 * Math.PI * radius;

    return (
        <AdminLayout
            header={
                <div>
                    <h1 className="text-2xl font-bold text-matcha-900 dark:text-cream-50">
                        Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-matcha-500 dark:text-cream-400">
                        Pantau pesanan dan performa toko kamu hari ini
                    </p>
                </div>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="mx-auto max-w-7xl space-y-6">
                {/* Tombol Aksi Cepat */}
                <div className="flex flex-wrap justify-end gap-3">
                    <button className="rounded-full border border-matcha-200 px-4 py-2 text-sm font-semibold text-matcha-700 transition-colors hover:bg-matcha-50 dark:border-matcha-700 dark:text-cream-200 dark:hover:bg-matcha-800">
                        Ekspor Laporan
                    </button>
                    <button className="flex items-center gap-1.5 rounded-full bg-matcha-500 px-4 py-2 text-sm font-semibold text-cream-50 shadow-md shadow-matcha-500/30 transition-colors hover:bg-matcha-600">
                        <Plus size={15} />
                        Tambah Menu
                    </button>
                </div>

                {/* ============ STAT CARDS ============ */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((card) => (
                        <div
                            key={card.label}
                            className={`rounded-3xl p-6 shadow-sm transition-shadow hover:shadow-md ${
                                card.highlight
                                    ? 'bg-gradient-to-br from-matcha-600 to-matcha-800 text-cream-50 shadow-matcha-900/20'
                                    : 'bg-white text-matcha-900 dark:bg-matcha-900 dark:text-cream-50'
                            }`}
                        >
                            <div className="mb-4 flex items-start justify-between">
                                <p className={`text-sm ${card.highlight ? 'text-cream-100/80' : 'text-matcha-500 dark:text-cream-400'}`}>
                                    {card.label}
                                </p>
                                <span className={`flex h-7 w-7 items-center justify-center rounded-full ${card.highlight ? 'bg-white/15' : 'bg-matcha-50 dark:bg-matcha-800'}`}>
                                    <ArrowUpRight size={14} className={card.highlight ? 'text-cream-50' : 'text-matcha-500 dark:text-cream-300'} />
                                </span>
                            </div>
                            <p className="mb-3 text-3xl font-bold">{card.value}</p>
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${card.highlight ? 'bg-white/15 text-cream-50' : 'bg-matcha-50 text-matcha-600 dark:bg-matcha-800 dark:text-cream-300'}`}>
                                <TrendingUp size={11} />
                                {card.trend}
                            </span>
                        </div>
                    ))}
                </div>

                {/* ============ GRAFIK + PERLU KONFIRMASI + MENU POPULER ============ */}
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                    {/* Grafik Mingguan Asli */}
                    <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-matcha-900">
                        <h3 className="mb-1 text-base font-semibold text-matcha-900 dark:text-cream-50">
                            Grafik Pesanan Mingguan
                        </h3>
                        <p className="mb-6 text-xs text-matcha-400 dark:text-cream-500">
                            Total {totalMingguan} pesanan 7 hari terakhir
                        </p>
                        <div className="flex h-40 items-end justify-between gap-2">
                            {grafikMingguan.map((d, i) => (
                                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                                    <div className="relative flex h-32 w-full items-end justify-center">
                                        {d.nilai > 0 && (
                                            <span className="absolute -top-6 rounded-md bg-matcha-100 px-1.5 py-0.5 text-[10px] font-semibold text-matcha-700 dark:bg-matcha-800 dark:text-cream-200">
                                                {d.nilai}
                                            </span>
                                        )}
                                        <div
                                            style={{ height: `${(d.nilai / nilaiMax) * 100}%` }}
                                            className={`w-4/5 rounded-full transition-all duration-500 ${d.aktif ? 'bg-foam-500' : 'bg-matcha-100 dark:bg-matcha-800'}`}
                                        />
                                    </div>
                                    <span className="text-xs font-medium text-matcha-400 dark:text-cream-500">
                                        {d.hari}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Perlu Konfirmasi */}
                    <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-matcha-900">
                        <h3 className="mb-4 text-base font-semibold text-matcha-900 dark:text-cream-50">
                            Perlu Konfirmasi
                        </h3>
                        <div className="rounded-2xl bg-matcha-50 p-4 dark:bg-matcha-800">
                            <p className="mb-1 text-sm font-semibold text-matcha-900 dark:text-cream-50">
                                {pendingCount} pesanan menunggu konfirmasi
                            </p>
                            <p className="mb-4 text-xs text-matcha-500 dark:text-cream-400">
                                Pelanggan sudah memesan lewat meja, verifikasi untuk diproses dapur
                            </p>
                            <a href="/admin/pesanan" className="flex w-full items-center justify-center gap-2 rounded-xl bg-matcha-500 py-2.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-matcha-600">
                                <Video size={14} />
                                Konfirmasi Sekarang
                            </a>
                        </div>
                    </div>

                    {/* Menu Populer Asli */}
                    <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-matcha-900">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-base font-semibold text-matcha-900 dark:text-cream-50">
                                Menu Populer
                            </h3>
                        </div>
                        {menuPopuler.length === 0 ? (
                            <p className="text-xs text-matcha-400 text-center py-8">Belum ada data penjualan menu.</p>
                        ) : (
                            <ul className="space-y-3">
                                {menuPopuler.map((m) => (
                                    <li key={m.nama} className="flex items-center gap-3">
                                        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${m.warna}`} />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-matcha-900 dark:text-cream-50">
                                                {m.nama}
                                            </p>
                                        </div>
                                        <span className="shrink-0 text-xs text-matcha-400 dark:text-cream-500">
                                            {m.terjual} terjual
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* ============ TIM DAPUR + PROGRESS + PENDAPATAN LIVE ============ */}
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                    {/* Aktivitas Dapur Asli */}
                    <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-matcha-900 lg:col-span-1">
                        <h3 className="mb-4 text-base font-semibold text-matcha-900 dark:text-cream-50">
                            Aktivitas Antrean Dapur
                        </h3>
                        {timDapur.length === 0 ? (
                            <p className="text-xs text-matcha-400 text-center py-8">Dapur sedang santai, antrean kosong.</p>
                        ) : (
                            <ul className="space-y-4">
                                {timDapur.map((t, index) => (
                                    <li key={index} className="flex items-center gap-3">
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-matcha-100 text-xs font-semibold text-matcha-700 dark:bg-matcha-800 dark:text-cream-100">
                                            {t.nama.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-matcha-900 dark:text-cream-50">
                                                {t.nama}
                                            </p>
                                            <p className="truncate text-xs text-matcha-400 dark:text-cream-500">
                                                {t.tugas}
                                            </p>
                                        </div>
                                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${statusBadge[t.status]}`}>
                                            {t.status}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Progress Donut Asli */}
                    <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-matcha-900">
                        <h3 className="mb-4 text-base font-semibold text-matcha-900 dark:text-cream-50">
                            Progress Pesanan Hari Ini
                        </h3>
                        <div className="flex flex-col items-center">
                            <div className="relative">
                                <svg width="150" height="150" viewBox="0 0 150 150">
                                    <circle
                                        cx="75" cy="75" r={radius}
                                        className="fill-none stroke-matcha-100 dark:stroke-matcha-800"
                                        strokeWidth="14"
                                    />
                                    <circle
                                        cx="75" cy="75" r={radius}
                                        className="fill-none stroke-matcha-500"
                                        strokeWidth="14"
                                        strokeLinecap="round"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={circumference * (1 - progressSelesai / 100)}
                                        transform="rotate(-90 75 75)"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-bold text-matcha-900 dark:text-cream-50">
                                        {progressSelesai}%
                                    </span>
                                    <span className="text-xs text-matcha-400 dark:text-cream-500">Selesai</span>
                                </div>
                            </div>
                            <div className="mt-5 flex w-full justify-center gap-4 text-xs">
                                <span className="flex items-center gap-1.5 text-matcha-600 dark:text-cream-300">
                                    <span className="h-2 w-2 rounded-full bg-matcha-500" /> Selesai
                                </span>
                                <span className="flex items-center gap-1.5 text-matcha-600 dark:text-cream-300">
                                    <span className="h-2 w-2 rounded-full bg-matcha-100 dark:bg-matcha-700" /> Antre/Proses
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Pendapatan Live Gradasi */}
                    <div className="flex flex-col justify-between rounded-3xl bg-gradient-to-br from-matcha-800 to-matcha-950 p-6 text-cream-50 shadow-lg shadow-matcha-900/30">
                        <h3 className="text-base font-semibold">Pendapatan Hari Ini</h3>
                        <div>
                            <p className="text-4xl font-bold tracking-tight">{formatRupiah(revenueToday)}</p>
                            <p className="mt-1 text-sm text-cream-100/70">dari {totalOrdersToday} pesanan masuk</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 animate-pulse rounded-full bg-foam-400" />
                            <span className="text-xs text-cream-100/80">Update otomatis tiap ada pesanan baru</span>
                        </div>
                    </div>
                </div>

                {/* ============ TABEL PESANAN TERBARU MASUK ============ */}
                <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-matcha-900">
                    <div className="mb-5 flex items-center justify-between">
                        <h3 className="text-base font-semibold text-matcha-900 dark:text-cream-50">
                            Pesanan Terbaru Masuk
                        </h3>
                        <a href="/admin/pesanan" className="text-sm font-medium text-matcha-600 hover:text-matcha-500 dark:text-foam-400">
                            Lihat semua →
                        </a>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-matcha-100 dark:border-matcha-800">
                                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-matcha-400 dark:text-cream-500">ID</th>
                                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-matcha-400 dark:text-cream-500">Pelanggan</th>
                                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-matcha-400 dark:text-cream-500">Menu</th>
                                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-matcha-400 dark:text-cream-500">Total</th>
                                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-matcha-400 dark:text-cream-500">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-matcha-50 dark:divide-matcha-800">
                                {ordersList.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-6 text-sm text-matcha-400">Belum ada pesanan masuk hari ini.</td>
                                    </tr>
                                ) : (
                                    ordersList.map((p) => {
                                        const uiStatus = mapStatus(p.status);
                                        return (
                                            <tr key={p.id} className="transition-colors hover:bg-matcha-50/60 dark:hover:bg-matcha-800/40">
                                                <td className="px-3 py-3.5 text-sm font-medium text-matcha-900 dark:text-cream-50">
                                                    #{p.id ? p.id.substring(0, 6) : '------'}
                                                </td>
                                                <td className="px-3 py-3.5 text-sm text-matcha-700 dark:text-cream-200">{p.customer_name}</td>
                                                <td className="px-3 py-3.5 text-sm text-matcha-500 dark:text-cream-400 max-w-xs truncate">
                                                    {p.items?.map(item => `${item.name} x${item.qty}`).join(', ') ?? '-'}
                                                </td>
                                                <td className="px-3 py-3.5 text-sm font-semibold text-matcha-900 dark:text-cream-50">{formatRupiah(p.total)}</td>
                                                <td className="px-3 py-3.5">
                                                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusBadge[uiStatus]}`}>
                                                        {uiStatus}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
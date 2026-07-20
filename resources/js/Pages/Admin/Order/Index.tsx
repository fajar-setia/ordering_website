import { Head, router } from "@inertiajs/react";

import AdminLayout from "@/Layouts/AdminLayout";
import {
    CheckCircle2,
    ChefHat,
    XCircle,
    User,
    Hash,
    FileText,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useEffect } from "react";

interface OrderItem {
    id: number;
    name: string;
    price: number;
    qty: number;
}

interface Order {
    id: string;
    customer_name: string;
    table_number: string;
    notes: string | null;
    total: number;
    status: "pending" | "processing" | "completed" | "cancelled";
    created_at: string;
    items: OrderItem[];
}

interface OrdersProps {
    orders: any;
}

const formatRupiah = (angka: number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(angka);

export default function Index({ orders }: OrdersProps) {
    // Jaring pengaman pagination
    const ordersList: Order[] =
        orders?.data ?? (Array.isArray(orders) ? orders : []);

    // 💡 2. FITUR WEBSOCKET REAL-TIME + ALERTS TOAST DI SINI
    useEffect(() => {
        if (typeof window !== "undefined" && (window as any).Echo) {
            (window as any).Echo.channel("dapur-channel")
                // 💡 PERBAIKAN: Tambahkan titik (.) sebelum nama event kustom
                .listen(".OrderCreated", (e: any) => {
                    // e.order berisi payload order asli yang dikirim dari Solusi 1 Event kemarin
                    const customer = e.order?.customer_name ?? "Pelanggan";
                    const table = e.order?.table_number ?? "?";

                    // Bunyikan efek suara notifikasi bawaan browser
                    try {
                        const audio = new Audio(
                            "https://assets.mixkit.co/active_storage/sfx/2869/2869-600.wav",
                        );
                        audio.volume = 0.5;
                        audio.play()
                    } catch (err) {
                        console.log("Audio tidak didukung oleh browser ini.");
                    }

                    // Tampilkan notifikasi toast hijau yang cantik
                    toast.success(
                        `🔔 Pesanan Baru! Meja ${table} atas nama ${customer} masuk antrean.`,
                        {
                            duration: 6000,
                            position: "top-right",
                            style: {
                                background: "#1c2e24",
                                color: "#fcfbf7",
                                borderRadius: "1rem",
                                fontWeight: "600",
                            },
                        },
                    );

                    // Segarkan list kartu pesanan dapur secara diam-diam di background
                    router.reload({
                        onSuccess: (page) => {
                            console.log(
                                "Visual berhasil diperbarui dengan data terbaru!",
                                page.props,
                            );
                        },
                    });
                });
        }

        // Putus koneksi channel saat admin meninggalkan halaman pesanan dapur agar hemat RAM
        return () => {
            if (typeof window !== "undefined" && (window as any).Echo) {
                (window as any).Echo.leaveChannel("dapur-channel");
            }
        };
    }, []);

    // Fungsi untuk memperbarui status pesanan ke backend
    const updateStatus = (id: string, newStatus: string) => {
        router.patch(
            `/admin/orders/${id}/status`,
            {
                status: newStatus,
            },
            {
                preserveScroll: true,
                onSuccess: () =>
                    toast.success(
                        `Pesanan berhasil diperbarui ke: ${newStatus}`,
                    ),
                onError: () => toast.error("Gagal memperbarui status pesanan."),
            },
        );
    };

    // Helper untuk styling badge status
    const getStatusStyle = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900";
            case "processing":
                return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900";
            case "completed":
                return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900";
            default:
                return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900";
        }
    };

    return (
        <AdminLayout>
            <Head title="Pesanan Dapur" />

            <div className="flex flex-col gap-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-matcha-900 dark:text-cream-50">
                        Daftar Pesanan Dapur
                    </h1>
                    <p className="text-sm text-matcha-600 dark:text-cream-300">
                        Pantau dan proses semua pesanan pelanggan secara
                        real-time.
                    </p>
                </div>

                {/* Grid Pesanan */}
                {ordersList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 text-center shadow-sm dark:bg-matcha-900 border border-matcha-100 dark:border-matcha-800">
                        <ChefHat
                            size={48}
                            className="text-matcha-300 animate-pulse mb-3"
                        />
                        <p className="text-matcha-500 font-medium">
                            Belum ada pesanan masuk saat ini.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ordersList.map((order) => (
                            <div
                                key={order.id}
                                className="flex flex-col justify-between rounded-2xl bg-white p-5 shadow-sm border border-matcha-100 dark:bg-matcha-900 dark:border-matcha-800 hover:shadow-md transition-shadow relative overflow-hidden"
                            >
                                {/* Garis indikator status */}
                                <div
                                    className={`absolute top-0 inset-x-0 h-1.5 ${
                                        order.status === "pending"
                                            ? "bg-amber-400"
                                            : order.status === "processing"
                                              ? "bg-blue-500"
                                              : order.status === "completed"
                                                ? "bg-emerald-500"
                                                : "bg-rose-500"
                                    }`}
                                />

                                <div>
                                    {/* Meta Pesanan */}
                                    <div className="flex items-center justify-between mb-4 mt-1">
                                        <div className="flex items-center gap-2 rounded-xl bg-matcha-50 px-3 py-1.5 dark:bg-matcha-950 border border-matcha-100 dark:border-matcha-800">
                                            <Hash
                                                size={14}
                                                className="text-matcha-500"
                                            />
                                            <span className="text-sm font-bold text-matcha-800 dark:text-cream-100">
                                                Meja {order.table_number}
                                            </span>
                                        </div>
                                        <span
                                            className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${getStatusStyle(order.status)}`}
                                        >
                                            {order.status}
                                        </span>
                                    </div>

                                    {/* Info Pelanggan */}
                                    <div className="flex items-center gap-2 text-sm text-matcha-700 dark:text-cream-200 mb-3">
                                        <User
                                            size={16}
                                            className="text-matcha-400 shrink-0"
                                        />
                                        <span className="font-semibold">
                                            {order.customer_name}
                                        </span>
                                    </div>

                                    <hr className="border-matcha-100 dark:border-matcha-800 my-3" />

                                    {/* List Item Menu */}
                                    <div className="space-y-2 my-3">
                                        {order.items?.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex justify-between items-start text-sm"
                                            >
                                                <span className="text-matcha-600 dark:text-cream-300 flex-1 pr-2">
                                                    {item.name}{" "}
                                                    <strong className="text-matcha-800 dark:text-foam-400 ml-1">
                                                        x{item.qty}
                                                    </strong>
                                                </span>
                                                <span className="font-medium text-matcha-700 dark:text-cream-200">
                                                    {formatRupiah(
                                                        item.price * item.qty,
                                                    )}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Catatan Pelanggan */}
                                    {order.notes && (
                                        <div className="mt-3 flex gap-2 rounded-xl bg-cream-50 p-2.5 text-xs text-matcha-700 border border-matcha-100 dark:bg-matcha-800/40 dark:text-cream-300 dark:border-matcha-800">
                                            <FileText
                                                size={14}
                                                className="text-matcha-400 shrink-0 mt-0.5"
                                            />
                                            <p className="italic">
                                                "{order.notes}"
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <hr className="border-matcha-100 dark:border-matcha-800 my-4" />

                                    {/* Total Harga */}
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-xs font-medium text-matcha-500">
                                            Total Pembayaran
                                        </span>
                                        <span className="text-base font-bold text-matcha-900 dark:text-foam-400">
                                            {formatRupiah(order.total)}
                                        </span>
                                    </div>

                                    {/* Tombol Aksi */}
                                    <div className="flex gap-2">
                                        {order.status === "pending" && (
                                            <button
                                                onClick={() =>
                                                    updateStatus(
                                                        order.id,
                                                        "processing",
                                                    )
                                                }
                                                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:bg-blue-700 active:scale-95"
                                            >
                                                <ChefHat size={14} />
                                                Proses Masak
                                            </button>
                                        )}

                                        {order.status === "processing" && (
                                            <button
                                                onClick={() =>
                                                    updateStatus(
                                                        order.id,
                                                        "completed",
                                                    )
                                                }
                                                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-matcha-500 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:bg-matcha-600 active:scale-95"
                                            >
                                                <CheckCircle2 size={14} />
                                                Selesai / Sajikan
                                            </button>
                                        )}

                                        {(order.status === "pending" ||
                                            order.status === "processing") && (
                                            <button
                                                onClick={() => {
                                                    if (
                                                        confirm(
                                                            "Batalkan pesanan ini?",
                                                        )
                                                    )
                                                        updateStatus(
                                                            order.id,
                                                            "cancelled",
                                                        );
                                                }}
                                                className="rounded-xl border border-rose-200 px-3 py-2.5 text-rose-500 hover:bg-rose-50 dark:border-rose-900 dark:hover:bg-rose-950/20"
                                                title="Batalkan Pesanan"
                                            >
                                                <XCircle size={14} />
                                            </button>
                                        )}

                                        {order.status === "completed" && (
                                            <div className="flex-1 text-center text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900">
                                                ✓ Sudah Disajikan
                                            </div>
                                        )}

                                        {order.status === "cancelled" && (
                                            <div className="flex-1 text-center text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/20 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900">
                                                ✕ Dibatalkan
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

import { useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import {
    Clock,
    ChefHat,
    CheckCircle,
    ShoppingBag,
    ArrowLeft,
    RotateCw,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

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
    items: OrderItem[];
}

interface Props {
    order: Order | null;
}

const formatRupiah = (angka: number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(angka);

export default function PesananAktif({ order }: Props) {
    // 💡 1. OTOMATIS REDIRECT JIKA URL TIDAK MEMBAWA ID PESANAN
    useEffect(() => {
        const savedOrderId = localStorage.getItem("active_order_id");
        const urlParams = new URLSearchParams(window.location.search);

        if (savedOrderId && urlParams.get("id") !== savedOrderId) {
            router.get(
                `/pesanan?id=${savedOrderId}`,
                {},
                { preserveState: true },
            );
        }
    }, []);

    // 💡 2. POLLING DATA SETIAP 30 DETIK (Hemat Beban Server)
    useEffect(() => {
        const savedOrderId = localStorage.getItem("active_order_id");
        if (!savedOrderId) return;

        const interval = setInterval(() => {
            router.reload({ only: ["order"] });
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    // 💡 3. BERSIHKAN LOKAL STORAGE JIKA SUDAH SELESAI
    useEffect(() => {
        if (order?.status === "completed" || order?.status === "cancelled") {
            const timer = setTimeout(() => {
                localStorage.removeItem("active_order_id");
                window.dispatchEvent(new Event("local-storage-update"));
            }, 300000); // 5 Menit
            return () => clearTimeout(timer);
        }
    }, [order?.status]);

    return (
        // 💡 Hapus properti header dari AuthenticatedLayout agar garis abu-abu di atas hilang total
        <AuthenticatedLayout>
            <Head title="Pelacakan Pesanan" />

            {/* 💡 Berikan padding top (pt-28) agar konten turun ke bawah, memberikan ruang untuk Navbar melayang */}
            <div className="mx-auto max-w-2xl px-4 pt-10 pb-12 sm:px-6 lg:px-8 space-y-6 animate-fade-in">
                {!order ? (
                    /* ❌ JIKA TIDAK ADA PESANAN AKTIF */
                    <div className="rounded-2xl bg-white p-8 text-center shadow-xl dark:bg-matcha-900 border border-matcha-100 dark:border-matcha-800">
                        <ShoppingBag
                            size={48}
                            className="mx-auto text-matcha-300 mb-4 animate-pulse"
                        />
                        <h2 className="text-lg font-bold">
                            Tidak Ada Pesanan Aktif
                        </h2>
                        <p className="text-sm text-matcha-600 dark:text-cream-300 mt-1 mb-6">
                            Kamu belum membuat pesanan atau sesi pesananmu telah
                            selesai.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-xl bg-matcha-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-matcha-600 transition-colors shadow-sm"
                        >
                            <ArrowLeft size={16} /> Kembali ke Menu
                        </Link>
                    </div>
                ) : (
                    /* 🎉 JIKA DATA STRUK & STATUS DITEMUKAN */
                    <>
                        {/* 💡 JUDUL SEKARANG DI SINI: Menyatu rapi dengan alur konten di bawah navbar */}
                        <div className="flex flex-col gap-1 px-1">
                            <h2 className="text-2xl font-black tracking-tight text-matcha-900 dark:text-cream-50">
                                Pelacakan Pesanan Aktif
                            </h2>
                            <p className="text-xs text-matcha-500 dark:text-matcha-400 font-mono">
                                ID: #{order.id}
                            </p>
                        </div>

                        {/* Banner Status Dapur Modern */}
                        {/* 💡 STEPPER UI */}
                        <div className="bg-white dark:bg-matcha-900 rounded-2xl p-6 border border-matcha-100 dark:border-matcha-800 shadow-sm">
                            <div className="flex justify-between items-center relative">
                                {/* Garis Penghubung */}
                                <div className="absolute top-4 left-6 right-6 h-0.5 bg-matcha-100 dark:bg-matcha-800 z-0" />

                                {[
                                    { label: "Diterima", status: "pending" },
                                    { label: "Diracik", status: "processing" },
                                    { label: "Siap!", status: "completed" },
                                ].map((step, index) => {
                                    const isActive =
                                        (order.status === "pending" &&
                                            step.status === "pending") ||
                                        (order.status === "processing" &&
                                            (step.status === "pending" ||
                                                step.status ===
                                                    "processing")) ||
                                        (order.status === "completed" && true);

                                    const isCompleted =
                                        (order.status === "processing" &&
                                            step.status === "pending") ||
                                        (order.status === "completed" &&
                                            (step.status === "pending" ||
                                                step.status === "processing"));

                                    return (
                                        <div
                                            key={step.label}
                                            className="relative z-10 flex flex-col items-center gap-2"
                                        >
                                            <div
                                                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500
                                                  ${
                                                      isActive
                                                          ? "bg-matcha-500 text-white shadow-lg shadow-matcha-500/30 scale-110"
                                                          : isCompleted
                                                            ? "bg-emerald-500 text-white"
                                                            : "bg-matcha-100 dark:bg-matcha-800 text-matcha-400"
                                                  }
                                              `}
                                            >
                                                {isActive &&
                                                order.status === "pending" &&
                                                step.status === "pending" ? (
                                                    <Clock
                                                        size={18}
                                                        className="animate-pulse"
                                                    />
                                                ) : isActive &&
                                                  order.status ===
                                                      "processing" &&
                                                  step.status ===
                                                      "processing" ? (
                                                    <ChefHat
                                                        size={18}
                                                        className="animate-bounce"
                                                    />
                                                ) : (
                                                    <CheckCircle size={18} />
                                                )}
                                            </div>
                                            <span
                                                className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? "text-matcha-700 dark:text-matcha-300" : "text-matcha-400"}`}
                                            >
                                                {step.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Pesan status di bawah stepper */}
                            <div className="mt-6 text-center">
                                <p
                                    className={`text-sm font-semibold px-4 py-2 rounded-full inline-block ${
                                        order.status === "pending"
                                            ? "bg-amber-50 text-amber-700"
                                            : order.status === "processing"
                                              ? "bg-blue-50 text-blue-700"
                                              : order.status === "completed"
                                                ? "bg-emerald-50 text-emerald-700"
                                                : "bg-rose-50 text-rose-700"
                                    }`}
                                >
                                    {order.status === "pending" &&
                                        "Dapur sedang menyiapkan pesananmu..."}
                                    {order.status === "processing" &&
                                        "Barista sedang meracik minuman spesialmu!"}
                                    {order.status === "completed" &&
                                        "Pesanan selesai! Silakan ambil di konter."}
                                    {order.status === "cancelled" &&
                                        "Mohon maaf, pesanan dibatalkan."}
                                </p>
                            </div>
                        </div>

                        {/* Rincian Nota Makanan */}
                        <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-matcha-900 border border-matcha-100 dark:border-matcha-800 space-y-4">
                            <div className="flex justify-between text-sm border-b border-matcha-100 dark:border-matcha-800 pb-4 items-center">
                                <div>
                                    <span className="block text-xs text-matcha-400 mb-0.5">
                                        Nama Pembeli
                                    </span>
                                    <span className="dark:text-cream-50 font-bold text-base">
                                        {order.customer_name}
                                    </span>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                    <span className="block text-xs text-matcha-400 mb-0.5">
                                        Posisi Duduk
                                    </span>
                                    <span className="font-bold text-sm bg-matcha-50 dark:bg-matcha-950 px-2.5 py-0.5 rounded-md text-matcha-600 dark:text-foam-400">
                                        Meja {order.table_number}
                                    </span>
                                </div>
                            </div>

                            {/* Indikator Pemuatan / Auto Update */}
                            <div className="flex justify-between items-center text-xs text-matcha-500 dark:text-matcha-400 py-1">
                                <span>Daftar Menu</span>
                                <span className="flex items-center gap-1.5 font-mono text-[11px] bg-cream-50 dark:bg-matcha-950 px-2 py-0.5 rounded border border-matcha-100 dark:border-matcha-800">
                                    <RotateCw
                                        size={10}
                                        className="animate-spin text-matcha-500"
                                    />{" "}
                                    Auto-update
                                </span>
                            </div>

                            {/* Daftar Menu */}
                            <div className="divide-y divide-matcha-100/50 dark:divide-matcha-800/50">
                                {order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between items-center py-3.5 text-sm"
                                    >
                                        <div className="space-y-0.5">
                                            <p className="font-semibold text-matcha-900 dark:text-cream-50">
                                                {item.name}
                                            </p>
                                            <span className="text-xs text-matcha-500 dark:text-matcha-400">
                                                {formatRupiah(item.price)}{" "}
                                                <span className="mx-1">×</span>{" "}
                                                {item.qty}
                                            </span>
                                        </div>
                                        <span className="font-bold text-matcha-800 dark:text-cream-100">
                                            {formatRupiah(
                                                item.price * item.qty,
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Catatan Pelanggan */}
                            {order.notes && (
                                <div className="rounded-xl bg-cream-50/50 p-3.5 text-xs text-matcha-600 border border-matcha-100/70 dark:bg-matcha-950/40 dark:border-matcha-800 dark:text-cream-300">
                                    <span className="font-semibold block mb-0.5">
                                        Catatan Dapur:
                                    </span>
                                    <span className="italic">
                                        "{order.notes}"
                                    </span>
                                </div>
                            )}

                            {/* Total Akhir */}
                            <div className="border-t border-matcha-100 dark:border-matcha-800 pt-4 flex justify-between items-center">
                                <span className="text-sm font-semibold text-matcha-500">
                                    Total Pembayaran
                                </span>
                                <span className="text-2xl font-black text-matcha-900 dark:text-foam-400 tracking-tight">
                                    {formatRupiah(order.total)}
                                </span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

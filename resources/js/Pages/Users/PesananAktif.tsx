import { useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Clock,
    ChefHat,
    CheckCircle,
    ShoppingBag,
    ArrowLeft,
    RotateCw,
    XCircle,
    Receipt,
    MapPin,
    User,
    Coffee,
    Sparkles,
    Timer,
    Flame,
    PackageCheck,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { toast } from "react-hot-toast";

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

    useEffect(() => {
        const activeOrderId =
            order?.id || localStorage.getItem("active_order_id");

        if (!activeOrderId) return;

        if (typeof window !== "undefined" && (window as any).Echo) {
            (window as any).Echo.channel(`order.${activeOrderId}`).listen(
                ".OrderStatusUpdated",
                (e: any) => {
                    console.log("🔥 Sinyal status update diterima:", e);

                    if (e.order?.status === "processing") {
                        toast.success("🍳 Pesananmu sedang dimasak oleh koki!");
                    } else if (e.order?.status === "completed") {
                        toast.success(
                            "🎉 Pesananmu sudah selesai dan siap disajikan!",
                        );
                    } else if (e.order?.status === "cancelled") {
                        toast.error("❌ Mohon maaf, pesananmu dibatalkan.");
                    }

                    router.reload();
                },
            );
        }

        return () => {
            if (typeof window !== "undefined" && (window as any).Echo) {
                (window as any).Echo.leaveChannel(`order.${activeOrderId}`);
            }
        };
    }, [order?.id]);

    useEffect(() => {
        if (order?.status === "completed" || order?.status === "cancelled") {
            const timer = setTimeout(() => {
                localStorage.removeItem("active_order_id");
                window.dispatchEvent(new Event("local-storage-update"));
            }, 300000);
            return () => clearTimeout(timer);
        }
    }, [order?.status]);

    const progresPersen =
        order?.status === "pending"
            ? 33
            : order?.status === "processing"
              ? 66
              : order?.status === "completed"
                ? 100
                : 0;

    const statusConfig = {
        pending: {
            icon: Timer,
            color: "amber",
            bg: "bg-amber-50 dark:bg-amber-500/10",
            text: "text-amber-700 dark:text-amber-400",
            border: "border-amber-200 dark:border-amber-500/20",
            label: "Diterima",
            message: "Dapur sedang menyiapkan pesananmu...",
            pulse: true,
        },
        processing: {
            icon: Flame,
            color: "blue",
            bg: "bg-blue-50 dark:bg-blue-500/10",
            text: "text-blue-700 dark:text-blue-400",
            border: "border-blue-200 dark:border-blue-500/20",
            label: "Diracik",
            message: "Barista sedang meracik minuman spesialmu!",
            pulse: true,
        },
        completed: {
            icon: PackageCheck,
            color: "emerald",
            bg: "bg-emerald-50 dark:bg-emerald-500/10",
            text: "text-emerald-700 dark:text-emerald-400",
            border: "border-emerald-200 dark:border-emerald-500/20",
            label: "Siap!",
            message: "Pesanan selesai! Silakan ambil di konter.",
            pulse: false,
        },
        cancelled: {
            icon: XCircle,
            color: "rose",
            bg: "bg-rose-50 dark:bg-rose-500/10",
            text: "text-rose-700 dark:text-rose-400",
            border: "border-rose-200 dark:border-rose-500/20",
            label: "Dibatalkan",
            message: "Mohon maaf, pesanan dibatalkan.",
            pulse: false,
        },
    };

    const steps = [
        { label: "Diterima", status: "pending", icon: Clock },
        { label: "Diracik", status: "processing", icon: ChefHat },
        { label: "Siap!", status: "completed", icon: CheckCircle },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Pelacakan Pesanan" />

            <div className="relative min-h-screen bg-gradient-to-br from-cream-50 via-white to-matcha-50/30 dark:from-matcha-950 dark:via-matcha-900 dark:to-matcha-950">
                {/* Background Decorations */}
                <div className="pointer-events-none fixed inset-0 overflow-hidden">
                    <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-matcha-200/20 blur-3xl dark:bg-matcha-700/10" />
                    <div className="absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-foam-300/20 blur-3xl dark:bg-matcha-800/10" />
                    <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-matcha-100/30 blur-3xl dark:bg-matcha-800/5" />
                </div>

                <div className="relative mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 flex items-center justify-between"
                    >
                        <Link
                            href="/"
                            className="group flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-matcha-700 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-md dark:bg-matcha-800/50 dark:text-cream-200 dark:hover:bg-matcha-800"
                        >
                            <ArrowLeft
                                size={16}
                                className="transition-transform group-hover:-translate-x-1"
                            />
                            Kembali
                        </Link>

                        {order && (
                            <div className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm dark:bg-matcha-800/50">
                                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                                <span className="text-xs font-semibold text-matcha-600 dark:text-cream-300">
                                    Live Tracking
                                </span>
                            </div>
                        )}
                    </motion.div>

                    {!order ? (
                        /* Empty State */
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                            className="flex min-h-[60vh] flex-col items-center justify-center"
                        >
                            <div className="relative mb-8">
                                <div className="absolute inset-0 animate-ping rounded-full bg-matcha-200/40 dark:bg-matcha-700/20" />
                                <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-matcha-100 to-matcha-50 shadow-xl dark:from-matcha-800 dark:to-matcha-900">
                                    <ShoppingBag
                                        size={48}
                                        className="text-matcha-400 dark:text-cream-400"
                                    />
                                </div>
                            </div>

                            <h2 className="mb-3 text-3xl font-black text-matcha-900 dark:text-cream-50">
                                Belum Ada Pesanan
                            </h2>
                            <p className="mb-8 max-w-md text-center text-matcha-500 dark:text-cream-400">
                                Kamu belum membuat pesanan. Yuk, jelajahi menu
                                kami dan buat pesanan pertamamu!
                            </p>

                            <Link
                                href="/"
                                className="group inline-flex items-center gap-3 rounded-full bg-matcha-500 px-8 py-4 text-base font-bold text-cream-50 shadow-xl shadow-matcha-500/30 transition-all hover:-translate-y-1 hover:bg-matcha-600 hover:shadow-2xl"
                            >
                                <Sparkles size={20} />
                                Lihat Menu
                                <ArrowLeft
                                    size={18}
                                    className="rotate-180 transition-transform group-hover:translate-x-1"
                                />
                            </Link>
                        </motion.div>
                    ) : (
                        /* Active Order */
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                        >
                            {/* Order Info Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="overflow-hidden rounded-3xl border border-matcha-100 bg-white/80 shadow-xl backdrop-blur-xl dark:border-matcha-800 dark:bg-matcha-900/80"
                            >
                                <div className="relative bg-gradient-to-r from-matcha-500 to-matcha-600 px-6 py-6 dark:from-matcha-700 dark:to-matcha-800">
                                    <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-white/5 to-transparent" />
                                    <div className="relative flex items-start justify-between">
                                        <div>
                                            <p className="text-xs font-medium text-matcha-100">
                                                Nomor Pesanan
                                            </p>
                                            <h1 className="mt-1 font-mono text-3xl font-black text-white">
                                                #{order.id}
                                            </h1>
                                        </div>
                                        <div
                                            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${statusConfig[order.status].bg} ${statusConfig[order.status].text}`}
                                        >
                                            {(() => {
                                                const Icon =
                                                    statusConfig[order.status]
                                                        .icon;
                                                return (
                                                    <Icon
                                                        size={18}
                                                        className={
                                                            statusConfig[
                                                                order.status
                                                            ].pulse
                                                                ? "animate-pulse"
                                                                : ""
                                                        }
                                                    />
                                                );
                                            })()}
                                            {statusConfig[order.status].label}
                                        </div>
                                    </div>

                                    <div className="mt-6 grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                                                <User
                                                    size={18}
                                                    className="text-white"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-xs text-matcha-100">
                                                    Pelanggan
                                                </p>
                                                <p className="font-semibold text-white">
                                                    {order.customer_name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                                                <MapPin
                                                    size={18}
                                                    className="text-white"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-xs text-matcha-100">
                                                    Meja
                                                </p>
                                                <p className="font-semibold text-white">
                                                    {order.table_number}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Stepper */}
                                <div className="px-6 py-8">
                                    <div className="relative flex items-center justify-between">
                                        {/* Background Line */}
                                        <div className="absolute left-8 right-8 top-5 h-1 rounded-full bg-matcha-100 dark:bg-matcha-800" />
                                        {/* Active Line */}
                                        <motion.div
                                            className="absolute left-8 top-5 h-1 rounded-full bg-matcha-500"
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: `calc((100% - 4rem) * ${progresPersen / 100})`,
                                            }}
                                            transition={{
                                                duration: 1,
                                                ease: "easeInOut",
                                            }}
                                        />

                                        {steps.map((step, index) => {
                                            const isCompleted =
                                                (order.status ===
                                                    "processing" &&
                                                    step.status ===
                                                        "pending") ||
                                                (order.status ===
                                                    "completed" &&
                                                    (step.status ===
                                                        "pending" ||
                                                        step.status ===
                                                            "processing"));
                                            const isActive =
                                                order.status === step.status;

                                            return (
                                                <div
                                                    key={step.label}
                                                    className="relative z-10 flex flex-col items-center gap-3"
                                                >
                                                    <motion.div
                                                        animate={
                                                            isActive
                                                                ? {
                                                                      scale: [
                                                                          1,
                                                                          1.15,
                                                                          1,
                                                                      ],
                                                                  }
                                                                : {}
                                                        }
                                                        transition={{
                                                            repeat: Infinity,
                                                            duration: 2,
                                                        }}
                                                        className={`flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-all duration-500 ${
                                                            isActive
                                                                ? "bg-matcha-500 text-white shadow-matcha-500/30"
                                                                : isCompleted
                                                                  ? "bg-emerald-500 text-white shadow-emerald-500/20"
                                                                  : "bg-matcha-100 text-matcha-400 dark:bg-matcha-800 dark:text-cream-600"
                                                        }`}
                                                    >
                                                        <step.icon size={20} />
                                                    </motion.div>
                                                    <span
                                                        className={`text-xs font-bold uppercase tracking-wider ${
                                                            isActive ||
                                                            isCompleted
                                                                ? "text-matcha-700 dark:text-cream-100"
                                                                : "text-matcha-400 dark:text-cream-600"
                                                        }`}
                                                    >
                                                        {step.label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Status Message */}
                                    <div className="mt-8">
                                        <div
                                            className={`flex items-center gap-3 rounded-2xl border p-4 ${statusConfig[order.status].bg} ${statusConfig[order.status].border} ${statusConfig[order.status].text}`}
                                        >
                                            {(() => {
                                                const Icon =
                                                    statusConfig[order.status]
                                                        .icon;
                                                return (
                                                    <div
                                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${statusConfig[order.status].bg}`}
                                                    >
                                                        <Icon
                                                            size={20}
                                                            className={
                                                                statusConfig[
                                                                    order.status
                                                                ].pulse
                                                                    ? "animate-bounce"
                                                                    : ""
                                                            }
                                                        />
                                                    </div>
                                                );
                                            })()}
                                            <div>
                                                <p className="text-sm font-bold">
                                                    {
                                                        statusConfig[
                                                            order.status
                                                        ].message
                                                    }
                                                </p>
                                                {order.status ===
                                                    "processing" && (
                                                    <p className="mt-0.5 text-xs opacity-70">
                                                        Estimasi: 5-10 menit
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Receipt Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="overflow-hidden rounded-3xl border border-matcha-100 bg-white/80 shadow-xl backdrop-blur-xl dark:border-matcha-800 dark:bg-matcha-900/80"
                            >
                                {/* Receipt Header */}
                                <div className="flex items-center gap-3 border-b border-dashed border-matcha-200 px-6 py-4 dark:border-matcha-700">
                                    <Receipt
                                        size={20}
                                        className="text-matcha-500 dark:text-foam-400"
                                    />
                                    <span className="text-lg font-bold text-matcha-900 dark:text-cream-50">
                                        Struk Digital
                                    </span>
                                    <div className="ml-auto flex items-center gap-1.5 rounded-full bg-matcha-50 px-3 py-1 text-xs font-medium text-matcha-600 dark:bg-matcha-800 dark:text-cream-400">
                                        <RotateCw
                                            size={12}
                                            className="animate-spin"
                                        />
                                        Auto-update
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="p-6">
                                    <div className="mb-4 flex items-center gap-2">
                                        <Coffee
                                            size={16}
                                            className="text-matcha-400"
                                        />
                                        <span className="text-xs font-bold uppercase tracking-wider text-matcha-400 dark:text-cream-500">
                                            Daftar Pesanan
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        <AnimatePresence>
                                            {order.items.map(
                                                (item, index) => (
                                                    <motion.div
                                                        key={item.id}
                                                        initial={{
                                                            opacity: 0,
                                                            x: -20,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            x: 0,
                                                        }}
                                                        transition={{
                                                            delay: index * 0.1,
                                                        }}
                                                        className="group flex items-center gap-4 rounded-2xl border border-matcha-100/50 bg-cream-50/50 p-4 transition-all hover:border-matcha-200 hover:shadow-md dark:border-matcha-800/50 dark:bg-matcha-950/50 dark:hover:border-matcha-700"
                                                    >
                                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-matcha-100 text-lg font-black text-matcha-600 dark:bg-matcha-800 dark:text-cream-200">
                                                            {item.qty}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="truncate text-base font-bold text-matcha-900 dark:text-cream-50">
                                                                {item.name}
                                                            </p>
                                                            <p className="text-sm text-matcha-500 dark:text-cream-500">
                                                                {formatRupiah(
                                                                    item.price,
                                                                )}{" "}
                                                                × {item.qty}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-lg font-black text-matcha-800 dark:text-cream-100">
                                                                {formatRupiah(
                                                                    item.price *
                                                                        item.qty,
                                                                )}
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                ),
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Notes */}
                                    {order.notes && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-500/20 dark:bg-amber-500/5"
                                        >
                                            <p className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                                                Catatan Dapur
                                            </p>
                                            <p className="mt-1 text-sm italic text-amber-600 dark:text-amber-300">
                                                "{order.notes}"
                                            </p>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Total Section */}
                                <div className="relative border-t-2 border-dashed border-matcha-200 bg-gradient-to-r from-matcha-50 to-matcha-100/50 px-6 py-6 dark:border-matcha-700 dark:from-matcha-800 dark:to-matcha-900">
                                    {/* Decorative circles */}
                                    <div className="absolute -top-3 left-6 h-6 w-6 rounded-full bg-cream-50 dark:bg-matcha-950" />
                                    <div className="absolute -top-3 right-6 h-6 w-6 rounded-full bg-cream-50 dark:bg-matcha-950" />

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-matcha-500 dark:text-cream-400">
                                                Total Pembayaran
                                            </p>
                                            <p className="text-xs text-matcha-400 dark:text-cream-600">
                                                Sudah termasuk pajak
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-3xl font-black tracking-tight text-matcha-900 dark:text-foam-400">
                                                {formatRupiah(order.total)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Help / Info Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="rounded-3xl border border-matcha-100 bg-white/60 p-6 text-center backdrop-blur-sm dark:border-matcha-800 dark:bg-matcha-900/60"
                            >
                                <p className="text-sm text-matcha-500 dark:text-cream-400">
                                    Butuh bantuan? Hubungi staff kami di konter
                                    atau panggil melalui aplikasi.
                                </p>
                            </motion.div>
                        </motion.div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
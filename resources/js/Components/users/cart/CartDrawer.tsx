import { useCart } from '@/Contexts/CartContext';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
// 1. Import toast dari react-hot-toast
import { toast } from 'react-hot-toast';
import CheckoutForm from './CheckoutForm';
import { useState } from 'react';
// Import router dari Inertia untuk mengirim data ke backend Laravel
import { router } from '@inertiajs/react';
import SuccessModal from '../SuccessModal';

interface CartDrawerProps {
    open: boolean;
    onClose: () => void;
}

interface LocalCheckoutData {
    nama: string;
    nomorMeja: string;
    catatan: string;
}

const formatRupiah = (angka: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(angka);

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
    // Pastikan clearCart dipanggil dari CartContext agar bisa mengosongkan keranjang setelah submit sukses
    const { cart, removeItem, increaseQty, decreaseQty, clearCart } = useCart();

    const [checkout, setCheckout] = useState(false);
    // State internal untuk menangani status loading/processing saat submit ke Laravel
    const [processing, setProcessing] = useState(false);

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successData, setSuccessData] = useState({ nama: '', nomorMeja: '' });

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const totalItem = cart.reduce((sum, item) => sum + item.qty, 0);

    // Fungsi Handler untuk Aksi Submit dari CheckoutForm
    const handleCheckoutSubmit = (formData: LocalCheckoutData) => {
        if (cart.length === 0) return;

        setProcessing(true);
        const loadingToast = toast.loading('Sedang mengirim pesanan ke dapur...');

        // Mengirimkan objek datar (flat) langsung agar dibaca oleh validasi OrderController
        router.post('/checkout', {
            nama: formData.nama,
            nomorMeja: formData.nomorMeja,
            catatan: formData.catatan,
            items: cart as any, // Mencegah error 'Index signature missing' di TypeScript
            total: total
        }, {
            onSuccess: () => {
                toast.dismiss(loadingToast);
                toast.success('🚀 Pesanan berhasil dibuat! Mohon tunggu di meja Anda.', {
                    duration: 3000,
                });
                setSuccessData({ nama: formData.nama, nomorMeja: formData.nomorMeja });
                
                // Bersihkan keranjang dan reset layar state frontend
                clearCart(); 
                setCheckout(false);
                setProcessing(false);
                onClose();
                setShowSuccessModal(true);
            },
            onError: (errors) => {
                toast.dismiss(loadingToast);
                toast.error('Gagal mengirim pesanan. Silakan coba beberapa saat lagi.');
                setProcessing(false);
                console.error(errors);
            }
        });
    };

    // 2. Fungsi Toast Konfirmasi Kustom untuk Hapus Item
    const konfirmasiHapus = (id: number, name: string, viaMinus = false) => {
        toast((t) => (
            <div className="flex flex-col gap-2.5">
                <p className="text-xs font-medium text-matcha-900 dark:text-cream-100">
                    Apakah kamu yakin ingin menghapus <strong className="font-semibold text-matcha-700 dark:text-foam-400">{name}</strong> dari keranjang?
                </p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="rounded-lg bg-matcha-100 dark:bg-matcha-800 px-3 py-1 text-[11px] font-semibold text-matcha-700 dark:text-cream-200 transition-colors hover:bg-matcha-200"
                    >
                        Batal
                    </button>
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            if (viaMinus) {
                                decreaseQty(id);
                            } else {
                                removeItem(id);
                            }
                            // Tampilkan toast sukses setelah terhapus
                            toast.success(`${name} berhasil dihapus!`, {
                                style: {
                                    borderRadius: '1rem',
                                    background: typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? '#1c2e24' : '#fff',
                                    color: typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? '#fcfbf7' : '#2d4a3a',
                                    fontSize: '13px',
                                }
                            });
                        }}
                        className="rounded-lg bg-red-500 px-3 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-red-600 shadow-sm"
                    >
                        Ya, Hapus
                    </button>
                </div>
            </div>
        ), {
            duration: 5000,
            position: 'top-center',
            style: {
                borderRadius: '1.25rem',
                background: typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? '#1c2e24' : '#fff',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                padding: '12px 16px',
                maxWidth: '320px'
            }
        });
    };

    // 3. Interseptor untuk tombol minus
    const handleDecrease = (id: number, qty: number, name: string) => {
        if (qty === 1) {
            konfirmasiHapus(id, name, true);
        } else {
            decreaseQty(id);
        }
    };

    // 4. Reset state checkout ketika drawer ditutup total oleh user
    const handleCloseDrawer = () => {
        setCheckout(false);
        onClose();
    };

    return (
        <>
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={handleCloseDrawer}
                        className="fixed inset-0 z-40 bg-matcha-950/40 backdrop-blur-[2px]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col
                                   bg-cream-50 shadow-2xl shadow-matcha-900/20
                                   dark:bg-matcha-900 dark:shadow-black/40"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-matcha-100 px-5 py-4 dark:border-matcha-800">
                            <div className="flex items-center gap-2">
                                <ShoppingBag size={19} className="text-matcha-600 dark:text-foam-400" />
                                <h2 className="text-lg font-bold text-matcha-900 dark:text-cream-50">
                                    {checkout ? "Detail Pemesanan" : "Keranjang Belanja"}
                                </h2>
                                {!checkout && totalItem > 0 && (
                                    <span className="rounded-full bg-matcha-100 px-2 py-0.5 text-xs font-semibold text-matcha-700 dark:bg-matcha-800 dark:text-cream-200">
                                        {totalItem}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={handleCloseDrawer}
                                aria-label="Tutup keranjang"
                                className="flex h-8 w-8 items-center justify-center rounded-full text-matcha-500
                                           transition-colors hover:bg-matcha-100 hover:text-matcha-700
                                           dark:text-cream-400 dark:hover:bg-matcha-800 dark:hover:text-cream-50"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Konten Utama */}
                        {checkout ? (
                            <CheckoutForm
                                total={total}
                                onBack={() => setCheckout(false)}
                                processing={processing}
                                onSubmit={handleCheckoutSubmit as any}
                            />
                        ) : (
                            <div className="flex flex-1 flex-col overflow-hidden">
                                {/* Isi keranjang */}
                                <div className="flex-1 overflow-y-auto px-5 py-2">
                                    {cart.length === 0 ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.15 }}
                                            className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center"
                                        >
                                            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-matcha-100 dark:bg-matcha-800">
                                                <ShoppingBag size={26} className="text-matcha-400 dark:text-cream-500" />
                                            </span>
                                            <p className="text-sm font-medium text-matcha-700 dark:text-cream-200">
                                                Keranjangmu masih kosong
                                            </p>
                                            <p className="text-xs text-matcha-400 dark:text-cream-500">
                                                Yuk pilih menu favoritmu dulu
                                            </p>
                                        </motion.div>
                                    ) : (
                                        <ul className="divide-y divide-matcha-100 dark:divide-matcha-800">
                                            <AnimatePresence initial={false}>
                                                {cart.map((item, index) => (
                                                    <motion.li
                                                        key={item.id}
                                                        layout
                                                        initial={{ opacity: 0, y: 12 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, x: 60, height: 0, marginTop: 0, marginBottom: 0 }}
                                                        transition={{ duration: 0.25, delay: index * 0.04 }}
                                                        className="flex items-center gap-3 py-4"
                                                    >
                                                        <img
                                                            src={`/storage/${item.image}`}
                                                            alt={item.name}
                                                            className="h-14 w-14 shrink-0 rounded-xl object-cover shadow-sm"
                                                        />

                                                        <div className="min-w-0 flex-1">
                                                            <p className="truncate text-sm font-semibold text-matcha-900 dark:text-cream-50">
                                                                {item.name}
                                                            </p>
                                                            <p className="mt-0.5 text-xs text-matcha-500 dark:text-cream-400">
                                                                {formatRupiah(item.price)}
                                                            </p>

                                                            {/* Kontrol jumlah */}
                                                            <div className="mt-2 flex items-center gap-2">
                                                                <button
                                                                    onClick={() => handleDecrease(item.id, item.qty, item.name)}
                                                                    className="flex h-6 w-6 items-center justify-center rounded-full
                                                                               bg-matcha-100 text-matcha-700 transition-colors
                                                                               hover:bg-matcha-200 dark:bg-matcha-800 dark:text-cream-100
                                                                               dark:hover:bg-matcha-700"
                                                                >
                                                                    <Minus size={12} />
                                                                </button>
                                                                <span className="w-5 text-center text-sm font-medium text-matcha-900 dark:text-cream-50">
                                                                    {item.qty}
                                                                </span>
                                                                <button
                                                                    onClick={() => increaseQty(item.id)}
                                                                    className="flex h-6 w-6 items-center justify-center rounded-full
                                                                               bg-matcha-500 text-cream-50 transition-colors
                                                                               hover:bg-matcha-600"
                                                                >
                                                                    <Plus size={12} />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="flex shrink-0 flex-col items-end gap-2">
                                                            <p className="text-sm font-bold text-matcha-700 dark:text-foam-400">
                                                                {formatRupiah(item.price * item.qty)}
                                                            </p>
                                                            <button
                                                                onClick={() => konfirmasiHapus(item.id, item.name, false)}
                                                                aria-label={`Hapus ${item.name}`}
                                                                className="text-matcha-300 transition-colors hover:text-red-500
                                                                           dark:text-matcha-600 dark:hover:text-red-400"
                                                            >
                                                                <Trash2 size={15} />
                                                            </button>
                                                        </div>
                                                    </motion.li>
                                                ))}
                                            </AnimatePresence>
                                        </ul>
                                    )}
                                </div>

                                {/* Footer */}
                                {cart.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="border-t border-matcha-100 bg-white px-5 py-4
                                                   dark:border-matcha-800 dark:bg-matcha-900"
                                    >
                                        <div className="mb-3 flex items-center justify-between">
                                            <span className="text-sm text-matcha-600 dark:text-cream-400">
                                                Total Belanja
                                            </span>
                                            <span className="text-lg font-bold text-matcha-900 dark:text-cream-50">
                                                {formatRupiah(total)}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => setCheckout(true)}
                                            className="w-full rounded-full bg-matcha-500 py-3 text-sm font-semibold
                                                       text-cream-50 shadow-md shadow-matcha-500/30
                                                       transition-all hover:bg-matcha-600 hover:shadow-lg
                                                       active:scale-[0.98]"
                                        >
                                            Pesan Sekarang
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
        <AnimatePresence>
                {showSuccessModal && (
                    <SuccessModal
                        isOpen={showSuccessModal}
                        onClose={() => setShowSuccessModal(false)}
                        customerName={successData.nama}
                        tableNumber={successData.nomorMeja}
                    />
                )}
        </AnimatePresence>
        </>
    );
}
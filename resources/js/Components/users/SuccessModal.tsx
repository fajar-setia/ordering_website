import { motion } from 'framer-motion';
import { Home, ShoppingBag } from 'lucide-react';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    customerName: string;
    tableNumber: string;
}

export default function SuccessModal({ isOpen, onClose, customerName, tableNumber }: SuccessModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop dengan blur */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-matcha-950/50 backdrop-blur-sm"
            />

            {/* Kotak Modal Persegi */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="relative z-10 w-full max-w-sm rounded-3xl bg-cream-50 p-6 text-center shadow-2xl dark:bg-matcha-900 border border-matcha-100 dark:border-matcha-800"
            >
                {/* Animasi Lingkaran & Centang */}
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/40">
                    <svg
                        className="h-12 w-12 text-emerald-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                    >
                        <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.6, ease: "easeInOut", delay: 0.2 }}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>

                {/* Teks Informasi */}
                <h3 className="text-xl font-bold text-matcha-900 dark:text-cream-50">
                    Pesanan Dikirim!
                </h3>
                <p className="mt-2 text-sm text-matcha-600 dark:text-cream-300 px-2">
                    Halo <strong className="font-semibold text-matcha-800 dark:text-foam-400">{customerName}</strong>, pesananmu sudah diteruskan ke dapur untuk meja <strong className="font-semibold text-matcha-800 dark:text-foam-400">{tableNumber}</strong>.
                </p>

                {/* Keterangan Tambahan */}
                <div className="mt-4 rounded-2xl bg-white p-3 text-xs text-matcha-500 shadow-sm dark:bg-matcha-800 dark:text-cream-400">
                    Silakan santai sejenak, barista kami akan segera meracik pesananmu.
                </div>

                {/* Tombol Aksi */}
                <button
                    onClick={onClose}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-matcha-500 py-3 text-sm font-semibold text-cream-50 shadow-md shadow-matcha-500/20 transition-all hover:bg-matcha-600 active:scale-[0.98]"
                >
                    <ShoppingBag size={16} />
                    Pesan Menu Lain
                </button>
            </motion.div>
        </div>
    );
}
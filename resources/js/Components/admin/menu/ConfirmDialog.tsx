import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    processing?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel = 'Hapus',
    processing = false,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                        className="fixed inset-0 z-[60] bg-matcha-950/50 backdrop-blur-[2px]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.18 }}
                        className="fixed left-1/2 top-1/2 z-[70] w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2
                                   rounded-3xl bg-white p-6 shadow-2xl shadow-matcha-900/20
                                   dark:bg-matcha-900 dark:shadow-black/40"
                    >
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/15">
                            <AlertTriangle size={22} className="text-red-500" />
                        </div>
                        <h3 className="mb-1.5 text-lg font-semibold text-matcha-900 dark:text-cream-50">
                            {title}
                        </h3>
                        <p className="mb-6 text-sm text-matcha-500 dark:text-cream-400">
                            {description}
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={onCancel}
                                disabled={processing}
                                className="flex-1 rounded-xl border border-matcha-200 py-2.5 text-sm font-semibold
                                           text-matcha-700 transition-colors hover:bg-matcha-50 disabled:opacity-50
                                           dark:border-matcha-700 dark:text-cream-200 dark:hover:bg-matcha-800"
                            >
                                Batal
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={processing}
                                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white
                                           transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing ? 'Memproses...' : confirmLabel}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Hash, MessageSquare, User } from 'lucide-react';

export interface CheckoutData {
    nama: string;
    nomorMeja: string;
    catatan: string;
}

interface CheckoutFormProps {
    total: number;
    onBack: () => void;
    onSubmit: (data: CheckoutData) => void;
    processing?: boolean;
}

const formatRupiah = (angka: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(angka);

export default function CheckoutForm({
    total,
    onBack,
    onSubmit,
    processing = false,
}: CheckoutFormProps) {
    const [nama, setNama] = useState('');
    const [nomorMeja, setNomorMeja] = useState('');
    const [catatan, setCatatan] = useState('');
    const [errorNama, setErrorNama] = useState(false);

    const handleSubmit = () => {
        if (nama.trim() === '') {
            setErrorNama(true);
            return;
        }
        onSubmit({ nama, nomorMeja, catatan });
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.25 }}
            className="flex h-full flex-col bg-cream-50 dark:bg-matcha-900"
        >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-matcha-100 p-5 dark:border-matcha-800">
                <button
                    onClick={onBack}
                    aria-label="Kembali ke keranjang"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-matcha-500
                               transition-colors hover:bg-matcha-100 hover:text-matcha-700
                               dark:text-cream-400 dark:hover:bg-matcha-800 dark:hover:text-cream-50"
                >
                    <ArrowLeft size={17} />
                </button>
                <h2 className="text-xl font-bold text-matcha-900 dark:text-cream-50">
                    Checkout
                </h2>
            </div>

            {/* Form */}
            <div className="flex-1 space-y-5 overflow-y-auto p-5">
                <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-matcha-700 dark:text-cream-200">
                        <User size={14} />
                        Nama Pemesan
                    </label>
                    <input
                        value={nama}
                        onChange={(e) => {
                            setNama(e.target.value);
                            if (errorNama) setErrorNama(false);
                        }}
                        placeholder="Masukkan nama"
                        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-matcha-900
                                   outline-none transition-colors placeholder:text-matcha-400
                                   focus:ring-2 dark:bg-matcha-800 dark:text-cream-50 dark:placeholder:text-cream-500 ${
                                       errorNama
                                           ? 'border-red-400 focus:border-red-400 focus:ring-red-100 dark:focus:ring-red-900/30'
                                           : 'border-matcha-200 focus:border-matcha-400 focus:ring-matcha-200 dark:border-matcha-700 dark:focus:ring-matcha-600/40'
                                   }`}
                    />
                    {errorNama && (
                        <p className="mt-1 text-xs text-red-500">Nama pemesan wajib diisi</p>
                    )}
                </div>

                <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-matcha-700 dark:text-cream-200">
                        <Hash size={14} />
                        Nomor Meja
                    </label>
                    <input
                        type="number"
                        value={nomorMeja}
                        onChange={(e) => setNomorMeja(e.target.value)}
                        placeholder="Contoh: 12"
                        className="w-full rounded-xl border border-matcha-200 bg-white px-4 py-3 text-sm
                                   text-matcha-900 outline-none transition-colors placeholder:text-matcha-400
                                   focus:border-matcha-400 focus:ring-2 focus:ring-matcha-200
                                   dark:border-matcha-700 dark:bg-matcha-800 dark:text-cream-50
                                   dark:placeholder:text-cream-500 dark:focus:ring-matcha-600/40"
                    />
                </div>

                <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-matcha-700 dark:text-cream-200">
                        <MessageSquare size={14} />
                        Catatan
                        <span className="font-normal text-matcha-400 dark:text-cream-500">(opsional)</span>
                    </label>
                    <textarea
                        rows={4}
                        value={catatan}
                        onChange={(e) => setCatatan(e.target.value)}
                        placeholder="Contoh: pedas sedang, tanpa bawang..."
                        className="w-full resize-none rounded-xl border border-matcha-200 bg-white px-4 py-3
                                   text-sm text-matcha-900 outline-none transition-colors
                                   placeholder:text-matcha-400 focus:border-matcha-400 focus:ring-2
                                   focus:ring-matcha-200 dark:border-matcha-700 dark:bg-matcha-800
                                   dark:text-cream-50 dark:placeholder:text-cream-500
                                   dark:focus:ring-matcha-600/40"
                    />
                </div>
            </div>

            {/* Footer: total & aksi */}
            <div className="border-t border-matcha-100 bg-white p-5 dark:border-matcha-800 dark:bg-matcha-900">
                <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm text-matcha-600 dark:text-cream-400">Total</span>
                    <strong className="text-lg font-bold text-matcha-900 dark:text-cream-50">
                        {formatRupiah(total)}
                    </strong>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onBack}
                        disabled={processing}
                        className="flex-1 rounded-xl border border-matcha-200 py-3 text-sm font-semibold
                                   text-matcha-700 transition-colors hover:bg-matcha-50
                                   disabled:cursor-not-allowed disabled:opacity-50
                                   dark:border-matcha-700 dark:text-cream-200 dark:hover:bg-matcha-800"
                    >
                        Kembali
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={processing}
                        className="flex-1 rounded-xl bg-matcha-500 py-3 text-sm font-semibold text-cream-50
                                   shadow-md shadow-matcha-500/30 transition-all hover:bg-matcha-600
                                   hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60
                                   active:scale-[0.98]"
                    >
                        {processing ? 'Memproses...' : 'Buat Pesanan'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
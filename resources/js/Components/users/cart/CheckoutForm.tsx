import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Hash, MessageSquare, User } from 'lucide-react';

// 1. Ekspor interface agar terbaca sempurna di CartDrawer.tsx
interface CheckoutData {
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
    // State local untuk controlled inputs
    const [nama, setNama] = useState('');
    const [nomorMeja, setNomorMeja] = useState('');
    const [catatan, setCatatan] = useState('');
    
    // State error handling untuk validasi nama pemesan & nomor meja
    const [errorNama, setErrorNama] = useState(false);
    const [errorMeja, setErrorMeja] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        let isValid = true;

        if (nama.trim() === '') {
            setErrorNama(true);
            isValid = false;
        }
        
        if (nomorMeja.trim() === '') {
            setErrorMeja(true);
            isValid = false;
        }

        // Jika semua field wajib terisi, kirim data ke parent (CartDrawer)
        if (isValid) {
            onSubmit({ nama, nomorMeja, catatan });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.25 }}
            className="flex h-full flex-col bg-cream-50 dark:bg-matcha-900"
        >
            {/* Form Container */}
            <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
                
                {/* Bagian Input Form */}
                <div className="flex-1 space-y-5 overflow-y-auto p-5">
                    
                    {/* Input Nama Pemesan */}
                    <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-matcha-700 dark:text-cream-200">
                            <User size={14} />
                            Nama Pemesan *
                        </label>
                        <input
                            type="text"
                            value={nama}
                            disabled={processing}
                            onChange={(e) => {
                                setNama(e.target.value);
                                if (errorNama) setErrorNama(false);
                            }}
                            placeholder="Masukkan nama Anda"
                            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-matcha-900
                                       outline-none transition-colors placeholder:text-matcha-400
                                       focus:ring-2 dark:bg-matcha-800 dark:text-cream-50 dark:placeholder:text-cream-500 disabled:opacity-50 ${
                                           errorNama
                                               ? 'border-red-400 focus:border-red-400 focus:ring-red-100 dark:focus:ring-red-900/30'
                                               : 'border-matcha-200 focus:border-matcha-400 focus:ring-matcha-200 dark:border-matcha-700 dark:focus:ring-matcha-600/40'
                                       }`}
                        />
                        {errorNama && (
                            <p className="mt-1 text-xs text-red-500">Nama pemesan wajib diisi</p>
                        )}
                    </div>

                    {/* Input Nomor Meja */}
                    <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-matcha-700 dark:text-cream-200">
                            <Hash size={14} />
                            Nomor Meja *
                        </label>
                        <input
                            type="text"
                            value={nomorMeja}
                            disabled={processing}
                            onChange={(e) => {
                                setNomorMeja(e.target.value);
                                if (errorMeja) setErrorMeja(false);
                            }}
                            placeholder="Contoh: 04"
                            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-matcha-900
                                       outline-none transition-colors placeholder:text-matcha-400
                                       focus:ring-2 dark:bg-matcha-800 dark:text-cream-50 dark:placeholder:text-cream-500 disabled:opacity-50 ${
                                           errorMeja
                                               ? 'border-red-400 focus:border-red-400 focus:ring-red-100 dark:focus:ring-red-900/30'
                                               : 'border-matcha-200 focus:border-matcha-400 focus:ring-matcha-200 dark:border-matcha-700 dark:focus:ring-matcha-600/40'
                                       }`}
                        />
                        {errorMeja && (
                            <p className="mt-1 text-xs text-red-500">Nomor meja wajib diisi</p>
                        )}
                    </div>

                    {/* Input Catatan Opsional */}
                    <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-matcha-700 dark:text-cream-200">
                            <MessageSquare size={14} />
                            Catatan
                            <span className="ml-1 text-xs font-normal text-matcha-400 dark:text-cream-500">(opsional)</span>
                        </label>
                        <textarea
                            rows={4}
                            value={catatan}
                            disabled={processing}
                            onChange={(e) => setCatatan(e.target.value)}
                            placeholder="Contoh: es batu sedikit, sendok dua..."
                            className="w-full resize-none rounded-xl border border-matcha-200 bg-white px-4 py-3
                                       text-sm text-matcha-900 outline-none transition-colors
                                       placeholder:text-matcha-400 focus:border-matcha-400 focus:ring-2
                                       focus:ring-matcha-200 dark:border-matcha-700 dark:bg-matcha-800
                                       dark:text-cream-50 dark:placeholder:text-cream-500
                                       dark:focus:ring-matcha-600/40 disabled:opacity-50"
                        />
                    </div>
                </div>

                {/* Footer Sticky: Total & Tombol Aksi */}
                <div className="border-t border-matcha-100 bg-white p-5 dark:border-matcha-800 dark:bg-matcha-900">
                    <div className="mb-4 flex items-center justify-between">
                        <span className="text-sm text-matcha-600 dark:text-cream-400">Total Pembayaran</span>
                        <strong className="text-lg font-bold text-matcha-900 dark:text-cream-50">
                            {formatRupiah(total)}
                        </strong>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
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
                            type="submit"
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
            </form>
        </motion.div>
    );
}
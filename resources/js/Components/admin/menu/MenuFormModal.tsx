import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ImagePlus, X } from 'lucide-react';

export interface MenuItem {
    id: number;
    nama: string;
    kategori: string;
    harga: number;
    deskripsi: string;
    gambar: string | null;
    status: 'aktif' | 'nonaktif';
}

interface MenuFormModalProps {
    open: boolean;
    kategoriList: string[];
    /** Kalau diisi, form dalam mode edit. Kosongkan (undefined) untuk mode tambah baru */
    initialData?: MenuItem;
    processing?: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<MenuItem, 'id'>, imageFile: File | null) => void;
}

const kosong: Omit<MenuItem, 'id'> = {
    nama: '',
    kategori: '',
    harga: 0,
    deskripsi: '',
    gambar: null,
    status: 'aktif',
};

export default function MenuFormModal({
    open,
    kategoriList,
    initialData,
    processing = false,
    onClose,
    onSubmit,
}: MenuFormModalProps) {
    const [form, setForm] = useState<Omit<MenuItem, 'id'>>(kosong);
    const [preview, setPreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [errorNama, setErrorNama] = useState(false);

    // Isi ulang form tiap kali modal dibuka — mode edit isi dari initialData,
    // mode tambah baru selalu mulai kosong (bukan bawa data terakhir yang ke-edit)
    useEffect(() => {
        if (open) {
            setForm(initialData ? { ...initialData } : kosong);
            setPreview(initialData?.gambar ? `/storage/${initialData.gambar}` : null);
            setImageFile(null);
            setErrorNama(false);
        }
    }, [open, initialData]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = () => {
        if (form.nama.trim() === '') {
            setErrorNama(true);
            return;
        }
        onSubmit(form, imageFile);
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[60] bg-matcha-950/50 backdrop-blur-[2px]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 16 }}
                        transition={{ duration: 0.2 }}
                        className="fixed left-1/2 top-1/2 z-[70] flex max-h-[88vh] w-[92vw] max-w-lg
                                   -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden
                                   rounded-3xl bg-white shadow-2xl shadow-matcha-900/20
                                   dark:bg-matcha-900 dark:shadow-black/40"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-matcha-100 px-6 py-4 dark:border-matcha-800">
                            <h3 className="text-lg font-semibold text-matcha-900 dark:text-cream-50">
                                {initialData ? 'Edit Menu' : 'Tambah Menu Baru'}
                            </h3>
                            <button
                                onClick={onClose}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-matcha-500
                                           hover:bg-matcha-100 dark:text-cream-400 dark:hover:bg-matcha-800"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Body — bisa scroll kalau form panjang */}
                        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
                            {/* Upload gambar */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-matcha-700 dark:text-cream-200">
                                    Foto Menu
                                </label>
                                <label
                                    className="flex h-40 cursor-pointer items-center justify-center overflow-hidden
                                               rounded-2xl border-2 border-dashed border-matcha-200 bg-matcha-50
                                               transition-colors hover:border-matcha-400
                                               dark:border-matcha-700 dark:bg-matcha-800"
                                >
                                    {preview ? (
                                        <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-1.5 text-matcha-400 dark:text-cream-500">
                                            <ImagePlus size={24} />
                                            <span className="text-xs">Klik untuk unggah foto</span>
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                </label>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-matcha-700 dark:text-cream-200">
                                    Nama Menu
                                </label>
                                <input
                                    value={form.nama}
                                    onChange={(e) => {
                                        setForm({ ...form, nama: e.target.value });
                                        if (errorNama) setErrorNama(false);
                                    }}
                                    placeholder="Contoh: Pizza Margherita"
                                    className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-matcha-900
                                               outline-none transition-colors placeholder:text-matcha-400
                                               focus:ring-2 dark:bg-matcha-800 dark:text-cream-50 dark:placeholder:text-cream-500 ${
                                                   errorNama
                                                       ? 'border-red-400 focus:ring-red-100 dark:focus:ring-red-900/30'
                                                       : 'border-matcha-200 focus:border-matcha-400 focus:ring-matcha-200 dark:border-matcha-700 dark:focus:ring-matcha-600/40'
                                               }`}
                                />
                                {errorNama && (
                                    <p className="mt-1 text-xs text-red-500">Nama menu wajib diisi</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-matcha-700 dark:text-cream-200">
                                        Kategori
                                    </label>
                                    <select
                                        value={form.kategori}
                                        onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                                        className="w-full rounded-xl border border-matcha-200 bg-white px-4 py-2.5 text-sm
                                                   text-matcha-900 outline-none focus:border-matcha-400 focus:ring-2
                                                   focus:ring-matcha-200 dark:border-matcha-700 dark:bg-matcha-800
                                                   dark:text-cream-50 dark:focus:ring-matcha-600/40"
                                    >
                                        <option value="">Pilih kategori</option>
                                        {kategoriList.map((k) => (
                                            <option key={k} value={k}>{k}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-matcha-700 dark:text-cream-200">
                                        Harga
                                    </label>
                                    <input
                                        type="number"
                                        value={form.harga || ''}
                                        onChange={(e) => setForm({ ...form, harga: Number(e.target.value) })}
                                        placeholder="0"
                                        className="w-full rounded-xl border border-matcha-200 bg-white px-4 py-2.5 text-sm
                                                   text-matcha-900 outline-none focus:border-matcha-400 focus:ring-2
                                                   focus:ring-matcha-200 dark:border-matcha-700 dark:bg-matcha-800
                                                   dark:text-cream-50 dark:focus:ring-matcha-600/40"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-matcha-700 dark:text-cream-200">
                                    Deskripsi
                                </label>
                                <textarea
                                    rows={3}
                                    value={form.deskripsi}
                                    onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                                    placeholder="Bahan-bahan atau ciri khas menu ini..."
                                    className="w-full resize-none rounded-xl border border-matcha-200 bg-white px-4 py-2.5
                                               text-sm text-matcha-900 outline-none focus:border-matcha-400 focus:ring-2
                                               focus:ring-matcha-200 dark:border-matcha-700 dark:bg-matcha-800
                                               dark:text-cream-50 dark:focus:ring-matcha-600/40"
                                />
                            </div>

                            {/* Toggle status aktif/nonaktif */}
                            <div className="flex items-center justify-between rounded-xl bg-matcha-50 px-4 py-3 dark:bg-matcha-800">
                                <div>
                                    <p className="text-sm font-medium text-matcha-900 dark:text-cream-50">
                                        Status Menu
                                    </p>
                                    <p className="text-xs text-matcha-500 dark:text-cream-400">
                                        Menu nonaktif tidak tampil ke pelanggan
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setForm({ ...form, status: form.status === 'aktif' ? 'nonaktif' : 'aktif' })
                                    }
                                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                                        form.status === 'aktif' ? 'bg-matcha-500' : 'bg-matcha-200 dark:bg-matcha-700'
                                    }`}
                                >
                                    <span
                                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                                            form.status === 'aktif' ? 'translate-x-5' : 'translate-x-0.5'
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex gap-3 border-t border-matcha-100 px-6 py-4 dark:border-matcha-800">
                            <button
                                onClick={onClose}
                                disabled={processing}
                                className="flex-1 rounded-xl border border-matcha-200 py-2.5 text-sm font-semibold
                                           text-matcha-700 transition-colors hover:bg-matcha-50 disabled:opacity-50
                                           dark:border-matcha-700 dark:text-cream-200 dark:hover:bg-matcha-800"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={processing}
                                className="flex-1 rounded-xl bg-matcha-500 py-2.5 text-sm font-semibold text-cream-50
                                           shadow-md shadow-matcha-500/30 transition-all hover:bg-matcha-600
                                           disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing ? 'Menyimpan...' : initialData ? 'Simpan Perubahan' : 'Tambah Menu'}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
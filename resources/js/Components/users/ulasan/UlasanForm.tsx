import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Star, Send } from 'lucide-react';

interface UlasanFormProps {
    /** ID menu/pesanan yang diulas, opsional kalau ulasan sifatnya umum untuk toko */
    menuId?: number;
    /** Dipanggil setelah submit sukses, misal untuk refresh daftar ulasan di parent */
    onSukses?: () => void;
}

export default function UlasanForm({ menuId, onSukses }: UlasanFormProps) {
    const [hoverRating, setHoverRating] = useState(0);

    const { data, setData, post, processing, errors, reset } = useForm({
        menu_id: menuId ?? null,
        rating: 0,
        komentar: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('ulasan.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onSukses?.();
            },
        });
    };

    return (
        <div
            className="rounded-3xl bg-white p-6 shadow-md shadow-matcha-900/5
                       dark:bg-matcha-900 dark:shadow-black/30 sm:p-8"
        >
            <h3 className="mb-1 text-lg font-semibold text-matcha-900 dark:text-cream-50">
                Bagikan pengalamanmu
            </h3>
            <p className="mb-5 text-sm text-matcha-500 dark:text-cream-400">
                Ulasanmu membantu pelanggan lain menemukan menu terbaik
            </p>

            <form onSubmit={submit} className="space-y-4">
                {/* Star rating interaktif */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-matcha-700 dark:text-cream-200">
                        Rating kamu
                    </label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((bintang) => (
                            <button
                                key={bintang}
                                type="button"
                                onMouseEnter={() => setHoverRating(bintang)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setData('rating', bintang)}
                                className="rounded-full p-1 transition-transform hover:scale-110"
                            >
                                <Star
                                    size={26}
                                    className={
                                        bintang <= (hoverRating || data.rating)
                                            ? 'fill-foam-500 text-foam-500'
                                            : 'fill-transparent text-matcha-200 dark:text-matcha-700'
                                    }
                                />
                            </button>
                        ))}
                    </div>
                    {errors.rating && (
                        <p className="mt-1 text-xs text-red-500">{errors.rating}</p>
                    )}
                </div>

                {/* Komentar */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-matcha-700 dark:text-cream-200">
                        Ceritakan pengalamanmu
                    </label>
                    <textarea
                        rows={4}
                        value={data.komentar}
                        onChange={(e) => setData('komentar', e.target.value)}
                        placeholder="Menunya enak, pengirimannya cepat..."
                        className="w-full resize-none rounded-2xl border border-matcha-200 bg-cream-50
                                   px-4 py-3 text-sm text-matcha-900 outline-none transition-colors
                                   placeholder:text-matcha-400 focus:border-matcha-400 focus:ring-2
                                   focus:ring-matcha-200 dark:border-matcha-700 dark:bg-matcha-800
                                   dark:text-cream-50 dark:placeholder:text-cream-500
                                   dark:focus:ring-matcha-600/40"
                    />
                    {errors.komentar && (
                        <p className="mt-1 text-xs text-red-500">{errors.komentar}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing || data.rating === 0}
                    className="flex items-center gap-2 rounded-full bg-matcha-500 px-6 py-2.5
                               text-sm font-semibold text-cream-50 shadow-sm shadow-matcha-500/30
                               transition-all hover:bg-matcha-600 hover:shadow-md
                               disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Send size={15} />
                    {processing ? 'Mengirim...' : 'Kirim Ulasan'}
                </button>
            </form>
        </div>
    );
}
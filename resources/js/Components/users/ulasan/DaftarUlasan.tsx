import { Star } from 'lucide-react';

export interface Ulasan {
    id: number;
    nama: string;
    rating: number;
    komentar: string;
    menuNama?: string;
    tanggal: string;
}

interface DaftarUlasanProps {
    ulasan: Ulasan[];
}

function inisial(nama: string) {
    return nama
        .split(' ')
        .map((kata) => kata[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
}

export default function DaftarUlasan({ ulasan }: DaftarUlasanProps) {
    if (ulasan.length === 0) {
        return (
            <div
                className="rounded-3xl border border-dashed border-matcha-200 bg-white/50
                           py-14 text-center dark:border-matcha-800 dark:bg-matcha-900/30"
            >
                <p className="text-sm text-matcha-500 dark:text-cream-400">
                    Belum ada ulasan. Jadilah yang pertama memberi ulasan!
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {ulasan.map((item) => (
                <div
                    key={item.id}
                    className="rounded-3xl bg-white p-6 shadow-sm shadow-matcha-900/5
                               transition-shadow hover:shadow-md dark:bg-matcha-900
                               dark:shadow-black/20"
                >
                    <div className="mb-3 flex items-center gap-3">
                        <span
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full
                                       bg-matcha-100 text-sm font-semibold text-matcha-700
                                       dark:bg-matcha-800 dark:text-cream-100"
                        >
                            {inisial(item.nama)}
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-matcha-900 dark:text-cream-50">
                                {item.nama}
                            </p>
                            <p className="text-xs text-matcha-400 dark:text-cream-500">
                                {item.tanggal}
                                {item.menuNama && ` · ${item.menuNama}`}
                            </p>
                        </div>
                        <div className="flex shrink-0 gap-0.5">
                            {[1, 2, 3, 4, 5].map((n) => (
                                <Star
                                    key={n}
                                    size={14}
                                    className={
                                        n <= item.rating
                                            ? 'fill-foam-500 text-foam-500'
                                            : 'fill-transparent text-matcha-200 dark:text-matcha-700'
                                    }
                                />
                            ))}
                        </div>
                    </div>
                    <p className="text-sm leading-relaxed text-matcha-600 dark:text-cream-300">
                        {item.komentar}
                    </p>
                </div>
            ))}
        </div>
    );
}
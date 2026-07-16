// resources/js/Layouts/AuthenticatedLayout.tsx
import Navbar from '@/Components/navigation/Navbar';
import Footer from '@/Components/navigation/Footer';
import MobileBottomNav from '@/Components/navigation/BottomNav';
import { usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode } from 'react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;

    return (
        <div className="flex min-h-screen flex-col bg-cream-50 dark:bg-matcha-950">
            {/* Navbar utama — ganti Navbar1 dengan Navbar2/Navbar3 kalau mau varian lain */}
            <Navbar
                userName={user?.name ?? 'Pengguna'}
                cartCount={user?.cart_count ?? 0}
            />

            {/* Judul halaman opsional, dikirim tiap page lewat prop `header` */}
            {header && (
                <header className="border-b border-matcha-100 bg-white/60 dark:border-matcha-800 dark:bg-matcha-900/40">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* pb-24 di mobile → kasih ruang supaya konten tidak ketutup bottom nav.
                pb-0 di md ke atas karena bottom nav sudah hilang & footer yang muncul. */}
            <main className="flex-1 pb-24 md:pb-0">{children}</main>

            {/* FOOTER: disembunyikan di mobile (hidden), baru muncul mulai breakpoint md.
                Alasannya: di mobile, ruang paling bawah sudah "dipakai" oleh bottom nav,
                jadi footer panjang justru bikin scroll ganda & terasa penuh sesak. */}
            <div className="hidden md:block">
                <Footer />
            </div>

            {/* BOTTOM NAV: kebalikannya, cuma tampil di mobile.
                Class md:hidden ini sudah built-in di dalam komponen MobileBottomNav itu sendiri. */}
            <MobileBottomNav cartCount={user?.cart_count ?? 0} />
        </div>
    );
}
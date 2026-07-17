// resources/js/Layouts/AuthenticatedLayout.tsx
import Navbar from "@/Components/navigation/Navbar";
import Footer from "@/Components/navigation/Footer";
import MobileBottomNav from "@/Components/navigation/BottomNav";
import { usePage } from "@inertiajs/react";
import { PropsWithChildren, ReactNode, useState } from "react";
import { CartProvider } from "@/Contexts/CartContext";

import CartDrawer from "@/Components/users/cart/CartDrawer";
import { Toaster } from "react-hot-toast";

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const [cartOpen, setCartOpen] = useState(false);
    const user = usePage().props.auth.user;

    return (
        <CartProvider>
            <div className="flex min-h-screen flex-col bg-cream-50 dark:bg-matcha-950">
                {/* Navbar utama — ganti Navbar1 dengan Navbar2/Navbar3 kalau mau varian lain */}
                <Navbar cartOpen={cartOpen} setCartOpen={setCartOpen} />

                <CartDrawer
                    open={cartOpen}
                    onClose={() => setCartOpen(false)}
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

                <Toaster position="top-right" reverseOrder={false} />

                {/* FOOTER: disembunyikan di mobile (hidden), baru muncul mulai breakpoint md.
                Alasannya: di mobile, ruang paling bawah sudah "dipakai" oleh bottom nav,
                jadi footer panjang justru bikin scroll ganda & terasa penuh sesak. */}
                <div className="hidden md:block">
                    <Footer />
                </div>

                {/* BOTTOM NAV: kebalikannya, cuma tampil di mobile.
                Class md:hidden ini sudah built-in di dalam komponen MobileBottomNav itu sendiri. */}
                <MobileBottomNav />
            </div>
        </CartProvider>
    );
}

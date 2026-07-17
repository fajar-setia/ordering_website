import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import { Star } from "lucide-react";
import { FaSearch, FaSlidersH } from "react-icons/fa";
import UlasanForm from "@/Components/users/ulasan/UlasanForm";
import DaftarUlasan, { Ulasan } from "@/Components/users/ulasan/DaftarUlasan";
import Products from "@/Components/users/products/Products";

// Contoh data ulasan — nanti ganti dengan props dari controller Laravel
// misal: export default function Welcome({ ulasan }: { ulasan: Ulasan[] })

interface Category {
    id: number;
    name: string;
    slug: string;
    icon: string | null;
}

interface Product {
    id: number;
    category_id: number;
    name: string;
    slug: string;
    description: string |null;
    price: number;
    stock: number;
    image: string;
    is_featured: boolean;
    is_available: boolean;
    category: Category;
}

interface WelcomeProps {
    categories: Category[];
    products: Product[];
}


const contohUlasan: Ulasan[] = [
    {
        id: 1,
        nama: "Rani Puspita",
        rating: 5,
        komentar:
            "Pizza-nya masih anget pas sampai, keju mozzarella-nya juga melimpah. Recommended!",
        menuNama: "Pizza Margherita",
        tanggal: "2 hari lalu",
    },
    {
        id: 2,
        nama: "Dimas Ardiansyah",
        rating: 4,
        komentar:
            "Burgernya enak, cuma pengirimannya agak lama pas jam makan siang.",
        menuNama: "Burger Classic",
        tanggal: "5 hari lalu",
    },
];

export default function Welcome({ categories, products }: WelcomeProps) {

    const kategoriList = [
    {
        id: 0,
        name: "Semua",
        slug: "semua",
        icon: null,
    },
    ...categories,
];

    return (
        <AuthenticatedLayout>
            <Head title="PesanYuk - Aplikasi Pemesanan Makanan" />

            <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
                {/* ================= HERO ================= */}
                <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-matcha-700 via-matcha-600 to-matcha-500 dark:from-matcha-950 dark:via-matcha-900 dark:to-matcha-800">
                    {/* Background Blur */}
                    <div className="absolute -left-16 -top-16 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-foam-300/10 blur-3xl dark:bg-matcha-600/20" />

                    <div className="relative mx-auto grid min-h-[520px] max-w-7xl items-center gap-10 px-8 py-16 lg:grid-cols-2">
                        {/* ================= LEFT ================= */}
                        <div>
                            <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur">
                                🌿 Fresh Every Day
                            </span>

                            <h1 className="mt-5 text-4xl font-black leading-tight text-white lg:text-5xl">
                                Nikmati Matcha &
                                <br />
                                Makanan Favoritmu
                            </h1>

                            <p className="mt-5 max-w-lg text-base leading-7 text-green-100 dark:text-matcha-100">
                                Pesan makanan dan minuman favoritmu dengan
                                cepat. Dibuat dari bahan pilihan dengan cita
                                rasa premium dan siap diantar langsung ke
                                rumahmu.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-4">
                                <button
                                    className="
                        rounded-full
                        bg-white
                        px-6
                        py-3
                        font-semibold
                        text-matcha-700
                        transition
                        hover:scale-105
                    "
                                >
                                    🍽️ Pesan Sekarang
                                </button>

                                <button
                                    className="
                        rounded-full
                        border
                        border-white/30
                        bg-white/10
                        px-6
                        py-3
                        font-semibold
                        text-white
                        backdrop-blur
                        transition
                        hover:bg-white/20
                    "
                                >
                                    📖 Lihat Menu
                                </button>
                            </div>
                        </div>

                        {/* ================= RIGHT ================= */}
                        <div className="relative hidden justify-center lg:flex">
                            <div className="absolute h-80 w-80 rounded-full bg-white/10 blur-3xl" />

                            <img
                                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&q=80"
                                alt="Pizza"
                                className="
                    relative
                    w-[420px]
                    drop-shadow-2xl
                    transition
                    duration-500
                    hover:scale-105
                "
                            />
                        </div>
                    </div>

                    {/* ================= MULTI-LAYERED SMOOTH WAVES ================= */}
                    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
                        <svg
                            viewBox="0 0 1440 160"
                            preserveAspectRatio="none"
                            className="block h-28 w-full"
                        >
                            {/* Gelombang Belakang (Paling Transparan) */}
                            <path
                                className="fill-cream-50/40 dark:fill-matcha-900/30"
                                d="M0,90 C320,40 480,140 800,80 C1120,20 1280,120 1440,70 L1440,160 L0,160 Z"
                            />

                            {/* Gelombang Tengah (Transparansi Sedang) */}
                            <path
                                className="fill-cream-50/70 dark:fill-matcha-900/60"
                                d="M0,110 C240,70 400,150 720,100 C1040,50 1200,130 1440,90 L1440,160 L0,160 Z"
                            />

                            {/* Gelombang Depan (Solid / Warna Utama) */}
                            {/* Menggunakan gradasi Matcha yang kamu minta saat Dark Mode */}
                            <path
                                className="fill-cream-50 dark:fill-gradient-to-r dark:from-matcha-950 dark:via-matcha-900 dark:to-matcha-800"
                                d="M0,130 C280,90 440,160 760,120 C1080,80 1240,140 1440,110 L1440,160 L0,160 Z"
                            />
                        </svg>
                    </div>
                </section>

                {/* kategori dan produk */}
                <Products categories={categories} products={products} />

                {/* ============ CTA PROMO ============ */}
                <div
                    className="mb-14 flex flex-col items-center justify-between gap-4 rounded-3xl
                               bg-matcha-50 p-8 shadow-sm dark:bg-matcha-900/50 sm:flex-row"
                >
                    <div className="text-center sm:text-left">
                        <h3 className="text-lg font-semibold text-matcha-900 dark:text-cream-50">
                            Diskon 20% untuk pesanan pertamamu
                        </h3>
                        <p className="mt-1 text-sm text-matcha-600 dark:text-cream-400">
                            Gunakan kode{" "}
                            <span className="font-semibold">MATCHA20</span> saat
                            checkout
                        </p>
                    </div>
                    <button
                        className="shrink-0 rounded-full bg-matcha-900 px-6 py-2.5 text-sm font-semibold
                                   text-cream-50 shadow-md transition-colors hover:bg-matcha-800
                                   dark:bg-foam-500 dark:text-matcha-900 dark:hover:bg-foam-400"
                    >
                        Pesan Sekarang
                    </button>
                </div>

                {/* ============ ULASAN PELANGGAN ============ */}
                <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <h2 className="mb-1 text-2xl font-bold text-matcha-900 dark:text-cream-50">
                            Ulasan Pelanggan
                        </h2>
                        <p className="mb-6 text-sm text-matcha-600 dark:text-cream-400">
                            Apa kata mereka yang sudah mencoba
                        </p>
                        <DaftarUlasan ulasan={contohUlasan} />
                    </div>

                    <div className="lg:col-span-1">
                        <UlasanForm />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

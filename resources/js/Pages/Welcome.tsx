import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import { Flame, Star, LayoutGrid, Sparkles, Leaf } from "lucide-react";
import { FaSearch, FaSlidersH } from "react-icons/fa";
import UlasanForm from "@/Components/users/UlasanForm";
import DaftarUlasan, { Ulasan } from "@/Components/users/DaftarUlasan";

// Contoh data ulasan — nanti ganti dengan props dari controller Laravel
// misal: export default function Welcome({ ulasan }: { ulasan: Ulasan[] })
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

interface Menu {
    nama: string;
    deskripsi: string;
    harga: number;
    gambar: string;
    kategori: string;
    badge?: string;
    rating?: number;
}

const kategoriList = ["Semua", "Makanan Berat", "Cepat Saji", "Jepang"];

const menus: Menu[] = [
    {
        nama: "Pizza Margherita",
        deskripsi: "Keju mozzarella, tomat segar, basil",
        harga: 85000,
        gambar: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=400&fit=crop",
        kategori: "Makanan Berat",
        badge: "Best Seller",
        rating: 4.8,
    },
    {
        nama: "Burger Classic",
        deskripsi: "Daging sapi, keju, sayuran segar",
        harga: 55000,
        gambar: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=500&h=400&fit=crop",
        kategori: "Cepat Saji",
        rating: 4.6,
    },
    {
        nama: "Sushi Roll",
        deskripsi: "Salmon, avocado, nori, nasi",
        harga: 75000,
        gambar: "https://images.unsplash.com/photo-1560717845-968823efbee1?w=500&h=400&fit=crop",
        kategori: "Jepang",
        badge: "Baru",
        rating: 4.9,
    },
];

const formatRupiah = (angka: number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(angka);

export default function Welcome() {
    const [kategoriAktif, setKategoriAktif] = useState("Semua");
    const [searchQuery, setSearchQuery] = useState("");

    const getIconKategori = (kategori: string) => {
        switch (kategori) {
            case "Semua":
                return <LayoutGrid className="h-4 w-4" />;
            case "Makanan Berat":
                return <Flame className="h-4 w-4" />;
            case "Cepat Saji":
                return <Sparkles className="h-4 w-4" />;
            case "Jepang":
                return <Leaf className="h-4 w-4" />;
            default:
                return <LayoutGrid className="h-4 w-4" />;
        }
    };

    const menuTersaring =
        kategoriAktif === "Semua"
            ? menus
            : menus.filter((m) => m.kategori === kategoriAktif);

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

                {/* ============ FILTER KATEGORI ============ */}
                <div className="w-full max-w-4xl mx-auto px-4">
                    {/* CONTAINER UTAMA (Glassmorphism & Menimpa Hero Section)
              -mt-12 membuat container ini naik ke atas menimpa section di atasnya
            */}
                    <div
                        className="relative -mt-14 z-10 rounded-3xl border border-white/20 dark:border-matcha-800/30 
                            bg-white/40 dark:bg-matcha-950/40 backdrop-blur-xl shadow-xl p-6
                            dark:shadow-black/40 transition-all duration-300"
                    >
                        {/* 1. KATEGORI (Dibuat ke Tengah) */}
                        <div className="flex justify-center w-full">
                            <div className="flex gap-2 overflow-x-auto pb-2 max-w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                {kategoriList.map((kategori) => {
                                    const aktif = kategori === kategoriAktif;
                                    return (
                                        <button
                                            key={kategori}
                                            onClick={() =>
                                                setKategoriAktif(kategori)
                                            }
                                            className={`shrink-0 flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium
                                               transition-all duration-300 ${
                                                   aktif
                                                       ? "bg-matcha-500 text-cream-50 shadow-md shadow-matcha-500/30"
                                                       : "bg-white/80 text-matcha-600 shadow-sm hover:shadow-md hover:bg-white dark:bg-matcha-900/80 dark:text-cream-300 dark:shadow-black/20 dark:hover:bg-matcha-800"
                                               }`}
                                        >
                                            {/* Icon Lucide React */}
                                            <span
                                                className={
                                                    aktif
                                                        ? "text-cream-50"
                                                        : "text-matcha-500 dark:text-matcha-400"
                                                }
                                            >
                                                {getIconKategori(kategori)}
                                            </span>
                                            {kategori}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Garis Pembatas Tipis */}
                        <div className="my-4 border-t border-white/20 dark:border-matcha-800/20" />

                        {/* 3. ELEMENT SEARCH (Berfungsi & Responsive) */}
                        <div className="relative w-full max-w-2xl mx-auto">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-matcha-400 dark:text-matcha-500">
                                {/* Icon dari React Icons (FaSearch) */}
                                <FaSearch className="h-4 w-4" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={`Cari sesuatu di kategori ${kategoriAktif}...`}
                                className="w-full pl-11 pr-12 py-3.5 bg-white/90 dark:bg-matcha-900/90 
                                   text-matcha-950 dark:text-cream-100 placeholder-matcha-400 dark:placeholder-matcha-500
                                   rounded-2xl border border-white/40 dark:border-matcha-800/40
                                   shadow-inner focus:outline-none focus:ring-2 focus:ring-matcha-500/50 
                                   transition-all duration-200 text-sm"
                            />
                            {/* Aksen tombol filter kecil di ujung kanan input (Opsional biar makin keren) */}
                            <button className="absolute inset-y-0 right-0 flex items-center pr-4 text-matcha-500 hover:text-matcha-600 dark:text-matcha-400 dark:hover:text-matcha-300">
                                <FaSlidersH className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ============ DAFTAR MENU ============ */}
                <div className="mt-8 mb-14">
                    <div className="mb-8 flex items-end justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-matcha-900 dark:text-cream-50">
                                Menu Kami
                            </h2>
                            <p className="mt-1 text-sm text-matcha-600 dark:text-cream-400">
                                Pilihan favorit pelanggan kami
                            </p>
                        </div>
                        <a
                            href="/menu"
                            className="hidden text-sm font-medium text-matcha-600 transition-colors
                       hover:text-matcha-500 dark:text-foam-400 dark:hover:text-foam-300 sm:block"
                        >
                            Lihat semua menu →
                        </a>
                    </div>

                    {/* Grid 2 Kolom dari Mobile sampai Desktop */}
                    <div className="grid grid-cols-2 gap-y-10 gap-x-4 sm:gap-x-8 lg:gap-x-12">
                        {menuTersaring.map((menu, index) => (
                            <div
                                key={menu.nama}
                                className="group flex gap-3 items-center transition-all duration-300
                           odd:flex-row even:flex-row-reverse
                           lg:gap-6 lg:flex-row lg:odd:flex-row lg:even:flex-row-reverse lg:even:pt-12"
                            >
                                {/* 1. SEKTOR GAMBAR */}
                                <div
                                    className="relative h-20 w-20 shrink-0 overflow-hidden bg-matcha-100 dark:bg-matcha-800 
                                xs:h-24 xs:w-24 sm:h-32 sm:w-32 lg:h-72 lg:w-1/2
                                rounded-[1.2rem_0.4rem_1.2rem_0.4rem] lg:rounded-[3rem_1rem_3rem_1rem] 
                                group-hover:rounded-[0.4rem_1.2rem_0.4rem_1.2rem] lg:group-hover:rounded-[1rem_3rem_1rem_3rem] 
                                transition-all duration-500 shadow-sm lg:shadow-xl"
                                >
                                    <img
                                        src={menu.gambar}
                                        alt={menu.nama}
                                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                    />

                                    {menu.rating && (
                                        <span className="absolute right-0.5 top-0.5 flex items-center gap-0.5 rounded-full bg-white/90 px-1 py-0.5 text-[9px] font-bold text-matcha-800 shadow-sm backdrop-blur-sm dark:bg-matcha-950/80 dark:text-cream-100 lg:right-4 lg:top-4 lg:px-2.5 lg:py-1 lg:text-xs">
                                            <Star
                                                size={8}
                                                className="fill-foam-500 text-foam-500 lg:w-3 lg:h-3"
                                            />
                                            {menu.rating}
                                        </span>
                                    )}
                                </div>

                                {/* 2. SEKTOR TEKS */}
                                <div className="flex w-full flex-col justify-center lg:w-1/2">
                                    <div>
                                        <h3 className="text-xs font-bold text-matcha-900 dark:text-cream-50 line-clamp-1 group-hover:text-matcha-500 dark:group-hover:text-foam-400 transition-colors sm:text-sm lg:mt-1 lg:mb-2 lg:text-xl">
                                            {menu.nama}
                                        </h3>
                                        <p className="mt-0.5 mb-1 text-[10px] leading-relaxed text-matcha-600 dark:text-cream-400 line-clamp-1 sm:text-xs lg:mb-4 lg:text-sm lg:line-clamp-3">
                                            {menu.deskripsi}
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-start gap-1 border-t border-matcha-100 dark:border-matcha-800/50 pt-1 xs:flex-row xs:items-center xs:justify-between lg:pt-3">
                                        <span className="text-xs font-extrabold text-matcha-700 dark:text-foam-400 sm:text-sm lg:text-lg">
                                            {formatRupiah(menu.harga)}
                                        </span>
                                        <button
                                            className="rounded-full bg-matcha-500 px-2.5 py-0.5 text-[10px] font-semibold
                                       text-cream-50 shadow-sm transition-all duration-200 
                                       hover:bg-matcha-600 active:scale-95 sm:px-3 sm:py-1 sm:text-xs lg:px-5 lg:py-2 lg:text-sm"
                                        >
                                            + Pesan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {menuTersaring.length === 0 && (
                        <div className="rounded-3xl border border-dashed border-matcha-200 bg-white/50 py-16 text-center dark:border-matcha-800 dark:bg-matcha-900/30">
                            <p className="text-sm text-matcha-500 dark:text-cream-400">
                                Belum ada menu di kategori ini.
                            </p>
                        </div>
                    )}

                    <div className="mt-12 text-center sm:hidden">
                        <a
                            href="/menu"
                            className="text-sm font-medium text-matcha-600 dark:text-foam-400"
                        >
                            Lihat semua menu →
                        </a>
                    </div>
                </div>
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

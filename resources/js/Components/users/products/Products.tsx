import { useState } from "react";
import { Coffee, Cookie, LayoutGrid, CakeSlice, Leaf } from "lucide-react";
import { FaSearch, FaSlidersH } from "react-icons/fa";
import { useCart } from "@/Contexts/CartContext";
import { toast } from "react-hot-toast";

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
    description: string | null;
    price: number;
    stock: number;
    image: string;
    is_featured: boolean;
    is_available: boolean;
    category: Category;
}

interface ProductsProps {
    categories: Category[];
    products: Product[];
}

const iconMap = {
    Leaf,
    Coffee,
    Cookie,
    CakeSlice,
    LayoutGrid,
} as const;

const formatRupiah = (angka: number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(angka);

export default function Products({ categories, products }: ProductsProps) {
    const [kategoriAktif, setKategoriAktif] = useState("semua");
    const [searchQuery, setSearchQuery] = useState("");

    const { addToCart } = useCart();

    const kategoriList: Category[] = [
        {
            id: 0,
            name: "Semua",
            slug: "semua",
            icon: null,
        },
        ...categories,
    ];

    const menuTersaring = products.filter((product) => {
        const cocokKategori =
            kategoriAktif === "semua" ||
            product.category.slug === kategoriAktif;

        const cocokSearch = product.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

        return cocokKategori && cocokSearch;
    });

    const handleTambahKeKeranjang = (product: Product) => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            qty: 1,
        });

        // Pemicu Toast Kustom dengan tema Matcha & Cream
        toast.success(`${product.name} berhasil ditambahkan!`, {
            style: {
                borderRadius: '1rem',
                background: typeof window !== 'undefined' && document.documentElement.classList.contains('dark') 
                    ? '#1c2e24' // Warna matcha-950 saat dark mode
                    : '#fff',
                color: typeof window !== 'undefined' && document.documentElement.classList.contains('dark') 
                    ? '#fcfbf7' // Warna cream-50 saat dark mode
                    : '#2d4a3a', // Warna matcha-900 saat light mode
                fontSize: '14px',
                fontWeight: '500',
                border: '1px solid rgba(45, 74, 58, 0.1)',
            },
            iconTheme: {
                primary: '#4c7a60', // Warna matcha-500 untuk icon check
                secondary: '#fcfbf7',
            },
        });
    };

    return (
        <>
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
                            {kategoriList.map((category) => {
                                const aktif = category.slug === kategoriAktif;
                                const Icon =
                                    category.icon && category.icon in iconMap
                                        ? iconMap[
                                              category.icon as keyof typeof iconMap
                                          ]
                                        : LayoutGrid;
                                return (
                                    <button
                                        key={category.id}
                                        onClick={() =>
                                            setKategoriAktif(category.slug)
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
                                            <Icon className="h-4 w-4" />
                                        </span>
                                        {category.icon}
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
                    {menuTersaring.map((product) => (
                        <div
                            key={product.id}
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
                                    src={`storage/${product.image}`}
                                    alt={product.name}
                                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                />

                                {/* {product.rating && (
                                    <span className="absolute right-0.5 top-0.5 flex items-center gap-0.5 rounded-full bg-white/90 px-1 py-0.5 text-[9px] font-bold text-matcha-800 shadow-sm backdrop-blur-sm dark:bg-matcha-950/80 dark:text-cream-100 lg:right-4 lg:top-4 lg:px-2.5 lg:py-1 lg:text-xs">
                                        <Star
                                            size={8}
                                            className="fill-foam-500 text-foam-500 lg:w-3 lg:h-3"
                                        />
                                        {product.rating}
                                    </span>
                                )} */}
                            </div>

                            {/* 2. SEKTOR TEKS */}
                            <div className="flex w-full flex-col justify-center lg:w-1/2">
                                <div>
                                    <h3 className="text-xs font-bold text-matcha-900 dark:text-cream-50 line-clamp-1 group-hover:text-matcha-500 dark:group-hover:text-foam-400 transition-colors sm:text-sm lg:mt-1 lg:mb-2 lg:text-xl">
                                        {product.name}
                                    </h3>
                                    <p className="mt-0.5 mb-1 text-[10px] leading-relaxed text-matcha-600 dark:text-cream-400 line-clamp-1 sm:text-xs lg:mb-4 lg:text-sm lg:line-clamp-3">
                                        {product.description}
                                    </p>
                                </div>

                                <div className="flex flex-col items-start gap-1 border-t border-matcha-100 dark:border-matcha-800/50 pt-1 xs:flex-row xs:items-center xs:justify-between lg:pt-3">
                                    <span className="text-xs font-extrabold text-matcha-700 dark:text-foam-400 sm:text-sm lg:text-lg">
                                        {formatRupiah(product.price)}
                                    </span>
                                    <button
                                        onClick={() => handleTambahKeKeranjang(product)}
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
        </>
    );
}

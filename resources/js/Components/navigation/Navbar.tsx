import { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
import { ShoppingBag } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

import { useCart } from "@/Contexts/CartContext";

interface NavbarProps {
    cartOpen: boolean;
    setCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface NavItem {
    label: string;
    href: string;
}

export default function Navbar({ cartOpen, setCartOpen }: NavbarProps) {
    const [hasActiveOrder, setHasActiveOrder] = useState(false);

    const { cart } = useCart();

    const cartCount = cart.reduce((total, item) => total + item.qty, 0);

    useEffect(() => {
        // 1. Cek pertama kali saat halaman dimuat
        const activeOrder = localStorage.getItem("active_order_id");
        setHasActiveOrder(!!activeOrder);

        // 2. Dengarkan jika ada perubahan localStorage (misal dari komponen CartDrawer saat sukses submit)
        const handleStorageChange = () => {
            setHasActiveOrder(!!localStorage.getItem("active_order_id"));
        };

        // Buat custom event listener agar perubahan instan dalam satu tab yang sama terdeteksi
        window.addEventListener("storage", handleStorageChange);
        window.addEventListener("local-storage-update", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener(
                "local-storage-update",
                handleStorageChange,
            );
        };
    }, []);

    const navItems: NavItem[] = [
        { label: "Beranda", href: "/" },
        { label: "Menu", href: "/menu" },
        { label: "Pesanan", href: "/pesanan" },
        { label: "Tentang", href: "/tentang" },
    ];

    return (
        <header className="sticky top-4 z-50 flex justify-center px-4">
            <div
                className="
                    w-full
                    max-w-7xl
                    rounded-2xl
                    border border-white/20
                    bg-white/70
                    shadow-xl
                    backdrop-blur-2xl
                    transition-all
                    dark:border-white/10
                    dark:bg-matcha-900/70
                "
            >
                <div className="flex h-16 items-center justify-between px-6">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-matcha-500 font-bold text-white shadow-md">
                            桜
                        </div>

                        <div>
                            <h1 className="text-lg font-bold text-matcha-900 dark:text-white">
                                Matcha House
                            </h1>
                            <p className="text-xs text-matcha-500 dark:text-matcha-300">
                                Fresh Everyday
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <nav className="hidden items-center gap-8 md:flex">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                // 💡 PERBAIKAN: Tambahkan class 'relative' di awal string className ini!
                                className="relative text-sm font-medium text-matcha-700 transition hover:text-matcha-500 dark:text-matcha-100 dark:hover:text-foam-400"
                            >
                                {item.label}
                                {item.label === "Pesanan" && hasActiveOrder && (
                                    <span className="absolute -right-2.5 top-0 flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                    </span>
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Right */}
                    <div className="flex items-center gap-2">
                        <ThemeToggle />

                        {/* Cart */}
                        <button
                            className="
                                relative
                                flex h-10 w-10 items-center justify-center
                                rounded-full
                                hover:bg-matcha-100
                                dark:hover:bg-matcha-800
                            "
                            onClick={() => setCartOpen(!cartOpen)}
                        >
                            <ShoppingBag
                                size={20}
                                className="text-matcha-700 dark:text-white"
                            />

                            {cartCount > 0 && (
                                <span
                                    className="
                                        absolute
                                        -right-1
                                        -top-1
                                        flex
                                        h-5
                                        w-5
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-red-500
                                        text-[10px]
                                        font-bold
                                        text-white
                                    "
                                >
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion, Variants } from 'framer-motion';
import { 
    ChevronLeft, 
    ChevronRight, 
    LayoutDashboard, 
    ShoppingBag, 
    Coffee, 
    FolderOpen, 
    Users, 
    BarChart3, 
    Settings, 
    LogOut 
} from 'lucide-react';

interface SidebarItem {
    label: string;
    icon: any;
    href: string;
}

export default function AdminSidebar() {
    // State untuk mode hemat ruang / diperlebar (collapsed)
    const [isCollapsed, setIsCollapsed] = useState(false);
    
    // Mengambil URL aktif saat ini untuk mendeteksi menu aktif
    const { url } = usePage();

    // Daftar menu lengkap admin (TETAP PERSIS SESUAI REQUESMU)
    const menuItems: SidebarItem[] = [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
        { label: 'Pesanan Dapur', icon: ShoppingBag, href: '/admin/orders' },
        { label: 'Manajemen Menu', icon: Coffee, href: '/admin/products' },
        { label: 'Kategori', icon: FolderOpen, href: '/admin/categories' },
        { label: 'Pelanggan', icon: Users, href: '/admin/customers' },
        { label: 'Laporan Keuangan', icon: BarChart3, href: '/admin/reports' },
        { label: 'Pengaturan', icon: Settings, href: '/profile' },
    ];

    // Varian Animasi Kontainer Utama Sidebar menggunakan Framer Motion
    const sidebarVariants: Variants = {
        expanded: { width: '260px', transition: { type: 'spring', stiffness: 300, damping: 30 } },
        collapsed: { width: '80px', transition: { type: 'spring', stiffness: 300, damping: 30 } },
    };

    // Varian Animasi Text Label Menu
    const textVariants: Variants = {
        expanded: { opacity: 1, x: 0, display: 'block', transition: { delay: 0.1 } },
        collapsed: { opacity: 0, x: -10, transitionEnd: { display: 'none' } },
    };

    return (
        <motion.div
            animate={isCollapsed ? 'collapsed' : 'expanded'}
            variants={sidebarVariants}
            // 💡 PERBAIKAN: Menambahkan 'sticky top-0 z-50 shrink-0' agar posisi sidebar terkunci saat scroll
            className="sticky top-0 z-50 flex h-screen shrink-0 flex-col border-r border-matcha-100 bg-white p-4 shadow-sm dark:border-matcha-800 dark:bg-matcha-950"
        >
            {/* Header Sidebar: Logo & Nama Apps */}
            <div className="flex h-12 items-center justify-between px-2 mb-6">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-matcha-500 text-cream-50 shadow-md shadow-matcha-500/20">
                        <Coffee size={22} />
                    </div>
                    {!isCollapsed && (
                        <motion.span 
                            variants={textVariants}
                            className="text-lg font-bold tracking-wide text-matcha-900 dark:text-cream-50 whitespace-nowrap"
                        >
                            Matcha<span className="text-matcha-500">House</span>
                        </motion.span>
                    )}
                </div>
            </div>

            {/* Tombol Toggle Buka-Tutup (Floating Button) */}
            <button
                type="button"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-7 flex h-6 w-6 items-center justify-center rounded-full border border-matcha-200 bg-white text-matcha-600 shadow-md transition-colors hover:bg-matcha-50 dark:border-matcha-700 dark:bg-matcha-900 dark:text-cream-300 dark:hover:bg-matcha-800"
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Bagian List Menu Item Navigasi */}
            {/* 💡 PERBAIKAN: Menambahkan 'overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]' */}
            {/* Supaya jika list menu sangat banyak, dia bisa di-scroll internal tanpa merusak tata letak luarnya */}
            <nav className="flex-1 space-y-1.5 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {menuItems.map((item, index) => {
                    const isActive = url.startsWith(item.href);
                    
                    return (
                        <Link
                            key={index}
                            href={item.href}
                            className={`group relative flex h-12 items-center gap-3.5 rounded-xl px-3 text-sm font-medium transition-all ${
                                isActive
                                    ? 'bg-matcha-500 text-cream-50 shadow-md shadow-matcha-500/10'
                                    : 'text-matcha-600 hover:bg-matcha-50 dark:text-cream-300 dark:hover:bg-matcha-900/60'
                            }`}
                        >
                            {/* Icon Menu */}
                            <item.icon 
                                size={20} 
                                className={`shrink-0 transition-transform group-hover:scale-105 ${
                                    isActive ? 'text-cream-50' : 'text-matcha-500 dark:text-foam-400'
                                }`}
                            />

                            {/* Label Menu Beranimasi */}
                            {!isCollapsed && (
                                <motion.span variants={textVariants} className="whitespace-nowrap">
                                    {item.label}
                                </motion.span>
                            )}

                            {/* Tooltip Kustom saat Sidebar sedang ciut / Collapsed */}
                            {isCollapsed && (
                                <div className="pointer-events-none absolute left-20 z-50 rounded-lg bg-matcha-900 px-2.5 py-1.5 text-xs text-cream-50 opacity-0 shadow-xl transition-opacity group-hover:opacity-100 dark:bg-cream-100 dark:text-matcha-950">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Sidebar: Tombol Logout Akun */}
            <div className="border-t border-matcha-100 pt-3 dark:border-matcha-800">
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="flex h-12 w-full items-center gap-3.5 rounded-xl px-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                >
                    <LogOut size={20} className="shrink-0" />
                    {!isCollapsed && (
                        <motion.span variants={textVariants} className="whitespace-nowrap">
                            Keluar Sistem
                        </motion.span>
                    )}
                </Link>
            </div>
        </motion.div>
    );
}
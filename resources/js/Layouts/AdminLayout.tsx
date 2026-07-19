import { PropsWithChildren, ReactNode } from 'react';
import { usePage } from '@inertiajs/react';
import { Bell, Search } from 'lucide-react';
import AdminSidebar from '@/Components/admin/navigation/AdminSidebar';
import ThemeToggle from '@/Components/navigation/ThemeToggle';

export default function AdminLayout({
    children,
    header,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth } = usePage().props as any;

    return (
        <div className="flex min-h-screen bg-matcha-50/40 dark:bg-matcha-950">
            {/* Sidebar kamu sendiri yang atur lebar & animasi collapse-nya */}
            <AdminSidebar />

            {/* min-w-0 PENTING: tanpa ini, konten (tabel/teks panjang) bisa mendorong
                lebar flex-item melebihi ruang yang tersisa dan bikin layout overflow
                horizontal, terutama saat sidebar dalam mode expanded (260px) */}
            <div className="flex min-w-0 flex-1 flex-col">
                {/* ============ TOPBAR ============ */}
                <header
                    className="sticky top-0 z-20 flex h-20 items-center gap-4 border-b
                               border-matcha-100 bg-white/90 px-4 backdrop-blur-md
                               dark:border-matcha-800 dark:bg-matcha-950/90 sm:px-6"
                >
                    <div
                        className="flex max-w-md flex-1 items-center gap-2 rounded-2xl border border-matcha-100
                                   bg-matcha-50/60 px-4 py-2.5 focus-within:border-matcha-300
                                   dark:border-matcha-800 dark:bg-matcha-900"
                    >
                        <Search size={16} className="shrink-0 text-matcha-400" />
                        <input
                            type="text"
                            placeholder="Cari pesanan, menu, atau pelanggan..."
                            className="w-full truncate bg-transparent text-sm text-matcha-900
                                       placeholder:text-matcha-400 outline-none dark:text-cream-50"
                        />
                        <kbd className="hidden shrink-0 rounded-md border border-matcha-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-matcha-400 dark:border-matcha-700 dark:bg-matcha-800 dark:text-cream-500 sm:block">
                            ⌘F
                        </kbd>
                    </div>

                    <div className="ml-auto flex items-center gap-2 sm:gap-3">
                        <ThemeToggle />

                        <button
                            className="relative flex h-10 w-10 items-center justify-center rounded-full
                                       text-matcha-600 hover:bg-matcha-100 dark:text-cream-200 dark:hover:bg-matcha-800"
                        >
                            <Bell size={18} />
                            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-foam-500 ring-2 ring-white dark:ring-matcha-950" />
                        </button>

                        <div className="flex items-center gap-2.5 rounded-full border border-matcha-100 py-1.5 pl-1.5 pr-3 dark:border-matcha-800">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-matcha-500 text-xs font-semibold text-cream-50">
                                {auth?.user?.name?.[0]?.toUpperCase() ?? 'A'}
                            </span>
                            <div className="hidden leading-tight sm:block">
                                <p className="text-sm font-semibold text-matcha-900 dark:text-cream-50">
                                    {auth?.user?.name ?? 'Admin'}
                                </p>
                                <p className="text-xs text-matcha-400 dark:text-cream-500">
                                    {auth?.user?.email ?? 'admin@matchahouse.id'}
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {header && (
                    <div className="border-b border-matcha-100 bg-white/50 px-4 py-4 dark:border-matcha-800 dark:bg-matcha-900/30 sm:px-6">
                        {header}
                    </div>
                )}

                <main className="min-w-0 flex-1 p-4 sm:p-6">{children}</main>
            </div>
        </div>
    );
}
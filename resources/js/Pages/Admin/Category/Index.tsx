import React, { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Plus, Edit, Trash2, Layers, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";

interface Category {
    id: number;
    name: string;
    slug: string;
    icon: string | null;
    is_active: boolean;
    products_count?: number;
}

interface Props {
    categories: Category[];
}

export default function CategoryIndex({ categories }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    // Form Inertia disesuaikan dengan field model
    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            name: "",
            icon: "",
            is_active: true as boolean,
        });

    const openCreateModal = () => {
        setEditingCategory(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (category: Category) => {
        setEditingCategory(category);
        setData({
            name: category.name,
            icon: category.icon || "",
            is_active: Boolean(category.is_active),
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingCategory) {
            put(`/admin/categories/${editingCategory.id}`, {
                onSuccess: () => {
                    toast.success("Kategori berhasil diperbarui!");
                    setIsModalOpen(false);
                    reset();
                },
                onError: () => toast.error("Gagal memperbarui kategori."),
            });
        } else {
            post("/admin/categories", {
                onSuccess: () => {
                    toast.success("Kategori berhasil ditambahkan!");
                    setIsModalOpen(false);
                    reset();
                },
                onError: () => toast.error("Gagal menambahkan kategori."),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
            router.delete(`/admin/categories/${id}`, {
                onSuccess: () => toast.success("Kategori berhasil dihapus!"),
                onError: (err: any) => {
                    // Menangkap pesan error dari controller (misal: masih ada produk)
                    toast.error(err.error || "Gagal menghapus kategori.");
                },
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Kelola Kategori" />

            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-matcha-900 dark:text-cream-50">
                            Kelola Kategori Menu
                        </h1>
                        <p className="text-sm text-matcha-600 dark:text-cream-300">
                            Atur pengelompokan menu kafe kamu di sini.
                        </p>
                    </div>

                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 rounded-xl bg-matcha-600 px-4 py-2.5 text-sm font-semibold text-matcha-900 shadow-sm hover:bg-matcha-700 transition-all active:scale-95 dark:text-cream-50 dark:bg-matcha-500"
                    >
                        <Plus size={18} />
                        Tambah Kategori
                    </button>
                </div>

                {/* Tabel Kategori */}
                {categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 text-center border border-matcha-100 dark:bg-matcha-900 dark:border-matcha-800 shadow-sm">
                        <Layers size={48} className="text-matcha-300 mb-3" />
                        <p className="text-matcha-500 font-medium">
                            Belum ada kategori yang dibuat.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-matcha-100 bg-white shadow-sm dark:bg-matcha-900 dark:border-matcha-800">
                        <table className="w-full text-left text-sm text-matcha-700 dark:text-cream-200">
                            <thead className="bg-matcha-50 text-xs uppercase text-matcha-800 dark:bg-matcha-950 dark:text-cream-300 border-b border-matcha-100 dark:border-matcha-800">
                                <tr>
                                    <th className="px-6 py-4">Nama Kategori</th>
                                    <th className="px-6 py-4">Icon</th>
                                    <th className="px-6 py-4">Jumlah Produk</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-matcha-100 dark:divide-matcha-800">
                                {categories.map((cat) => (
                                    <tr
                                        key={cat.id}
                                        className="hover:bg-matcha-50/50 dark:hover:bg-matcha-800/50 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-bold text-matcha-900 dark:text-cream-100">
                                            {cat.name}
                                            <span className="block text-xs font-normal text-matcha-500 font-mono">
                                                {cat.slug}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-matcha-600 dark:text-cream-300">
                                            {cat.icon ? (
                                                <span className="rounded-lg bg-matcha-100 px-2 py-1 text-xs font-mono dark:bg-matcha-800">
                                                    {cat.icon}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-matcha-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center rounded-full bg-matcha-50 px-2.5 py-0.5 text-xs font-medium text-matcha-700 dark:bg-matcha-950 dark:text-cream-300">
                                                {cat.products_count ?? 0} Produk
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {cat.is_active ? (
                                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-900">
                                                    <CheckCircle size={12} /> Aktif
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-900">
                                                    <XCircle size={12} /> Nonaktif
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-1">
                                            <button
                                                onClick={() => openEditModal(cat)}
                                                className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat.id)}
                                                className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                                                title="Hapus"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal Form Tambah/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-matcha-900 border border-matcha-100 dark:border-matcha-800">
                        <h2 className="text-lg font-bold text-matcha-900 dark:text-cream-50 mb-4">
                            {editingCategory ? "Edit Kategori" : "Tambah Kategori Baru"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-matcha-700 dark:text-cream-200 mb-1">
                                    Nama Kategori
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    placeholder="Contoh: Matcha Series"
                                    className="w-full rounded-xl border border-matcha-200 p-2.5 text-sm focus:border-matcha-500 focus:outline-none dark:bg-matcha-950 dark:border-matcha-700 dark:text-cream-100"
                                />
                                {errors.name && (
                                    <span className="text-xs text-rose-500 mt-1 block">
                                        {errors.name}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-matcha-700 dark:text-cream-200 mb-1">
                                    Icon (Opsional - Nama Lucide Icon)
                                </label>
                                <input
                                    type="text"
                                    value={data.icon}
                                    onChange={(e) => setData("icon", e.target.value)}
                                    placeholder="Contoh: Coffee"
                                    className="w-full rounded-xl border border-matcha-200 p-2.5 text-sm focus:border-matcha-500 focus:outline-none dark:bg-matcha-950 dark:border-matcha-700 dark:text-cream-100"
                                />
                                {errors.icon && (
                                    <span className="text-xs text-rose-500 mt-1 block">
                                        {errors.icon}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-matcha-700 dark:text-cream-200 mb-1">
                                    Status Kategori
                                </label>
                                <select
                                    value={data.is_active ? "1" : "0"}
                                    onChange={(e) =>
                                        setData("is_active", e.target.value === "1")
                                    }
                                    className="w-full rounded-xl border border-matcha-200 p-2.5 text-sm focus:border-matcha-500 focus:outline-none dark:bg-matcha-950 dark:border-matcha-700 dark:text-cream-100"
                                >
                                    <option value="1">Aktif (Tampil di Menu)</option>
                                    <option value="0">Nonaktif (Sembunyikan)</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded-xl px-4 py-2 text-sm font-semibold text-matcha-600 hover:bg-matcha-50 dark:text-cream-300 dark:hover:bg-matcha-800"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-matcha-600 px-4 py-2 text-sm font-semibold text-white hover:bg-matcha-700 disabled:opacity-50"
                                >
                                    {processing ? "Menyimpan..." : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
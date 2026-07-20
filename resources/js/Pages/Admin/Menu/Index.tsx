import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Edit2, Trash2, Search, Coffee, X, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    price: number;
    description: string | null;
    image: string;
    category_id: number;
    category: Category;
}

interface ProductsProps {
    products: Product[];
    categories: Category[];
    filters: { search?: string; category_id?: string };
}

const formatRupiah = (angka: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

export default function Index({ products, categories, filters }: ProductsProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category_id || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);

    // Form handling bawaan Inertia
    const { data, setData, post, delete: destroy, reset, errors, processing } = useForm({
        name: '',
        category_id: '',
        price: '',
        description: '',
        image: null as File | null,
    });

    // Handle Pencarian & Filter
    const handleFilterChange = (searchVal: string, catVal: string) => {
        router.get('/admin/products', { search: searchVal, category_id: catVal }, { preserveState: true });
    };

    // Buka Modal untuk Tambah Menu
    const openAddModal = () => {
        setEditProduct(null);
        reset();
        setIsModalOpen(true);
    };

    // Buka Modal untuk Edit Menu
    const openEditModal = (product: Product) => {
        setEditProduct(product);
        setData({
            name: product.name,
            category_id: String(product.category_id),
            price: String(product.price),
            description: product.description || '',
            image: null,
        });
        setIsModalOpen(true);
    };

    // Submit Tambah / Edit Data
    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editProduct) {
        // 💡 CARA BENAR: Tambahkan properti _method secara manual ke dalam form data menggunakan setData
        // Atau buat FormData baru. Tapi cara paling instan di Inertia useForm adalah seperti ini:
        
        // Kita paksa kirim data tambahan '_method: PATCH' langsung lewat parameter query / gabungan object
        router.post(`/admin/products/${editProduct.id}`, {
            ...data,
            _method: 'PATCH', // Laravel akan membaca ini sebagai request PATCH
        } as any, {
            onSuccess: () => {
                toast.success('Menu berhasil diperbarui!');
                setIsModalOpen(false);
            },
            onError: (err) => {
                console.error(err);
                toast.error('Gagal memperbarui menu.');
            }
        });
    } else {
        // Tambah Data Baru (Tetap seperti biasa)
        post('/admin/products', {
            onSuccess: () => {
                toast.success('Menu baru berhasil ditambahkan!');
                setIsModalOpen(false);
                reset();
            },
        });
    }
};

    // Hapus Produk
    const handleDelete = (id: number, name: string) => {
        if (confirm(`Apakah kamu yakin ingin menghapus menu "${name}"?`)) {
            destroy(`/admin/products/${id}`, {
                onSuccess: () => toast.success('Menu berhasil dihapus!'),
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Menu" />

            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-matcha-900 dark:text-cream-50">Manajemen Menu Makanan</h1>
                        <p className="text-sm text-matcha-600 dark:text-cream-300">Atur menu, harga, gambar, dan kategori produk Matcha House.</p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="flex items-center justify-center gap-2 rounded-xl bg-matcha-500 px-4 py-2.5 text-sm font-semibold text-cream-50 shadow-md shadow-matcha-500/20 transition-all hover:bg-matcha-600 active:scale-98 self-start sm:self-center"
                    >
                        <Plus size={16} />
                        Tambah Menu
                    </button>
                </div>

                {/* Bar Filter & Cari */}
                <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl shadow-sm dark:bg-matcha-900">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-3 h-4 w-4 text-matcha-400" />
                        <input
                            type="text"
                            placeholder="Cari nama menu..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                handleFilterChange(e.target.value, selectedCategory);
                            }}
                            className="w-full rounded-xl border border-matcha-200 bg-cream-50/50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-matcha-400 dark:border-matcha-800 dark:bg-matcha-950"
                        />
                    </div>
                    <select
                        value={selectedCategory}
                        onChange={(e) => {
                            setSelectedCategory(e.target.value);
                            handleFilterChange(search, e.target.value);
                        }}
                        className="rounded-xl border border-matcha-200 bg-cream-50/50 px-4 py-2.5 text-sm outline-none focus:border-matcha-400 dark:border-matcha-800 dark:bg-matcha-950 dark:text-cream-50"
                    >
                        <option value="">Semua Kategori</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                {/* Tabel Data */}
                <div className="overflow-x-auto rounded-2xl bg-white shadow-sm dark:bg-matcha-900 border border-matcha-100 dark:border-matcha-800">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-matcha-100 bg-cream-50/50 text-xs font-bold uppercase tracking-wider text-matcha-700 dark:border-matcha-800 dark:bg-matcha-950/40 dark:text-cream-300">
                                <th className="p-4 w-20">Gambar</th>
                                <th className="p-4">Nama Menu</th>
                                <th className="p-4">Kategori</th>
                                <th className="p-4">Harga</th>
                                <th className="p-4">Deskripsi</th>
                                <th className="p-4 text-center w-28">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-matcha-100 dark:divide-matcha-800 text-sm">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-matcha-400">Tidak ada data menu ditemukan.</td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-cream-50/30 dark:hover:bg-matcha-800/20 transition-colors">
                                        <td className="p-4">
                                            <img src={`/storage/${product.image}`} alt={product.name} className="h-12 w-12 rounded-xl object-cover shadow-sm border border-matcha-100 dark:border-matcha-800" />
                                        </td>
                                        <td className="p-4 font-semibold text-matcha-900 dark:text-cream-50">{product.name}</td>
                                        <td className="p-4"><span className="rounded-lg bg-matcha-50 px-2 py-1 text-xs font-medium text-matcha-700 dark:bg-matcha-800 dark:text-cream-200">{product.category?.name}</span></td>
                                        <td className="p-4 font-medium text-matcha-800 dark:text-foam-400">{formatRupiah(product.price)}</td>
                                        <td className="p-4 text-xs text-matcha-500 truncate max-w-[200px]">{product.description || '-'}</td>
                                        <td className="p-4">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => openEditModal(product)} className="rounded-lg p-2 text-matcha-600 hover:bg-matcha-50 dark:text-cream-300 dark:hover:bg-matcha-800"><Edit2 size={16} /></button>
                                                <button onClick={() => handleDelete(product.id, product.name)} className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL OVERLAY (TAMBAH & EDIT) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-matcha-950/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    
                    <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-matcha-900 border border-matcha-100 dark:border-matcha-800">
                        <div className="flex items-center justify-between border-b border-matcha-100 pb-3 dark:border-matcha-800">
                            <h3 className="text-lg font-bold text-matcha-900 dark:text-cream-50">{editProduct ? 'Edit Menu' : 'Tambah Menu Baru'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-matcha-400 hover:text-matcha-600"><X size={18} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-matcha-700 dark:text-cream-200 mb-1">Nama Menu *</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} placeholder="Contoh: Matcha Latte Premium" className="w-full rounded-xl border border-matcha-200 bg-cream-50/30 px-3 py-2 text-sm outline-none focus:border-matcha-400 dark:border-matcha-700 dark:bg-matcha-800" required />
                                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-matcha-700 dark:text-cream-200 mb-1">Kategori *</label>
                                    <select value={data.category_id} onChange={e => setData('category_id', e.target.value)} className="w-full rounded-xl border border-matcha-200 bg-cream-50/30 px-3 py-2 text-sm outline-none focus:border-matcha-400 dark:border-matcha-700 dark:bg-matcha-800" required>
                                        <option value="">Pilih</option>
                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-matcha-700 dark:text-cream-200 mb-1">Harga (IDR) *</label>
                                    <input type="number" value={data.price} onChange={e => setData('price', e.target.value)} placeholder="25000" className="w-full rounded-xl border border-matcha-200 bg-cream-50/30 px-3 py-2 text-sm outline-none focus:border-matcha-400 dark:border-matcha-700 dark:bg-matcha-800" required />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-matcha-700 dark:text-cream-200 mb-1">Deskripsi Menu</label>
                                <textarea rows={2} value={data.description} onChange={e => setData('description', e.target.value)} placeholder="Tulis rincian komposisi/rasa menu..." className="w-full resize-none rounded-xl border border-matcha-200 bg-cream-50/30 px-3 py-2 text-sm outline-none focus:border-matcha-400 dark:border-matcha-700 dark:bg-matcha-800" />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-matcha-700 dark:text-cream-200 mb-1">Gambar Menu {editProduct && '(Kosongkan jika tidak diganti)'}</label>
                                <div className="relative flex items-center justify-center rounded-xl border border-dashed border-matcha-300 p-4 bg-cream-50/20 dark:border-matcha-700">
                                    <input type="file" onChange={e => setData('image', e.target.files ? e.target.files[0] : null)} className="absolute inset-0 opacity-0 cursor-pointer" required={!editProduct} />
                                    <div className="text-center text-xs text-matcha-500">
                                        <Upload className="mx-auto mb-1 h-5 w-5 text-matcha-400" />
                                        <span>{data.image ? data.image.name : 'Pilih atau drop file gambar'}</span>
                                    </div>
                                </div>
                                {errors.image && <p className="text-xs text-red-500 mt-1">{errors.image}</p>}
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 rounded-xl border border-matcha-200 py-2.5 text-sm font-semibold text-matcha-700 hover:bg-cream-50 dark:border-matcha-700 dark:text-cream-200">Batal</button>
                                <button type="submit" disabled={processing} className="flex-1 rounded-xl bg-matcha-500 py-2.5 text-sm font-semibold text-cream-50 hover:bg-matcha-600 disabled:opacity-50">{processing ? 'Menyimpan...' : 'Simpan Menu'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
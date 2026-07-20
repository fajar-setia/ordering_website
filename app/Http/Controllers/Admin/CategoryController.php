<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Tampilkan daftar kategori
     */
    public function index()
    {
        // Mengambil kategori terbaru beserta jumlah produk di dalamnya
        $categories = Category::withCount('products')->latest()->get();

        return Inertia::render('Admin/Category/Index', [
            'categories' => $categories
        ]);
    }

    /**
     * Simpan kategori baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'      => 'required|string|max:255|unique:categories,name',
            'icon'      => 'nullable|string|max:255', // Bisa diisi nama icon Lucide (misal: 'Coffee', 'CupSoda')
            'is_active' => 'required|boolean',
        ]);

        // Otomatis generate slug dari nama
        $validated['slug'] = Str::slug($validated['name']);

        Category::create($validated);

        return redirect()->back()->with('success', 'Kategori berhasil ditambahkan.');
    }

    /**
     * Perbarui data kategori
     */
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name'      => 'required|string|max:255|unique:categories,name,' . $id,
            'icon'      => 'nullable|string|max:255',
            'is_active' => 'required|boolean',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $category->update($validated);

        return redirect()->back()->with('success', 'Kategori berhasil diperbarui.');
    }

    /**
     * Hapus kategori
     */
    public function destroy($id)
    {
        $category = Category::findOrFail($id);

        // Opsional: Cek jika kategori masih memiliki produk sebelum dihapus
        if ($category->products()->count() > 0) {
            return redirect()->back()->with('error', 'Kategori tidak dapat dihapus karena masih memiliki produk.');
        }

        $category->delete();

        return redirect()->back()->with('success', 'Kategori berhasil dihapus.');
    }
}
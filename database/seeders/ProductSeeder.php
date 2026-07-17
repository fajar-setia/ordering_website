<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Product::insert([

            [
                'category_id' => 1,
                'name' => 'Matcha Latte',
                'slug' => 'matcha-latte',
                'description' => 'Minuman matcha premium dengan susu segar.',
                'price' => 28000,
                'stock' => 30,
                'image' => 'products/matcha-latte.jpg',
                'is_featured' => true,
                'is_available' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'category_id' => 1,
                'name' => 'Coffee Latte Art',
                'slug' => 'coffee-latte-art',
                'description' => 'Latte dengan desain khusus.',
                'price' => 32000,
                'stock' => 15,
                'image' => 'products/coffee-latte-art.jpg',
                'is_featured' => false,
                'is_available' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'category_id' => 2,
                'name' => 'Cappuccino-ice',
                'slug' => 'cappuccino-ice',
                'description' => 'Espresso dengan foam susu.',
                'price' => 30000,
                'stock' => 15,
                'image' => 'products/cappuccino-ice.jpg',
                'is_featured' => true,
                'is_available' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'category_id' => 3,
                'name' => 'Cheesecake',
                'slug' => 'cheesecake',
                'description' => 'Cheesecake lembut dengan topping buah.',
                'price' => 35000,
                'stock' => 10,
                'image' => 'products/cheesecake.jpg',
                'is_featured' => true,
                'is_available' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'category_id' => 4,
                'name' => 'French Fries',
                'slug' => 'french-fries',
                'description' => 'Kentang goreng renyah.',
                'price' => 22000,
                'stock' => 25,
                'image' => 'products/french-fries.jpg',
                'is_featured' => false,
                'is_available' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],

        ]);
    }
}

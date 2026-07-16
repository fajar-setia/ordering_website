import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    🛠️ Admin Dashboard
                </h2>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    
                    {/* Stats Admin */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <p className="text-gray-500 text-sm">Total Pesanan Hari Ini</p>
                            <p className="text-3xl font-bold text-indigo-600">24</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <p className="text-gray-500 text-sm">Pendapatan</p>
                            <p className="text-3xl font-bold text-green-600">Rp 2.450K</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <p className="text-gray-500 text-sm">Menu Aktif</p>
                            <p className="text-3xl font-bold text-blue-600">12</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <p className="text-gray-500 text-sm">User Terdaftar</p>
                            <p className="text-3xl font-bold text-purple-600">156</p>
                        </div>
                    </div>

                    {/* Daftar Pesanan */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Pesanan Terbaru</h3>
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ID</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Pelanggan</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Menu</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Total</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    <tr>
                                        <td className="px-4 py-3 text-sm">#001</td>
                                        <td className="px-4 py-3 text-sm">Budi</td>
                                        <td className="px-4 py-3 text-sm">Pizza Margherita x2</td>
                                        <td className="px-4 py-3 text-sm font-medium">Rp 170.000</td>
                                        <td className="px-4 py-3"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">Diproses</span></td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 text-sm">#002</td>
                                        <td className="px-4 py-3 text-sm">Ani</td>
                                        <td className="px-4 py-3 text-sm">Burger Classic x1</td>
                                        <td className="px-4 py-3 text-sm font-medium">Rp 55.000</td>
                                        <td className="px-4 py-3"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Selesai</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
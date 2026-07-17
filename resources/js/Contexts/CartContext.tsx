import {
    createContext,
    useContext,
    useState,
    ReactNode,
} from 'react';

export interface CartItem {
    id: number;
    name: string;
    price: number;
    image: string;
    qty: number;
}

interface CartContextType {
    cart: CartItem[];

    addToCart: (item: CartItem) => void;
    removeItem: (id: number) => void;
    increaseQty: (id: number) => void;
    decreaseQty: (id: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = (item: CartItem) => {
        setCart((old) => {
            const existing = old.find((i) => i.id === item.id);

            if (existing) {
                return old.map((i) =>
                    i.id === item.id ? { ...i, qty: i.qty + 1 } : i,
                );
            }

            return [...old, item];
        });
    };

    // Hapus item sepenuhnya dari cart, apapun jumlahnya
    const removeItem = (id: number) => {
        setCart((old) => old.filter((i) => i.id !== id));
    };

    // Tambah qty +1 untuk item tertentu
    const increaseQty = (id: number) => {
        setCart((old) =>
            old.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)),
        );
    };

    // Kurangi qty -1. Kalau qty jadi 0, item otomatis dibuang dari cart
    // (supaya tidak ada item "hantu" dengan qty 0 nangkring di keranjang)
    const decreaseQty = (id: number) => {
        setCart((old) =>
            old
                .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
                .filter((i) => i.qty > 0),
        );
    };

    // Kosongkan cart total, berguna setelah checkout berhasil
    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeItem,
                increaseQty,
                decreaseQty,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error('useCart harus berada di dalam CartProvider');
    }

    return context;
}
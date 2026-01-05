"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface CartItem {
    id: string; // Unikalne ID (np. slug + rozmiar)
    productSlug: string;
    name: string;
    price: number;
    currency: string;
    image: string;
    quantity: number;
    deliveryMethod?: string; // Aby zachować logikę z checkoutu
    paczkomatCode?: string;
}

interface CartContextType {
    items: CartItem[];
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // 1. Ładowanie z LocalStorage po uruchomieniu
    useEffect(() => {
        setIsMounted(true);
        const savedCart = localStorage.getItem("invsbl_cart");
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Błąd odczytu koszyka", e);
            }
        }
    }, []);

    // 2. Zapisywanie do LocalStorage przy każdej zmianie
    useEffect(() => {
        if (isMounted) {
            localStorage.setItem("invsbl_cart", JSON.stringify(items));
        }
    }, [items, isMounted]);

    const addItem = (newItem: CartItem) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.id === newItem.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, newItem];
        });
        setIsCartOpen(true); // Otwórz koszyk po dodaniu
    };

    const removeItem = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const clearCart = () => setItems([]);

    const cartTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                isCartOpen,
                openCart: () => setIsCartOpen(true),
                closeCart: () => setIsCartOpen(false),
                addItem,
                removeItem,
                clearCart,
                cartTotal,
                cartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};
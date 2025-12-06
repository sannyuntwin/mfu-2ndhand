'use client';

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/cart.context";

export function CartButton() {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <Link 
      href="/cart" 
      className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-orange-600 rounded-full">
          {itemCount}
        </span>
      )}
      <span className="sr-only">Shopping Cart</span>
    </Link>
  );
}
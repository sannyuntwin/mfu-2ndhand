'use client';

import { useState } from 'react';
import { useAuth } from '../../context/auth.context';
import { useRouter } from 'next/navigation';

interface AddToCartButtonProps {
  productId: number;
  className?: string;
}

export function AddToCartButton({ productId, className = '' }: AddToCartButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const addToCart = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ productId, quantity: 1 })
      });

      if (response.ok) {
        setMessage('Added to cart!');
        setTimeout(() => setMessage(''), 2000);
      } else {
        const error = await response.json();
        setMessage(error.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setMessage('Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <button
        onClick={addToCart}
        disabled={loading}
        className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 ${className}`}
      >
        {loading ? 'Adding...' : 'Add to Cart'}
      </button>
      {message && (
        <p className={`text-sm ${message.includes('Added') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
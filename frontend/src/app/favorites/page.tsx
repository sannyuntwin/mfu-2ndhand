'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/auth.context';
import { ProductCard } from '../../components/common/product-card';

interface FavoriteProduct {
  id: number;
  title: string;
  price: number;
  images: { url: string }[];
  condition: string;
  createdAt: string;
  seller: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
  };
  averageRating?: number;
  totalReviews?: number;
}

export default function FavoritesPage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = async () => {
    try {
      const response = await fetch('http://localhost:5000/favorites', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
      } else {
        setError('Failed to load favorites');
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      setError('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (productId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/favorites/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setFavorites(prev => prev.filter(fav => fav.id !== productId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your favorites.</p>
          <Link
            href="/auth/login"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favorites</h1>
        <p className="text-gray-600">
          {favorites.length > 0
            ? `You have ${favorites.length} favorite${favorites.length !== 1 ? 's' : ''}`
            : 'You haven\'t added any favorites yet'
          }
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">❤️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
          <p className="text-gray-600 mb-6">Start browsing and add some products to your favorites!</p>
          <Link
            href="/products"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard product={product} />
              <button
                onClick={() => removeFavorite(product.id)}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors z-10"
                title="Remove from favorites"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
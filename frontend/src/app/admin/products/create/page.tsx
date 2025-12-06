'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../../context/auth.context';
import { api } from '../../../../lib/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function CreateProductPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sellers, setSellers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    imageUrl: '',
    sellerId: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadSellers();
  }, []);

  const loadSellers = async () => {
    try {
      console.log('📡 Loading sellers via api...');
      const users = await api.get('/admin/users');
      console.log('✅ Sellers loaded:', users);
      const sellerUsers = users.filter((u: User) => u.role === 'SELLER');
      setSellers(sellerUsers);
    } catch (error) {
      console.error('❌ Error loading sellers:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    console.log('🚀 Starting upload for file:', selectedFile.name);
    setUploading(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', selectedFile);

      console.log('📡 Sending upload request via api.postForm...');
      const result = await api.postForm('/uploads/image', formDataUpload);
      console.log('✅ Upload result:', result);
      setFormData({ ...formData, imageUrl: result.url });
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('❌ Upload failed:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('📡 Creating product via api.post...');
      await api.post('/admin/products', {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        imageUrl: formData.imageUrl || undefined,
        sellerId: parseInt(formData.sellerId),
      });
      console.log('✅ Product created successfully');
      router.push('/admin/products');
    } catch (error) {
      console.error('❌ Error creating product:', error);
      alert('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Only administrators can create products.</p>
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/admin/products"
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Products
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
        <p className="text-gray-600 mt-2">Add a new product to the marketplace</p>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Product Title *
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter product title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter product description"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price ($) *
            </label>
            <input
              type="number"
              id="price"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
            />
          </div>

         <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">
             Product Image
           </label>
           <div className="space-y-4">
             <input
               type="file"
               accept="image/*"
               onChange={handleFileChange}
               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
             />

             {selectedFile && (
               <div className="flex gap-2">
                 <button
                   type="button"
                   onClick={uploadImage}
                   disabled={uploading}
                   className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                 >
                   {uploading ? 'Uploading...' : 'Upload Image'}
                 </button>
                 <span className="text-sm text-gray-600 self-center">
                   {selectedFile.name}
                 </span>
               </div>
             )}

             {imagePreview && (
               <div className="mt-2">
                 <img
                   src={imagePreview}
                   alt="Preview"
                   className="w-32 h-32 object-cover rounded-md border border-gray-300"
                 />
               </div>
             )}

             {formData.imageUrl && (
               <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                 <p className="text-sm text-green-600 font-medium mb-2">✓ Image uploaded successfully</p>
                 <div className="flex items-center gap-4">
                   <img
                     src={formData.imageUrl}
                     alt="Uploaded product image"
                     className="w-24 h-24 object-cover rounded-md border border-gray-300"
                   />
                   <div className="flex-1">
                     <input
                       type="url"
                       readOnly
                       value={formData.imageUrl}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                     />
                   </div>
                 </div>
               </div>
             )}
           </div>
         </div>

          <div>
            <label htmlFor="sellerId" className="block text-sm font-medium text-gray-700 mb-2">
              Seller *
            </label>
            <select
              id="sellerId"
              required
              value={formData.sellerId}
              onChange={(e) => setFormData({ ...formData, sellerId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a seller</option>
              {sellers.map((seller) => (
                <option key={seller.id} value={seller.id}>
                  {seller.name} ({seller.email})
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
            <Link
              href="/admin/products"
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
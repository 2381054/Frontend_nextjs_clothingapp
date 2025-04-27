'use client';

import { useState, useEffect } from 'react';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';

const API_URL = 'http://localhost:4000/api/products'; // ← Adjusted for different port

export default function Home() {
  const [productToEdit, setProductToEdit] = useState(null);
  const [products, setProducts] = useState([]);

  // Fetch product list on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products', err);
      }
    };

    fetchProducts();
  }, []);

  // Handle save (create or update product)
  const handleSaveProduct = async (product) => {
    const method = product.id ? 'PUT' : 'POST';
  
    try {
      const response = await fetch(API_URL, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save product');
      }
  
      const updatedProduct = await response.json();
  
      setProducts((prev) =>
        product.id
          ? prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
          : [...prev, updatedProduct]
      );
      setProductToEdit(null); // Reset form after saving
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    }
  };
  

  // Handle edit
  const handleEditProduct = (product) => {
    setProductToEdit(product);
  };

  // Handle delete
  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(API_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
  
      setProducts((prev) => prev.filter((product) => product.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };
  

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '40px' }}>
      <ProductForm productToEdit={productToEdit} onSave={handleSaveProduct} />
      <ProductList products={products} onEdit={handleEditProduct} onDelete={handleDeleteProduct} />
    </div>
  );
}

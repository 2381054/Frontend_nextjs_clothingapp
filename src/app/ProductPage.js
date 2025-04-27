'use client';

import { useState, useEffect } from 'react';

const API_PRODUCT_URL = 'http://localhost:4000/api/products';
const API_CATEGORY_URL = 'http://localhost:4000/api/categories';

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
  });

  // Fetch products and categories
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_PRODUCT_URL);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(API_CATEGORY_URL);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const method = productToEdit ? 'PUT' : 'POST';
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
    };

    if (productToEdit) {
      payload.id = productToEdit.id;
    }

    try {
      const response = await fetch(API_PRODUCT_URL, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save product');
      }

      await fetchProducts();
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setProductToEdit(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId || '',
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    

    try {
      const response = await fetch(API_PRODUCT_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const resetForm = () => {
    setProductToEdit(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      categoryId: '',
    });
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '40px' }}>
      <h1>{productToEdit ? 'Edit Product' : 'Create Product'}</h1>
      <form onSubmit={handleSave} style={{ marginBottom: '40px' }}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Product Name"
          required
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Product Description"
          required
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          placeholder="Price"
          required
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleInputChange}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <button type="submit" style={{ width: '100%', padding: '10px' }}>
          {productToEdit ? 'Update Product' : 'Create Product'}
        </button>

        {productToEdit && (
          <button
            type="button"
            onClick={resetForm}
            style={{ width: '100%', padding: '10px', marginTop: '10px', backgroundColor: '#ccc' }}
          >
            Cancel Edit
          </button>
        )}
      </form>

      <h2>Product List</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {products.map((product) => (
          <li key={product.id} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
            <strong>{product.name}</strong> - Rp{product.price} <br />
            <small>{product.description}</small> <br />
            <small>Category: {product.category?.name || 'Uncategorized'}</small>
            <div style={{ marginTop: '10px' }}>
              <button onClick={() => handleEdit(product)} style={{ marginRight: '10px' }}>
                Edit
              </button>
              <button onClick={() => handleDelete(product.id)} style={{ backgroundColor: 'red', color: 'white' }}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

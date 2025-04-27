'use client';

import { useState, useEffect } from 'react';
import Nav from '../components/Nav'; // ← tambah ini!

const API_CATEGORY_URL = 'http://localhost:4000/api/categories';

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(API_CATEGORY_URL);
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const method = editingCategory ? 'PUT' : 'POST';
      const url = editingCategory
        ? `${API_CATEGORY_URL}/${editingCategory.id}`
        : API_CATEGORY_URL;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        throw new Error('Failed to save category');
      }

      await fetchCategories();
      setName('');
      setEditingCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setName(category.name);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await fetch(`${API_CATEGORY_URL}/${id}`, {
        method: 'DELETE',
      });

      await fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };

  return (
    <>
      <Nav /> {/* ← Taruh Nav di atas */}
      <div style={{ maxWidth: '500px', margin: '0 auto', paddingTop: '40px' }}>
        <h1>Manage Categories</h1>

        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <button type="submit" style={{ width: '100%', padding: '10px' }}>
            {editingCategory ? 'Update Category' : 'Add Category'}
          </button>
        </form>

        <ul>
          {categories.map((category) => (
            <li key={category.id} style={{ marginBottom: '10px' }}>
              {category.name}
              <button
                onClick={() => handleEdit(category)}
                style={{ marginLeft: '10px' }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                style={{ marginLeft: '5px', color: 'red' }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

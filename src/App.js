import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AuthPage from './app/AuthPage'; // nanti buat AuthPage.js
import Order from './app/Order'; // ⬅️ Import order page
import Login from './app/Login'; // ⬅️ Tambahkan import Login
import Category from './app/Category';
import ProductPage from './app/ProductPage';

// (kalau mau, kita juga siapkan nanti halaman ReviewPage dan OrderPage)

function App() {
  return (
    <Routes>
      {/* Redirect root to /product */}

      <Route path="/" element={<Login />} /> {/* Default ke login */}
      
      {/* Auth routes */}
      <Route path="/auth" element={<AuthPage />} />

      {/* Product routes */}
      <Route path="/product" element={<ProductPage />} />

      {/* Nanti bisa tambah route untuk Review, Order, dll */}

      
      <Route path="/order" element={<Order />} /> {/* ⬅️ Tambahkan ini */}

      <Route path="/category" element={<Category />} />

      

    </Routes>
  );
}

export default App;



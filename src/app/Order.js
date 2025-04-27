'use client';

import { useState, useEffect } from 'react';

const API_ORDER_URL = 'https://backend-nextjs-clothingapp.vercel.app/api/orders';
const API_PRODUCT_URL = 'https://backend-nextjs-clothingapp.vercel.app/api/products';

export default function Order() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [orders, setOrders] = useState([]);

  const user = JSON.parse(localStorage.getItem('user')); // ⬅️ Ambil user dari localStorage

  useEffect(() => {
    fetchProducts();
    fetchOrders();
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

  const fetchOrders = async () => {
    if (!user) return;
    try {
      const response = await fetch(API_ORDER_URL);
      const data = await response.json();
      // Filter orders hanya untuk user ini
      const userOrders = data.filter((order) => order.userId === user.id);
      setOrders(userOrders);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    }
  };

  const handleOrder = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('User not logged in');
      return;
    }

    try {
      const response = await fetch(API_ORDER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id, // ⬅️ Ambil dari user login
          productId: parseInt(selectedProductId), // ✅ pastikan Int
          quantity: parseInt(quantity),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      alert('Order created successfully!');
      setSelectedProductId('');
      setQuantity(1);
      fetchOrders(); // ⬅️ Setelah sukses, refresh list orders
    } catch (error) {
      console.error('Error creating order:', error);
      alert(error.message || 'Failed to create order');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '40px' }}>
      <h1>Kontolodon branded store</h1>
      <h3>Make an Order</h3>
      <form onSubmit={handleOrder}>
        <div style={{ marginBottom: '20px' }}>
          <label>Product:</label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - Rp {product.price}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Quantity:</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <button type="submit" style={{ width: '100%', padding: '10px' }}>
          Order
        </button>
      </form>

      <hr style={{ margin: '40px 0' }} />

      <h2>Your Orders</h2>
        {orders.length === 0 ? (
        <p>No orders yet.</p>
        ) : (
        <ul>
            {orders.map((order) => {
            const product = products.find((p) => p.id === order.productId);
            const productName = product ? product.name : 'Unknown Product';

            return (
                <li key={order.id} style={{ marginBottom: '10px' }}>
                Product: {productName} - Quantity: {order.quantity} - Total Price: Rp{order.totalPrice}
                </li>
            );
            })}
        </ul>
        )}

    </div>
  );
}

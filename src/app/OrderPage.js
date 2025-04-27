// src/app/OrderPage.js
import React, { useEffect, useState } from 'react';

const API_URL = 'https://backend-nextjs-clothingapp.vercel.app/api/orders';

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({ userId: '', productId: '', quantity: 1 });

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle create new order
  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
      if (!response.ok) throw new Error('Failed to create order');
      const created = await response.json();
      setOrders((prev) => [...prev, created]);
      setNewOrder({ userId: '', productId: '', quantity: 1 }); // Reset form
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  // Handle delete order
  const handleDeleteOrder = async (id) => {
    try {
      const response = await fetch(API_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error('Failed to delete order');
      setOrders((prev) => prev.filter((order) => order.id !== id));
    } catch (error) {
      console.error('Failed to delete order:', error);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '40px' }}>
      <h2>Orders</h2>

      <form onSubmit={handleCreateOrder} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="User ID"
          value={newOrder.userId}
          onChange={(e) => setNewOrder({ ...newOrder, userId: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Product ID"
          value={newOrder.productId}
          onChange={(e) => setNewOrder({ ...newOrder, productId: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newOrder.quantity}
          onChange={(e) => setNewOrder({ ...newOrder, quantity: parseInt(e.target.value) })}
          min="1"
          required
        />
        <button type="submit">Create Order</button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Total Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.user?.email || order.userId}</td>
              <td>{order.product?.name || order.productId}</td>
              <td>{order.quantity}</td>
              <td>{order.totalPrice}</td>
              <td>
                <button onClick={() => handleDeleteOrder(order.id)} style={{ color: 'red' }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

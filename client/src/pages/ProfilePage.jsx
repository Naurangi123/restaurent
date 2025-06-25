import React from 'react';
import useCurrentUser from '../hooks/useUser';

const ProfilePage = () => {
  const { user, loading, error } = useCurrentUser();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading user data. Please try again later.</p>;
  }

  if (!user) {
    return <p>You must be logged in to view your profile.</p>;
  }

  console.log("user form profile",user)

  return (
    <div className="p-4">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">User Profile</h2>
        <p><strong>Name:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      <h2 className="text-3xl font-bold mb-4">Your Order History</h2>
      {/* {user.orders ? (
        <p>No past orders found.</p>
      ) : (
        user.orders.map(order => (
          <div key={order.id} className="border p-4 mb-4 rounded shadow">
            <h3 className="font-semibold">Order Date: {new Date(order.created_at).toLocaleString()}</h3>
            <p>Status: {order.status}</p>
            <p>Total Bill: ₹{order.total_bill}</p>
            <ul className="list-disc list-inside mt-2">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.food.name} x {item.quantity} — ₹{item.food.price * item.quantity}
                </li>
              ))}
            </ul>
          </div>
        ))
      )} */}
    </div>
  );
};

export default ProfilePage;

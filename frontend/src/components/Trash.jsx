import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const UserDetails = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = Cookies.get('AuthToken'); // Get the token from the cookie

        if (!token) {
          setError('No authentication token found');
          return;
        }

        const response = await axios.get('http://your-api-url/userdetails', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Failed to fetch user details');
      }
    };

    fetchUserDetails();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>User Details</h2>
      {users.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {users.map(user => (
            <li key={user._id}>
              <h3>{user.username}</h3>
              <p>Email: {user.email}</p>
              <p>Name: {user.firstName} {user.lastName}</p>
              <p>Coins: {user.coins}</p>
              <p>Joined: {new Date(user.joined).toLocaleDateString()}</p>
              <p>Last Update: {new Date(user.lastUpdate).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserDetails;
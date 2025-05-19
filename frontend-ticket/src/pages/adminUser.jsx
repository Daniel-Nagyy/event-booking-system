import React from 'react';
import { useNavigate } from 'react-router-dom';

function UsersPage() {
  const navigate = useNavigate();

  const users = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User' },
    { id: 3, name: 'Charlie Davis', email: 'charlie@example.com', role: 'Moderator' }
  ];

  return (
    <div>
      <h2>Users</h2>
      
      {/* 🔙 Back Button */}
      <button onClick={() => navigate('/admin')}>← Back to Admin Menu</button>

      <table border="1" cellPadding="10" cellSpacing="0" style={{ marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th> {/* For Update/Delete buttons */}
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => alert(`Update role for ${user.name}`)}>Update Role</button>
                <button onClick={() => alert(`Delete ${user.name}`)} style={{ marginLeft: '10px' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersPage;

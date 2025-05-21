// UserTable.jsx
import React from 'react';

function UserTable({ users, onUpdateRole, onDelete }) {
  const roles = ['Admin', 'User', 'Organizer'];

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Update Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user._id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>
              <select
                defaultValue={user.role}
                onChange={(e) => onUpdateRole(user._id, e.target.value)}
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </td>
            <td>
              <button onClick={() => onDelete(user._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default UserTable;

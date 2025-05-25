import React, { useState ,useEffect} from 'react';
import UserTable from '../components/userTable';
import { useNavigate } from 'react-router-dom';
import {admin} from '../services/api'

function UserPage() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    admin.getUsers()
      .then(res => {
        setUsers(res.data); // Update state with fetched data
      })
      .catch(err => {
        console.error(err);
      });
  }, []);
  

  
  const updateRole = (id, newRole) => {
    admin.updateRole(id, newRole)
      .then((res) => {
    console.log('Role updated:', res.data);
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user._id === id ? { ...user, role: newRole } : user
      )
    );
  })
  .catch((err) => {
    console.error('Error updating role:', err);
  });
};
  
  

  const deleteUser = (id) => {
    admin.deleteUser(id)
      .then((res) => {
        console.log('User deleted:', res.data);
  
        // Update the users state by filtering out the deleted user
        setUsers(prevUsers => prevUsers.filter(user => user._id !== id));
      })
      .catch((err) => {
        console.error('Error deleting user:', err);
      });
  };

  return (
    <div>
      <button onClick={() => navigate('/admin')}>← Back to Admin</button>
      <h2>Users</h2>
      <UserTable users={users} onUpdateRole={updateRole} onDelete={deleteUser} />
    </div>
  );
}

export default UserPage;

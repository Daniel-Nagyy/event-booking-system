import React, { useState ,useEffect} from 'react';
import UserTable from '../components/userTable';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

function UserPage() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios({
      method: 'get',
      url: 'http://localhost:3000/api/v1/users'
    })
      .then(res => {
        setUsers(res.data); // Update state with fetched data
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const updateRole = (id) => {
    axios({
      method: 'put',
      url: `http://localhost:3000/api/v1/users/${id}`,
      data: {
        role: 'newRole' // Replace with actual new role value
      }
    })
      .then((res) => {
        console.log('Role updated:', res.data);
      })
      .catch((err) => {
        console.error('Error updating role:', err);
      });
  };
  

  const deleteUser = (id) => {
    axios.delete(`http://localhost:3000/api/v1/users/${id}`)
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

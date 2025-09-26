import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaEdit, FaTrash, FaUserPlus, FaSave, FaTimes, FaUser } from 'react-icons/fa';
import { admin } from '../services/api';
import './admin.css';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'User'
  });

  const [editUserData, setEditUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'User'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await admin.getUsers();
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddUser = async () => {
    try {
      const response = await admin.createUser(newUser);
      console.log('User created:', response.data);
      
      // Add new user to the list
      setUsers([...users, response.data.user]);
      
      // Reset form
      setNewUser({
        name: '',
        email: '',
        password: '',
        role: 'User'
      });
      setShowAddUser(false);
      setError(null);
    } catch (err) {
      console.error('Error creating user:', err);
      setError('Failed to create user: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditUserData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      role: user.role || 'User'
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    
    try {
      console.log('Sending update request for user:', editingUser._id);
      console.log('Update data:', editUserData);
      
      const response = await admin.updateUser(editingUser._id, editUserData);
      console.log('Update response:', response);
      
      // Update local state
      setUsers(users.map(user => 
        user._id === editingUser._id ? response.data.user : user
      ));
      setShowEditModal(false);
      setEditingUser(null);
      setEditUserData({
        name: '',
        email: '',
        password: '',
        role: 'User'
      });
      setError(null);
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await admin.updateRole(userId, newRole);
      // Update local state
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
    } catch (err) {
      setError('Failed to update user role');
      console.error('Error updating role:', err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await admin.deleteUser(userId);
        // Remove user from local state
        setUsers(users.filter(user => user._id !== userId));
      } catch (err) {
        setError('Failed to delete user');
        console.error('Error deleting user:', err);
      }
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
    setEditUserData({
      name: '',
      email: '',
      password: '',
      role: 'User'
    });
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div className="loading">Loading users...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-users-page">
      <div className="page-header">
        <h2>User Management</h2>
        <div className="header-stats">
          <span className="stat-item">
            <FaUser />
            Total: {users.length}
          </span>
          <span className="stat-item">
            <FaUser />
            Users: {users.filter(u => u.role === 'User').length}
          </span>
          <span className="stat-item">
            <FaUser />
            Organizers: {users.filter(u => u.role === 'Organizer').length}
          </span>
          <span className="stat-item">
            <FaUser />
            Admins: {users.filter(u => u.role === 'Admin').length}
          </span>
        </div>
        <button onClick={() => setShowAddUser(true)} className="add-user-btn">
          <FaUserPlus />
          Add User
        </button>
      </div>

      {/* Search and Filters */}
      <div className="search-filters">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filters">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Roles</option>
            <option value="User">User</option>
            <option value="Organizer">Organizer</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                    className="role-select"
                  >
                    <option value="User">User</option>
                    <option value="Organizer">Organizer</option>
                    <option value="Admin">Admin</option>
                  </select>
                </td>
                <td>
                  <div className="event-actions-header">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="edit-btn"
                      title="Edit User"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="delete-btn"
                      title="Delete User"
                      disabled={user.role === 'Admin'}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="page-btn"
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`page-btn ${currentPage === number ? 'active' : ''}`}
            >
              {number}
            </button>
          ))}
          
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="page-btn"
          >
            Next
          </button>
        </div>
      )}

      {/* Summary */}
      <div className="summary-stats">
        <p>Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users</p>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="modal-overlay" onClick={() => setShowAddUser(false)}>
          <div className="event-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New User</h3>
              <button onClick={() => setShowAddUser(false)} className="close-btn">&times;</button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newUser.name}
                  onChange={handleInputChange}
                  className="edit-input"
                  placeholder="Enter user name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  className="edit-input"
                  placeholder="Enter user email"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  className="edit-input"
                  placeholder="Enter password"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  value={newUser.role}
                  onChange={handleInputChange}
                  className="role-select"
                >
                  <option value="User">User</option>
                  <option value="Organizer">Organizer</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="modal-actions">
                <button onClick={handleAddUser} className="approve-btn large">
                  <FaUserPlus /> Create User
                </button>
                <button onClick={() => setShowAddUser(false)} className="cancel-btn large">
                  <FaTimes /> Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="event-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit User: {editingUser.name}</h3>
              <button onClick={closeEditModal} className="close-btn">&times;</button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label htmlFor="edit-name">Name</label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  value={editUserData.name}
                  onChange={handleEditInputChange}
                  className="edit-input"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-email">Email</label>
                <input
                  type="email"
                  id="edit-email"
                  name="email"
                  value={editUserData.email}
                  onChange={handleEditInputChange}
                  className="edit-input"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-role">Role</label>
                <select
                  id="edit-role"
                  name="role"
                  value={editUserData.role}
                  onChange={handleEditInputChange}
                  className="role-select"
                >
                  <option value="User">User</option>
                  <option value="Organizer">Organizer</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="modal-actions">
                <button onClick={handleSaveEdit} className="save-btn large">
                  <FaSave /> Save Changes
                </button>
                <button onClick={closeEditModal} className="cancel-btn large">
                  <FaTimes /> Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
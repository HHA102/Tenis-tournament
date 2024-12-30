import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user' });
    const [roles] = useState(['user', 'player', 'sponsor', 'organizer', 'referee', 'admin']);

    // Fetch all users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/users', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    // Handle creating a new user
    const handleCreateUser = async () => {
        try {
            await axios.post('/api/auth/register', newUser, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            alert('User created successfully!');
            setNewUser({ username: '', password: '', role: 'user' });
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Failed to create user.');
        }
    };

    // Handle deleting a user
    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            alert('User deleted successfully!');
            setUsers(users.filter(user => user._id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user.');
        }
    };

    // Handle updating user role
    const handleUpdateRole = async (userId, role) => {
        try {
            await axios.put(`/api/users/${userId}`, { role }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            alert('Role updated successfully!');
            setUsers(users.map(user => (user._id === userId ? { ...user, role } : user)));
        } catch (error) {
            console.error('Error updating role:', error);
            alert('Failed to update role.');
        }
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <h2>Create New User</h2>
            <input
                type="text"
                placeholder="Username"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            />
            <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
            <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
                {roles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                ))}
            </select>
            <button onClick={handleCreateUser}>Create User</button>

            <h2>Manage Users</h2>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.username}</td>
                            <td>
                                <select
                                    value={user.role}
                                    onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                                >
                                    {roles.map((role) => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;

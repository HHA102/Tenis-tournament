import React, { useState, useEffect } from "react";
import axios from "axios";
import { ROLE } from "../../constants";
import { deleteUser, getAllUsers } from "../../redux/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../redux/authSlice";
import { createAxios } from "../../createInstance";
import "./AdminDashboard.css";
import axiosClient from "../../utils/axiosClient";

const AdminDashboard = () => {
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    email: "",
    role: ROLE.USER,
  });

  // Lấy danh sách người dùng từ Redux store
  const [users, setUsers] = useState([]);
  const userList = useSelector((state) => state.users.users?.allUsers);

  const user = useSelector((state) => state.auth.login?.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  // Fetch danh sách người dùng
  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      getAllUsers(dispatch);
    }
  }, []);

  // Handle tạo người dùng mới
  const handleCreateUser = async () => {
    try {
      const roleToSave = newUser.role || ROLE.USER;
      await axiosClient.post(
        '/v1/auth/register',
        { ...newUser, role: roleToSave }
      );
      alert("User created successfully!");
      setNewUser({ username: "", password: "", email: "", role: ROLE.USER });
      // Refresh danh sách người dùng sau khi thêm mới
      getAllUsers();
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user.");
    }
  };

  // Handle xóa người dùng
  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      alert("User deleted successfully!");
      getAllUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    }
  };

  // Handle cập nhật vai trò người dùng
  const handleUpdateRole = async (userId, role) => {
    try {
      await axiosClient.put(
        `/v1/user/${userId}`,
        { role },
      );
      alert("Role updated successfully!");
      // Cập nhật vai trò trong danh sách
      getAllUsers();
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update role.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-500 to-purple-600"
      style={{
      backgroundImage: `url('https://img.freepik.com/free-photo/blue-surface-with-study-tools_23-2147864592.jpg?semt=ais_hybrid')`,
      backgroundSize: 'cover', // Ensures the image covers the entire screen
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed', // Keeps the background fixed when scrolling
      height: '100vh', // Ensures full height
      width: '100vw', // Ensures full width
    }}>
      <h1>Admin Dashboard</h1>

      {/* Form tạo người dùng */}
      <h2>Create New User</h2>
      <form>
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
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        >
          {Object.keys(ROLE).map((role) => (
            <option key={ROLE[role]} value={ROLE[role]}>
              {ROLE[role]}
            </option>
          ))}
        </select>
        <button onClick={handleCreateUser}>Create User</button>
      </form>
      {/* Bảng quản lý người dùng */}
      <h2>Manage Users</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userList?.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                >
                  {Object.keys(ROLE).map((role) => (
                    <option key={ROLE[role]} value={ROLE[role]}>
                      {ROLE[role]}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button onClick={() => handleDeleteUser(user._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;

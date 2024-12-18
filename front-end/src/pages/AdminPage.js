import React from 'react';

const AdminDashboard = () => {
  const handleCreateUser = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const user = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      role: formData.get('role'),
    };
    console.log('Created User:', user);
    // Add API call to create user
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Create New User</h2>
      <form onSubmit={handleCreateUser}>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" required />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <div>
          <label htmlFor="role">Role:</label>
          <select id="role" name="role" required>
            <option value="organizer">Organizer</option>
            <option value="referee">Referee</option>
            <option value="sponsor">Sponsor</option>
          </select>
        </div>
        <button type="submit">Create User</button>
      </form>
    </div>
  );
};

export default AdminDashboard;

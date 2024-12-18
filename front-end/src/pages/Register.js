import React from 'react';

const Register = () => {
  const handleRegister = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const user = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      role: 'player', // Fixed role for registration
    };
    console.log('Registered User:', user);
    // Add API call to save user in the database
  };

  return (
    <div>
      <h1>Register as Player</h1>
      <form onSubmit={handleRegister}>
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;

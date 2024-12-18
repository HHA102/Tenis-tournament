import React, { useState } from 'react';
import api from '../services/api';

const CreateTournament = () => {
  const [formData, setFormData] = useState({ name: '', startDate: '', endDate: '', status: 'Inactive' });
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/tournaments/create', formData);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.message || 'Có lỗi xảy ra.');
    }
  };

  return (
    <div>
      <h1>Tạo Giải Đấu Mới</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Tên giải đấu" value={formData.name} onChange={handleInputChange} />
        <input name="startDate" type="date" value={formData.startDate} onChange={handleInputChange} />
        <input name="endDate" type="date" value={formData.endDate} onChange={handleInputChange} />
        <select name="status" value={formData.status} onChange={handleInputChange}>
          <option value="Inactive">Inactive</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
        </select>
        <button type="submit">Tạo</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateTournament;

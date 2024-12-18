const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Định nghĩa schema cho User
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['admin', 'organizer', 'referee', 'sponsor', 'player'], // Các vai trò có thể có
      default: 'player', // Người chơi là mặc định khi đăng ký
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Middleware để mã hóa mật khẩu trước khi lưu
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Nếu password không thay đổi, bỏ qua
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Phương thức để kiểm tra mật khẩu khi đăng nhập
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Export model User
const User = mongoose.model('User', userSchema);

module.exports = User;

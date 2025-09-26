const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true // đảm bảo không trùng email
  },

  password: {
    type: String,
    default: null // nếu dùng Google thì password = null
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  ggid: {
    type: String,
    default: null // lưu Google ID (sub) nếu dùng Google login
  },

  picture: {
    type: String,
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});


const User = mongoose.model('user', userSchema);

module.exports = User;

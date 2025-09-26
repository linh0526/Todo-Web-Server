const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  priority: { type: Number, default: 0 }, // 0: low, 1: medium, 2: high
  tags: [{ type: String }],
  dueDate: { type: Date },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
}, {
  toJSON: {
    transform(doc, ret) {
      delete ret.__v;
      delete ret.userId
      return ret;
    }
  }
});

module.exports = mongoose.model('Task', taskSchema);

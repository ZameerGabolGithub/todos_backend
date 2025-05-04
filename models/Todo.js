const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Please add a todo text'],
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  dueDate: {
    type: Date,
    required: [true, 'Please add a due date']
  },
  category: {
    type: String,
    enum: ['Work', 'Study', 'Personal', 'Other'],
    default: 'Other'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Todo', todoSchema); 
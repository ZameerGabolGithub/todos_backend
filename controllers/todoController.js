const Todo = require('../models/Todo');

// @desc    Get all todos for a user
// @route   GET /api/todos
// @access  Private
const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
    console.log('Fetched todos from DB:', todos); // Debug log
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create new todo
// @route   POST /api/todos
// @access  Private
const createTodo = async (req, res) => {
  try {
    const { text, dueDate, category } = req.body;
    console.log('Creating todo with data:', { text, dueDate, category }); // Debug log

    if (!category || !['Work', 'Study', 'Personal', 'Other'].includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    // Convert dueDate string to Date object
    const formattedDueDate = new Date(dueDate);

    const todo = await Todo.create({
      text,
      dueDate: formattedDueDate,
      category,
      user: req.user._id
    });

    console.log('Created todo:', todo); // Debug log
    res.status(201).json(todo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update todo
// @route   PUT /api/todos/:id
// @access  Private
const updateTodo = async (req, res) => {
  try {
    const { text, completed, dueDate, category } = req.body;
    console.log('Updating todo with data:', { text, completed, dueDate, category }); // Debug log

    if (category && !['Work', 'Study', 'Personal', 'Other'].includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // Check for user
    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { text, completed, dueDate, category },
      { new: true }
    );

    console.log('Updated todo:', updatedTodo); // Debug log
    res.json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete todo
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // Check for user
    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
}; 
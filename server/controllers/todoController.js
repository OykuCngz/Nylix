const Todo = require('../models/Todo');

exports.getTodos = async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.user.id }).populate('categories');
        res.json(todos);
    } catch (err) {
        console.error('getTodos error:', err);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
};

exports.createTodo = async (req, res) => {
    try {
        const { title, description, status, startDate, endDate, categories, priority } = req.body;
        const newTodo = new Todo({
            title,
            description,
            status,
            startDate: startDate || undefined,
            endDate,
            categories,
            priority,
            user: req.user.id
        });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (err) {
        console.error('createTodo error:', err);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
};

exports.updateTodo = async (req, res) => {
    try {
        const { title, description, status, startDate, endDate, categories } = req.body;
        const todo = await Todo.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { title, description, status, startDate, endDate, categories },
            { new: true }
        );
        if (!todo) return res.status(404).json({ message: 'Todo not found' });
        res.json(todo);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!todo) return res.status(404).json({ message: 'Todo not found' });
        res.json({ message: 'Todo deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

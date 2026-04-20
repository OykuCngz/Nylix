const Vision = require('../models/Vision');

exports.getVisions = async (req, res) => {
    try {
        const visions = await Vision.find({ user: req.user.id });
        res.json(visions);
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
};

exports.createVision = async (req, res) => {
    try {
        const { title, category, description, image, size } = req.body;
        const newVision = new Vision({
            title,
            category,
            description,
            image,
            size,
            user: req.user.id
        });
        await newVision.save();
        res.status(201).json(newVision);
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
};

exports.updateVision = async (req, res) => {
    try {
        const vision = await Vision.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true }
        );
        if (!vision) return res.status(404).json({ message: 'Vision item not found' });
        res.json(vision);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteVision = async (req, res) => {
    try {
        const vision = await Vision.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!vision) return res.status(404).json({ message: 'Vision item not found' });
        res.json({ message: 'Vision item deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

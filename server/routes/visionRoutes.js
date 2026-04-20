const express = require('express');
const router = express.Router();
const { getVisions, createVision, updateVision, deleteVision } = require('../controllers/visionController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', getVisions);
router.post('/', createVision);
router.put('/:id', updateVision);
router.delete('/:id', deleteVision);

module.exports = router;

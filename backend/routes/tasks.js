const express = require('express');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(auth);

router.post('/', upload.single('file'), createTask);
router.get('/board/:boardId', getTasks);
router.put('/:id', upload.single('file'), updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
const express = require('express');
const { createBoard, getBoards, getBoard, updateBoard, deleteBoard } = require('../controllers/boardController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.post('/', createBoard);
router.get('/', getBoards);
router.get('/:id', getBoard);
router.put('/:id', updateBoard);
router.delete('/:id', deleteBoard);

module.exports = router;
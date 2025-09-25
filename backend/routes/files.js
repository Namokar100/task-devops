const express = require('express');
const { streamFile, getFileUrl } = require('../services/fileService');
const auth = require('../middleware/auth');

const router = express.Router();

// Stream file from MinIO
router.get('/:fileName', auth, async (req, res) => {
  try {
    const { fileName } = req.params;
    const fileStream = await streamFile(fileName);
    
    fileStream.pipe(res);
  } catch (error) {
    console.error('File stream error:', error);
    res.status(404).json({ message: 'File not found' });
  }
});

// Get presigned URL for file
router.get('/:fileName/url', auth, async (req, res) => {
  try {
    const { fileName } = req.params;
    const url = await getFileUrl(fileName);
    
    res.json({ url });
  } catch (error) {
    console.error('Get file URL error:', error);
    res.status(404).json({ message: 'File not found' });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const path = require('path');
const programs = require(path.join(__dirname, '../data/programs.json'));

router.get('/', (req, res) => {
  res.status(200).json({ success: true, data: programs });
});

router.get('/:id', (req, res) => {
  const program = programs.find(p => p.id === req.params.id);
  if (!program) return res.status(404).json({ success: false, message: 'Program not found' });
  res.status(200).json({ success: true, data: program });
});

module.exports = router;
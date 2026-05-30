const express = require('express');
const router = express.Router();
const path = require('path');
const institutions = require(path.join(__dirname, '../data/institutions.json'));

router.get('/', (req, res) => {
  res.status(200).json({ success: true, data: institutions });
});

router.get('/:id', (req, res) => {
  const institution = institutions.find(i => i.id === req.params.id);
  if (!institution) return res.status(404).json({ success: false, message: 'Institution not found' });
  res.status(200).json({ success: true, data: institution });
});

module.exports = router;
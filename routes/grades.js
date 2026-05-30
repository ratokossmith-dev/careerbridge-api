const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const verifyToken = require('../middleware/auth');

router.post('/:id', verifyToken, async (req, res, next) => {
  try {
    const { subjects } = req.body;
    await db.collection('grades').doc(req.params.id).set({
      subjects,
      updatedAt: new Date().toISOString(),
    });
    res.status(200).json({ success: true, message: 'Grades saved' });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', verifyToken, async (req, res, next) => {
  try {
    const doc = await db.collection('grades').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ success: false, message: 'Grades not found' });
    res.status(200).json({ success: true, data: doc.data() });
  } catch (error) {
    next(error);
  }
});

module.exports = router;    
const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const verifyToken = require('../middleware/auth');

router.get('/:id', verifyToken, async (req, res, next) => {
  try {
    const doc = await db.collection('users').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ success: false, message: 'Student not found' });
    res.status(200).json({ success: true, data: doc.data() });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', verifyToken, async (req, res, next) => {
  try {
    await db.collection('users').doc(req.params.id).update(req.body);
    res.status(200).json({ success: true, message: 'Profile updated' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
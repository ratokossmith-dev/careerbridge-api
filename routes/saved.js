const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const verifyToken = require('../middleware/auth');

router.get('/:userId', verifyToken, async (req, res, next) => {
  try {
    const doc = await db.collection('saved').doc(req.params.userId).get();
    if (!doc.exists) return res.status(200).json({ success: true, data: [] });
    res.status(200).json({ success: true, data: doc.data().programs || [] });
  } catch (error) {
    next(error);
  }
});

router.post('/', verifyToken, async (req, res, next) => {
  try {
    const { userId, programId } = req.body;
    const ref = db.collection('saved').doc(userId);
    const doc = await ref.get();
    const existing = doc.exists ? doc.data().programs || [] : [];
    if (existing.find(p => p.programId === programId)) {
      return res.status(200).json({ success: false, message: 'Already saved' });
    }
    existing.push({ programId, savedAt: new Date().toISOString() });
    await ref.set({ programs: existing });
    res.status(200).json({ success: true, message: 'Program saved' });
  } catch (error) {
    next(error);
  }
});

router.delete('/', verifyToken, async (req, res, next) => {
  try {
    const { userId, programId } = req.body;
    const ref = db.collection('saved').doc(userId);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ success: false, message: 'Nothing saved' });
    const updated = (doc.data().programs || []).filter(p => p.programId !== programId);
    await ref.set({ programs: updated });
    res.status(200).json({ success: true, message: 'Program removed' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const verifyToken = require('../middleware/auth');

router.post('/', verifyToken, async (req, res, next) => {
  try {
    const { userId, universityId, universityName, subject, message, studentName, studentEmail } = req.body;
    const ref = await db.collection('enquiries').add({
      userId,
      universityId,
      universityName,
      subject,
      message,
      studentName: studentName || '',
      studentEmail: studentEmail || '',
      sentAt: new Date().toISOString(),
      status: 'pending',
      response: '',
      respondedAt: '',
    });
    res.status(201).json({ success: true, message: 'Enquiry sent', id: ref.id });
  } catch (error) {
    next(error);
  }
});

router.get('/:userId', verifyToken, async (req, res, next) => {
  try {
    const snapshot = await db.collection('enquiries')
      .where('userId', '==', req.params.userId).get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.get('/', verifyToken, async (req, res, next) => {
  try {
    const snapshot = await db.collection('enquiries').orderBy('sentAt', 'desc').get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});
router.get('/all/list', verifyToken, async (req, res, next) => {
  try {
    const snapshot = await db.collection('enquiries')
      .orderBy('sentAt', 'desc').get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.put('/:enquiryId/reply', verifyToken, async (req, res, next) => {
  try {
    const { response, adminId } = req.body;
    if (!response || !response.trim()) {
      return res.status(400).json({ success: false, message: 'Reply message is required' });
    }
    await db.collection('enquiries').doc(req.params.enquiryId).update({
      response: response.trim(),
      status: 'responded',
      respondedAt: new Date().toISOString(),
      respondedBy: adminId || '',
    });
    res.status(200).json({ success: true, message: 'Reply sent successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
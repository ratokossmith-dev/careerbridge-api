const express = require('express');
const router = express.Router();
const { auth, db } = require('../config/firebase');

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, district, school } = req.body;

    const userRecord = await auth.createUser({ email, password, displayName: name });

    await db.collection('users').doc(userRecord.uid).set({
      name,
      email,
      district,
      school,
      gender: '',
      year: '',
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({ success: true, message: 'Account created successfully', uid: userRecord.uid });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await auth.getUserByEmail(email);
    res.status(200).json({ success: true, uid: user.uid });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
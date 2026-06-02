const express = require('express');
const router = express.Router();
const { auth, db } = require('../config/firebase');

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, district, school } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    await db.collection('users').doc(userRecord.uid).set({
      name,
      email,
      district,
      school,
      gender: '',
      year: '',
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      uid: userRecord.uid,
    });
  } catch (error) {
    console.error('Register error:', error.message);
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await auth.getUserByEmail(email);

    res.status(200).json({
      success: true,
      uid: user.uid,
      email: user.email,
      name: user.displayName || '',
    });
  } catch (error) {
    console.error('Login error:', error.message);
    if (error.code === 'auth/user-not-found') {
      return res.status(401).json({ success: false, message: 'No account found with this email' });
    }
    next(error);
  }
});

module.exports = router;
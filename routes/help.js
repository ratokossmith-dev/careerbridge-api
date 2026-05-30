const express = require('express');
const router = express.Router();
const path = require('path');
const verifyToken = require('../middleware/auth');
const faq = require(path.join(__dirname, '../data/faq.json'));

router.post('/', verifyToken, (req, res, next) => {
  try {
    const { question } = req.body;
    const input = question.toLowerCase();

    const match = faq.find(item =>
      item.keywords.some(keyword => input.includes(keyword.toLowerCase()))
    );

    if (match) {
      return res.status(200).json({ success: true, answer: match.answer });
    }

    res.status(200).json({
      success: true,
      answer: 'I am not sure about that. Please contact the university directly using the Enquiry feature or visit their website for more information.',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
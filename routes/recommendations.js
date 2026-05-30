const express = require('express');
const router = express.Router();
const path = require('path');
const verifyToken = require('../middleware/auth');
const programs = require(path.join(__dirname, '../data/programs.json'));

const gradeValue = { 'A*': 8, A: 7, B: 6, C: 5, D: 4, E: 3, U: 0 };

router.post('/', verifyToken, (req, res, next) => {
  try {
    const { subjects } = req.body;

    const studentGrades = {};
    subjects.forEach(s => { studentGrades[s.name] = s.grade; });

    const results = programs.map(program => {
      const requirements = program.requirements;
      let met = 0;
      let borderline = 0;
      const total = requirements.length;

      requirements.forEach(req => {
        const studentGrade = studentGrades[req.subject];
        if (!studentGrade) return;
        const studentVal = gradeValue[studentGrade] || 0;
        const requiredVal = gradeValue[req.minimumGrade] || 0;
        if (studentVal >= requiredVal) met++;
        else if (studentVal === requiredVal - 1) borderline++;
      });

      let status = 'locked';
      if (met === total) status = 'qualifies';
      else if (met + borderline === total) status = 'borderline';

      return { ...program, status };
    });

    const sorted = results.sort((a, b) => {
      const order = { qualifies: 0, borderline: 1, locked: 2 };
      return order[a.status] - order[b.status];
    });

    res.status(200).json({ success: true, data: sorted });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
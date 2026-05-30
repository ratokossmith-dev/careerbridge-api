require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const gradesRoutes = require('./routes/grades');
const programsRoutes = require('./routes/programs');
const institutionsRoutes = require('./routes/institutions');
const recommendationsRoutes = require('./routes/recommendations');
const enquiryRoutes = require('./routes/enquiry');
const savedRoutes = require('./routes/saved');
const helpRoutes = require('./routes/help');
const errorMiddleware = require('./middleware/error');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'CareerBridge API is running' });
});

app.use('/auth', authRoutes);
app.use('/student', studentRoutes);
app.use('/grades', gradesRoutes);
app.use('/programs', programsRoutes);
app.use('/institutions', institutionsRoutes);
app.use('/recommendations', recommendationsRoutes);
app.use('/enquiry', enquiryRoutes);
app.use('/saved', savedRoutes);
app.use('/help', helpRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`CareerBridge API running on port ${PORT}`);
}); 
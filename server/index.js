// server/index.js
const express = require('express');
const cors = require('cors');
const mockGoalServeAPI = require('./mockGoalServeAPI');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// ✅ Σύνδεσε το route στο σωστό endpoint
app.use('/api/predictions', mockGoalServeAPI);

app.listen(PORT, () => {
  console.log('✅ Server running on port ' + PORT);
});
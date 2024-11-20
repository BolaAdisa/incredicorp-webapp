const admin = require('firebase-admin');
const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
  res.send('API is running!');
});

// Export API
exports.api = functions.https.onRequest(app);

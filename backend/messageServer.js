const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const axios = require('axios'); // Add axios for HTTP requests

const { storeResponse } = require('./responseStorage');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Create a MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sachin1605',
  database: 'chatbot_db'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Endpoint to handle messages
app.post('/api/message', async (req, res) => {
  const { message } = req.body;

  // Insert message into the database
  const sql = 'INSERT INTO messages (message) VALUES (?)';
  db.query(sql, [message], async (err, result) => {
    if (err) {
      console.error('Error inserting message into MySQL:', err);
      res.status(500).json({ error: 'Failed to save message to the database' });
      return;
    }

    console.log('Message inserted into MySQL with ID:', result.insertId);

    try {
      // Send the message to the Flask NLP API
      const flaskResponse = await axios.post('http://localhost:5001/process_message', { message });

      const botResponse = flaskResponse.data.response;

      // Store the response in responseStorage.js
      storeResponse(botResponse);

      // Send response back to the frontend
      res.json({ response: botResponse });
    } catch (error) {
      console.error('Error communicating with Flask API:', error);
      res.status(500).json({ error: 'Failed to process message using NLP' });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

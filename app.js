const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

// Middleware for JSON handling
app.use(bodyParser.json());

// Helper function to check prime numbers
const isPrime = (num) => {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

// Function to process data
const processData = (data) => {
  let numbers = [];
  let alphabets = [];
  let highestLowercase = null;

  data.forEach((item) => {
    if (!isNaN(item)) {
      numbers.push(parseInt(item));
    } else if (typeof item === 'string') {
      alphabets.push(item);
      if (item >= 'a' && item <= 'z' && (!highestLowercase || item > highestLowercase)) {
        highestLowercase = item;
      }
    }
  });

  const primeExists = numbers.some(isPrime);

  return { numbers, alphabets, highestLowercase, primeExists };
};

// POST endpoint
app.post('/bfhl', (req, res) => {
  const { data, file_b64 } = req.body;

  if (!data || !Array.isArray(data)) {
    return res.status(400).json({ is_success: false, message: 'Invalid data' });
  }

  const { numbers, alphabets, highestLowercase, primeExists } = processData(data);

  const fileValid = Boolean(file_b64);
  const fileMimeType = file_b64 ? 'application/octet-stream' : null;
  const fileSizeKB = file_b64 ? (file_b64.length * 3) / 4 / 1024 : null;

  res.status(200).json({
    is_success: true,
    user_id: 'your_name_ddmmyyyy',
    email: 'your_email@domain.com',
    roll_number: 'Your_Roll_Number',
    numbers,
    alphabets,
    highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : [],
    is_prime_found: primeExists,
    file_valid: fileValid,
    file_mime_type: fileMimeType,
    file_size_kb: fileSizeKB,
  });
});

// GET endpoint
app.get('/bfhl', (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

// Start server
app.listen(port, () => {
  console.log(Backend running on port ${port});
});
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Utility Functions
const isPrime = (num) => {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

// POST Endpoint to process data
app.post("/bfhl", (req, res) => {
  const { data, file_b64 } = req.body;

  const response = {
    is_success: true,
    user_id: "john_doe_17091999", // This should ideally be dynamic
    email: "john@xyz.com",
    roll_number: "ABCD123",
    numbers: [],
    alphabets: [],
    highest_lowercase_alphabet: null,
    is_prime_found: false,
    file_valid: false,
    file_mime_type: null,
    file_size_kb: null,
  };

  try {
    // Process data from the request
    data.forEach((item) => {
      if (!isNaN(item)) {
        response.numbers.push(item); // Extract numbers
      } else if (/^[a-zA-Z]$/.test(item)) {
        response.alphabets.push(item); // Extract alphabets
      }
    });

    // Find the highest lowercase alphabet
    response.highest_lowercase_alphabet = response.alphabets
      .filter((ch) => ch === ch.toLowerCase())
      .sort()
      .pop();

    // Check for prime numbers
    response.is_prime_found = response.numbers.some((num) =>
      isPrime(Number(num))
    );

    // Process Base64 file (optional)
    if (file_b64) {
      const buffer = Buffer.from(file_b64, "base64");
      response.file_valid = true;
      response.file_size_kb = (buffer.length / 1024).toFixed(2);
      response.file_mime_type = "application/octet-stream"; // Simplified MIME type
    }

    res.status(200).json(response); // Send the response back
  } catch (error) {
    res.status(500).json({ is_success: false, error: error.message });
  }
});

// GET Endpoint to return static operation code
app.get("/bfhl", (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

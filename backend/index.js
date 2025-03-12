const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const signupRoute = require('./api/signup'); // Import the signup route

dotenv.config();

const app = express();

// CORS checks
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json()); // Parse JSON request bodies

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Mount the /api/signup route
app.use('/api/signup', signupRoute);

app.listen(process.env.PORT || 5000, () => {
    console.log("Server listening on port " + process.env.PORT || 5000)
})
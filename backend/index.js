const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const addNote = require('./api/addNote');
const changePassword = require('./api/changePassword');
const checkExistence = require('./api/checkExistence');
const checkUserEmailPhone = require('./api/checkUserEmailPhone');
const deleteNote = require('./api/deleteNote');
const fetchNote = require('./api/fetchNote');
const fetchUserProfile = require('./api/fetchUserProfile');
const handleOtp = require('./api/handleOtp');
const login = require('./api/login');
const searchNote = require('./api/searchNote');
const signup = require('./api/signup');
const sortNote = require('./api/sortNote');
const updateNote = require('./api/updateNote');
const updatePassword = require('./api/updatePassword');
const updateUsername = require('./api/updateUsername');

dotenv.config();

const app = express();

// Swagger setup
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Leapfrog Note-Taking Application',
      version: '1.0.0',
      description: 'API documentation for the Leapfrog Note-Taking Application',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'API documentation',
      },
    ],
  },
  // apis: ['./api/fetchNote.js'], // Path to the API docs
  apis: ['./index.js', './api/*.js'],
};

const specs = swaggerJsdoc(options);

// CORS checks
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(bodyParser.json()); // Parse JSON request bodies

/**
 * @swagger
 * /:
 *  get:
 *      summary: This endpoint is used to check if the server is listening on the specified port or not.
 *      description: This endpoint is used to check if the server is listening on the specified port or not.
 *      responses:
 *          200:
 *              description: To test GET method
 */

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/addNote', addNote);
app.use('/api/changePassword', changePassword);
app.use('/api/checkExistence', checkExistence);
app.use('/api/checkUserEmailPhone', checkUserEmailPhone);
app.use('/api/deleteNote', deleteNote);
app.use('/api/fetchNote', fetchNote);
app.use('/api/fetchUserProfile', fetchUserProfile);
app.use('/api/handleOtp', handleOtp);
app.use('/api/login', login);
app.use('/api/searchNote', searchNote);
app.use('/api/signup', signup);
app.use('/api/sortNote', sortNote);
app.use('/api/updateNote', updateNote);
app.use('/api/updatePassword', updatePassword);
app.use('/api/updateUsername', updateUsername);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(process.env.PORT || 5000, () => {
  console.log("Server listening on port " + (process.env.PORT || 5000));
});



// ............................ SWAGGER URL :- http://localhost:4000/api-docs/#/default
// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const bodyParser = require("body-parser");

// const signupRoute = require('./api/signup'); // Import the signup route
// const loginRoute = require('./api/login'); // Import the login route
// const addNotes = require('./api/addNote'); // Import the add
// const fetchNotes = require('./api/fetchNote'); // Import the fetch
// const updateNotes = require('./api/updateNote'); // Import the update
// const deleteNotes = require('./api/deleteNote'); // Import the delete
// const sortNotes = require('./api/sortNote'); // Import the sort
// const searchNotes = require('./api/searchNote'); // Import the search
// const handleOtps = require('./api/handleOtp'); // Import the send
// const checkExistences = require('./api/checkExistence'); // Import the
// const checkUserEmailPhones = require('./api/checkUserEmailPhone'); // Import
// const updatePasswords = require('./api/updatePassword'); // Import the update
// const fetchUserProfiles = require('./api/fetchUserProfile'); // Import
// const updateUsernames = require('./api/updateUsername');
// const changePasswords = require('./api/changePassword');

// dotenv.config();

// const app = express();


// // CORS checks
// app.use(cors({
//   origin: process.env.FRONTEND_URL,
//   credentials: true,
// }));


// app.use(bodyParser.json()); // Parse JSON request bodies

// // Routes
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// // Mount the /api/signup route
// app.use('/api/signup', signupRoute);
// app.use('/api/login', loginRoute);
// app.use('/api/addNote', addNotes);
// app.use('/api/fetchNote', fetchNotes);
// app.use('/api/updateNote', updateNotes);
// app.use('/api/deleteNote', deleteNotes);
// app.use('/api/sortNote', sortNotes);
// app.use('/api/searchNote', searchNotes);
// app.use('/api/handleOtp', handleOtps);
// app.use('/api/checkExistence', checkExistences);
// app.use('/api/checkUserEmailPhone', checkUserEmailPhones);
// app.use('/api/updatePassword', updatePasswords);
// app.use('/api/fetchUserProfile', fetchUserProfiles);
// app.use('/api/updateUsername', updateUsernames);
// app.use('/api/changePassword', changePasswords);

// // app.listen(process.env.PORT || 5000, () => {
// //     console.log("Server listening on port " + process.env.PORT || 5000)
// // })

// app.listen(process.env.PORT || 4000, "0.0.0.0", () => {
//   console.log("Server listening on port " + (process.env.PORT || 4000));
// });







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
      title: 'Note Taking Application | Leapfrog ',
      version: '1.0.0',
      description: 'API documentation for the Leapfrog Note-Taking Application',
    },
    servers: [
      {
        url: `http://20.197.52.87:${process.env.PORT || 4000}`,
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

app.use(bodyParser.json());

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

app.listen(process.env.PORT || 4000, "0.0.0.0", () => {
  console.log("Server listening on port " + (process.env.PORT || 4000));
});
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require("body-parser");

const signupRoute = require('./api/signup'); // Import the signup route
const loginRoute = require('./api/login'); // Import the login route
const addNotes = require('./api/addNote'); // Import the add
const fetchNotes = require('./api/fetchNote'); // Import the fetch
const updateNotes = require('./api/updateNote'); // Import the update
const deleteNotes = require('./api/deleteNote'); // Import the delete
const sortNotes = require('./api/sortNote'); // Import the sort
const searchNotes = require('./api/searchNote'); // Import the search
const handleOtps = require('./api/handleOtp'); // Import the send
const checkExistences = require('./api/checkExistence'); // Import the
const checkUserEmailPhones = require('./api/checkUserEmailPhone'); // Import
const updatePasswords = require('./api/updatePassword'); // Import the update
const fetchUserProfiles = require('./api/fetchUserProfile'); // Import
const updateUsernames = require('./api/updateUsername');
const changePasswords = require('./api/changePassword');

dotenv.config();

const app = express();



// CORS checks
app.use(cors({
  origin: "https://20.197.52.87:3000",
  credentials: true,
}));


app.use(bodyParser.json()); // Parse JSON request bodies

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Mount the /api/signup route
app.use('/api/signup', signupRoute);
app.use('/api/login', loginRoute);
app.use('/api/addNote', addNotes);
app.use('/api/fetchNote', fetchNotes);
app.use('/api/updateNote', updateNotes);
app.use('/api/deleteNote', deleteNotes);
app.use('/api/sortNote', sortNotes);
app.use('/api/searchNote', searchNotes);
app.use('/api/handleOtp', handleOtps);
app.use('/api/checkExistence', checkExistences);
app.use('/api/checkUserEmailPhone', checkUserEmailPhones);
app.use('/api/updatePassword', updatePasswords);
app.use('/api/fetchUserProfile', fetchUserProfiles);
app.use('/api/updateUsername', updateUsernames);
app.use('/api/changePassword', changePasswords);

// app.listen(process.env.PORT || 5000, () => {
//     console.log("Server listening on port " + process.env.PORT || 5000)
// })

app.listen(process.env.PORT || 4000, "0.0.0.0", () => {
  console.log("Server listening on port " + (process.env.PORT || 4000));
});
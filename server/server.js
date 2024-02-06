// server/server.js
const express = require('express');
const cors = require('cors');
const http = require('http').createServer(express);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
require('./passport-config'); // Import the Passport configuration

const PORT = process.env.PORT || 3001;

const app = express();

app.use(
  session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cors());

// Existing routes
app.get('/', (req, res) => {
  res.send('Collaborative Code Editor Server');
});

// Use Passport middleware for authentication routes
app.use('/auth', authRoutes);

// MongoDB connection (replace with your connection string)
mongoose.connect('mongodb://localhost/collaborative-code-editor', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Existing socket.io code
io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('createRoom', (roomCode) => {
    console.log(`Room created with code: ${roomCode}`);

    // Perform any additional logic here (e.g., create a new room in your application)

    // Broadcast the new room code to all connected clients
    io.emit('newRoomCreated', roomCode);
  });

  // Handle real-time collaboration events
  socket.on('codeChange', (code) => {
    io.emit('codeChange', code);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

http.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

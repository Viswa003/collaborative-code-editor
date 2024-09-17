const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose.connect('mongodb://localhost/collaborative-code-editor', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// User model
const User = mongoose.model('User', {
  username: String,
  password: String,
});

// Room model
const Room = mongoose.model('Room', {
  roomId: String,
  name: String,
  participants: [String],
  messages: [{
    sender: String,
    content: String,
    timestamp: Date
  }],
  code: String
});

// Passport configuration
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Authentication routes
app.post('/auth/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ status: 'failure', message: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    req.login(newUser, (err) => {
      if (err) {
        return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
      }
      return res.status(201).json({ status: 'success', user: { username: newUser.username } });
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

app.post('/auth/login', passport.authenticate('local'), (req, res) => {
  res.json({ status: 'success', user: { username: req.user.username } });
});

app.get('/auth/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.json({ status: 'success' });
  });
});

app.get('/auth/checkAuth', (req, res) => {
  res.json({ authenticated: req.isAuthenticated() });
});


app.post('/api/rooms', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ status: 'failure', message: 'Not authenticated' });
  }
  try {
    const { name } = req.body;
    const roomId = Math.random().toString(36).substring(7); // Generate a random room ID
    const newRoom = new Room({ roomId, name, participants: [req.user.username], code: '' });
    await newRoom.save();
    console.log('Room created:', newRoom);
    res.status(201).json({ status: 'success', room: newRoom });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});


app.post('/room/create', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ status: 'failure', message: 'Not authenticated' });
  }
  try {
    const { name } = req.body;
    const roomId = Math.random().toString(36).substring(7); // Generate a random room ID
    const newRoom = new Room({ roomId, name, participants: [req.user.username], code: '' });
    await newRoom.save();
    console.log('Room created:', newRoom);
    res.status(201).json({ status: 'success', room: newRoom });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

app.get('/room/:roomId', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ status: 'failure', message: 'Not authenticated' });
  }
  try {
    const room = await Room.findOne({ roomId: req.params.roomId });
    if (!room) {
      return res.status(404).json({ status: 'failure', message: 'Room not found' });
    }
    console.log('Room found:', room);
    res.json({ status: 'success', room });
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

// Socket.io
io.on('connection', (socket) => {
  console.log('New client connected');

  // In the 'joinRoom' event handler
socket.on('joinRoom', async (roomId, username) => {
  try {
    const room = await Room.findOne({ roomId });
    if (room) {
      socket.join(roomId);
      if (!room.participants.includes(username)) {
        room.participants.push(username);
        await room.save();
      }
      // Broadcast updated participants list to all clients in the room
      io.in(roomId).emit('updateParticipants', room.participants);
      
      // Send initial room data to the joining user
      socket.emit('initialRoomData', {
        code: room.code,
        messages: room.messages,
        language: room.language,
        participants: room.participants
      });
      socket.emit('joinedRoom', { success: true });
      
      // Notify other participants that a new user has joined
      socket.to(roomId).emit('userJoined', username);
    } else {
      socket.emit('joinedRoom', { success: false, message: 'Room not found' });
    }
  } catch (error) {
    console.error('Error joining room:', error);
    socket.emit('joinedRoom', { success: false, message: 'Error joining room' });
  }
});

// In the 'sendMessage' event handler
socket.on('sendMessage', async (roomId, username, message) => {
  try {
    const room = await Room.findOne({ roomId });
    if (room) {
      const newMessage = { sender: username, content: message, timestamp: new Date() };
      room.messages.push(newMessage);
      await room.save();
      // Broadcast to all clients in the room including the sender
      io.in(roomId).emit('chatMessage', newMessage);
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
});

  socket.on('leaveRoom', async (roomId, username) => {
    console.log(`leaveRoom: ${roomId}, ${username}`);
    socket.leave(roomId);
    try {
      const room = await Room.findOne({ roomId });
      if (room) {
        room.participants = room.participants.filter(p => p !== username);
        await room.save();
        // Broadcast updated participants list to all clients in the room
        io.to(roomId).emit('updateParticipants', room.participants);
        // Notify other participants that a user has left
        socket.to(roomId).emit('userLeft', username);
      }
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  });

  socket.on('codeChange', async (roomId, newCode) => {
    try {
      const room = await Room.findOne({ roomId });
      if (room) {
        room.code = newCode;
        await room.save();
        // Broadcast to all clients in the room except the sender
        socket.to(roomId).emit('codeChange', newCode);
      }
    } catch (error) {
      console.error('Error updating code:', error);
    }
  });

  socket.on('sendMessage', async (roomId, username, message) => {
    try {
      const room = await Room.findOne({ roomId });
      if (room) {
        const newMessage = { sender: username, content: message, timestamp: new Date() };
        room.messages.push(newMessage);
        await room.save();
        // Broadcast to all clients in the room including the sender
        io.to(roomId).emit('chatMessage', newMessage);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  // Handle updating the participants list
socket.on('updateParticipants', (participants) => {
  const participantsList = document.getElementById('participantsList');
  participantsList.innerHTML = '';
  participants.forEach(participant => {
    const li = document.createElement('li');
    li.textContent = participant;
    participantsList.appendChild(li);
  });
});

// Handle new chat messages
socket.on('chatMessage', (message) => {
  const chatMessages = document.getElementById('chatMessages');
  const messageElement = document.createElement('div');
  messageElement.innerHTML = `<strong>${message.sender}:</strong> ${message.content}`;
  chatMessages.appendChild(messageElement);
});

  socket.on('languageChange', async (roomId, newLanguage) => {
    try {
      const room = await Room.findOne({ roomId });
      if (room) {
        room.language = newLanguage;
        await room.save();
        // Broadcast to all clients in the room including the sender
        io.to(roomId).emit('languageChange', newLanguage);
      }
    } catch (error) {
      console.error('Error changing language:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(3001, () => {
  console.log('Server is running on port 3001');
});
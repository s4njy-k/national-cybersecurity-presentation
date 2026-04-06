const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const SECRET_TOKEN = 'admin'; // Hardcoded for this exercise

// Protected route middleware for the presenter
const authMiddleware = (req, res, next) => {
  if (req.query.secret === SECRET_TOKEN) {
    next();
  } else {
    res.status(401).send('Unauthorized. Please use ?secret=admin');
  }
};

app.use(express.static('public', { index: false }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/presenter', authMiddleware, (req, res) => {
  res.sendFile(__dirname + '/public/presenter.html');
});

// Global state
let currentSlideIndex = 0;
let presenterSocketId = null;

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  
  const isPresenter = socket.handshake.auth.token === SECRET_TOKEN;
  if (isPresenter) {
    presenterSocketId = socket.id;
    console.log(`Presenter authenticated: ${socket.id}`);
  }

  // Late joiner sync
  socket.emit('initSlide', { index: currentSlideIndex });

  socket.on('slideChange', (data) => {
    if (socket.id === presenterSocketId && typeof data.index === 'number') {
      currentSlideIndex = data.index;
      // Broadcast to EVERYONE (viewers and presenter themselves)
      io.emit('slideUpdate', { index: currentSlideIndex });
    } else {
      console.warn(`Unauthorized or malformed slide change from ${socket.id}`);
    }
  });

  socket.on('disconnect', () => {
    if (socket.id === presenterSocketId) {
      presenterSocketId = null;
      console.log('Presenter disconnected');
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT} on IPv4 0.0.0.0`);
});

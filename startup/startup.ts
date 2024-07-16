import express from 'express';
import session from 'express-session';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import UserService from '../src/users/userService';
import MessageController from '../src/messages/messageController';
const jwt = require('jsonwebtoken');

export const database = require('./../middlewares/db');


const app = express();

const server = http.createServer(app);
server.keepAliveTimeout = 300000;
server.headersTimeout = 310000;

const io = new Server(server, {
  pingInterval: 10000,
  pingTimeout: 5000,
});


const MemoryStore = session.MemoryStore;
const store = new MemoryStore();

app.use(session({
  secret: 'keykeykey',
  cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 },
  saveUninitialized: false,
  resave: false,
  store
}));

app.use(express());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userService = new UserService();
const messageController = new MessageController();

const nameTokenMap = new Map<string, string>();
const userSocketMap = new Map<string, string>();

app.get('/', (req: any, res: any) => {
  res.sendFile(path.join(__dirname, '..', '..', 'static', 'login.html'));
});

app.post('/login', async (req: any, res: any) => {
  try {
    if(!nameTokenMap.has(req.body.username)){
      const token = jwt.sign({ username: req.body.username}, 'thisismykey');

      nameTokenMap.set(req.body.username, token);

      const user = await userService.createUser(req, res);

      io.emit('someonelogged', { username: req.body.username });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/message', async (req: any, res: any) => {
  io.emit('chat message', {message: req.body.input});
});

app.post('/hash', (req: any, res: any) => {
  const token = nameTokenMap.get(req.body.name);
  res.json(token);
});

app.post('/disconnect', async (req, res) => {
  try {
    const { username } = req.body;
    console.log("the guy that disconnected: ", username);
    if (username) {
      await userService.deleteUser(username);
      nameTokenMap.delete(username);
      io.emit('someoneleft', { username });
      res.status(200).send('User disconnected');
    } else {
      res.status(400).send('Username is required');
    }
  } catch (error) {
    console.error('Error during disconnect:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/online', async (req: any, res: any) => {
  const users = await userService.getOnlineUsers(req, res);

  res.json(users);
});

app.get('/chat/:from/:to', async (req: any, res: any) => {
  res.sendFile(path.join(__dirname, '..', '..', 'static', 'index.html'));
});

app.post('/addmessage', async (req:any,res:any) => {
  try {
    const msg = await messageController.createMessage(req, res);

  }
  catch (error) {
    console.log(error);
  }
});

app.post('/getmessages', async (req:any,res:any) => {
  const messages = await messageController.getMessages(req,res);

  res.json(messages);
});

app.use(express.static('static'));

// Socket.io Handling --------------------------------------------------------------
io.on('connection', (socket: any) => {
  console.log('A user connected. Total users:', io.engine.clientsCount);
  const userName = socket.handshake.query.userName;
  userSocketMap.set(userName, socket.id);

  socket.on('disconnect', () => { 
    console.log('User disconnected. Total users:', io.engine.clientsCount);
    userSocketMap.delete(userName);
  });

  socket.on('chat message', (data: any) => {
    const recipientSocket = userSocketMap.get(data.recipient);
    if (recipientSocket) {
      io.to(recipientSocket).emit('chat message', data.message);
    }
  });
});

// Start the server and listen on port 3000 -------------------------------------
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

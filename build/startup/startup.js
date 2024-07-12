"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const socket_io_1 = require("socket.io");
const userService_1 = __importDefault(require("../src/users/userService"));
const jwt = require('jsonwebtoken');
exports.database = require('./../middlewares/db');
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
server.keepAliveTimeout = 300000;
server.headersTimeout = 310000;
const io = new socket_io_1.Server(server, {
    pingInterval: 10000,
    pingTimeout: 5000,
});
const MemoryStore = express_session_1.default.MemoryStore;
const store = new MemoryStore();
app.use((0, express_session_1.default)({
    secret: 'keykeykey',
    cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 },
    saveUninitialized: false,
    resave: false,
    store
}));
app.use((0, express_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const userService = new userService_1.default();
const nameTokenMap = new Map();
const userSocketMap = new Map();
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '..', '..', 'static', 'login.html'));
});
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!nameTokenMap.has(req.body.username)) {
            const token = jwt.sign({ username: req.body.username }, 'thisismykey');
            nameTokenMap.set(req.body.username, token);
            const user = yield userService.createUser(req, res);
            io.emit('someonelogged', { username: req.body.username });
        }
    }
    catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }
}));
app.get('/message', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    io.emit('chat message', { message: req.body.input });
}));
app.post('/hash', (req, res) => {
    const token = nameTokenMap.get(req.body.name);
    res.json(token);
});
app.post('/disconnect', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.body;
        console.log("the guy that disconnected: ", username);
        if (username) {
            yield userService.deleteUser(username);
            nameTokenMap.delete(username);
            io.emit('someoneleft', { username });
            res.status(200).send('User disconnected');
        }
        else {
            res.status(400).send('Username is required');
        }
    }
    catch (error) {
        console.error('Error during disconnect:', error);
        res.status(500).send('Internal Server Error');
    }
}));
app.get('/online', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userService.getOnlineUsers(req, res);
    res.json(users);
}));
app.get('/chat/:from/:to', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.sendFile(path_1.default.join(__dirname, '..', '..', 'static', 'index.html'));
}));
app.use(express_1.default.static('static'));
// Socket.io Handling --------------------------------------------------------------
io.on('connection', (socket) => {
    console.log('A user connected. Total users:', io.engine.clientsCount);
    const userName = socket.handshake.query.userName;
    userSocketMap.set(userName, socket.id);
    socket.on('disconnect', () => {
        console.log('User disconnected. Total users:', io.engine.clientsCount);
        userSocketMap.delete(userName);
    });
    socket.on('chat message', (data) => {
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

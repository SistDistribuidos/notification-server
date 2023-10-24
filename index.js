const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  );
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
      origin: "http://127.0.0.1:3000",
    }
  });

app.use(cors());

app.post('/:user_id', (req, res) => {
  const user = req.params.user_id;
  const { message } = req.body;
  io.to(user).emit('messageFromServer', message)
  res.json({
    state: true,
    mess: 'Operation complete'
  }).status(200);
});

let rooms = [];
io.on('connection', async (socket) => {
    console.log('connected successfully');
    const auth = socket.handshake.auth;
    console.log('usuario conectado', auth);
    socket.join(auth.roomId);
    socket.userConnected = auth;

    socket.on('disconnect', () => {
       console.log(`${socket.userConnected.userId} se ha desconectado`);
    });
});

server.listen(5000, () => {
  console.log('server running at http://localhost:5000');
});
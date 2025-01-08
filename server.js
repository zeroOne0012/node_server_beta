const express = require('express');
const app = express();
const port = 8000;
const cors = require('cors');
const bodyParser = require("body-parser");


// middle ware
app.use(cors('*'));
app.use(express.json());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// api server
const user_api = require('./server/api/user');
app.use('/user', user_api);
const chat_api = require('./server/api/chat');
app.use('/chat', chat_api);


// ws server
const http = require('http');
const server = http.createServer(app);
const setupSocket = require('./server/ws/ws_eggtec');
const io = setupSocket(server);


// app.get("/", (req, res) => res.send("hello world"));	
server.listen(port, () => console.log(`On ${port}!`));

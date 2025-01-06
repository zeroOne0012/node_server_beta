const express = require('express');
const app = express();
const port = 8000;
const cors = require('cors');


// middle ware
app.use(cors());
app.use(express.json());


// api server
const user_api = require('./server/api/user');
app.use('/user', user_api);
const chat_api = require('./server/api/chat');
app.use('/chat', chat_api);


// https 허용 -> https://designerkhs.tistory.com/47
const fs = require('fs');
const options = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
};



const setupSocket = require('./server/ws/ws_eggtec');

// ws server(+api server) (https)
const https = require('https');
const https_server = https.createServer(options, app);
https_server.listen(8001, () => console.log(`On ${8001}!`));
// wss://localhost:8000/room1
const io = setupSocket(https_server);


// ws server(+api server) (http)
const http = require('http');
const http_server = http.createServer(app); // no options !!
http_server.listen(port, () => console.log(`On ${port}!`));
// ws://localhost:8001/room1
const http_io = setupSocket(http_server);



// app.get("/", (req, res) => res.send("hello world"));	


process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
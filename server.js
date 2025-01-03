const express = require('express');
const app = express();
const port = 8000;
app.use(express.json());
const http = require('http');
const setupSocket = require('./server/ws');


// api server
const api_server = require('./server/api');
app.use('/api', api_server);


// ws server
const server = http.createServer(app);
const io = setupSocket(server);



app.get("/", (req, res) => res.send("hello world"));	
server.listen(port, () => console.log(`On ${port}!`));

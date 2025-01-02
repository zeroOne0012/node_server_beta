const express = require('express');
const app = express();
const port = 8000;
app.use(express.json());


// api server
const api_server = require('./server/api');
app.use('/api', api_server);


app.get("/", (req, res) => res.send("hello world"));	
app.listen(port, () => console.log(`On ${port}!`));

// git test
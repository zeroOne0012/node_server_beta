const SocketIO = require("socket.io");
require('dotenv').config();
const { Client } = require("pg");
const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
client.connect();


module.exports = (server) => {
  const io = SocketIO(server, { 
    cors: {
        origin: '*', 
    },
   });
  io.on("connection", async (socket) => {

    // connect
    const userId = socket.handshake.query.userid;
    const chatId = socket.handshake.query.chatid;
    const query =`
    SELECT CHAT_ID
    FROM CHAT_ROOM
    WHERE CHAT_ID=$1
    AND USER_ID=$2;
    `;
    const {rows} = await client.query(query, [chatId, userId]);
    if(rows.length!==1){
        socket.emit("message", {message: "Bad Request"});
        socket.close();
    }
    console.log("Client connected:", socket.id);


    // disconnect
    socket.on('disconnect', function(){
        console.log('Client disconnected');
    });

    // error
    socket.on('error', (error) => {
        console.error(error);
     });
    
    // reply
    socket.on("message", (msg) => {
        const parsedMsg = JSON.parse(msg);
        socket.emit("message", {message: parsedMsg.msg});
    });
    
  });
  
};
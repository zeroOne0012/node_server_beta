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
    const userId = socket.handshake.query.userid;
    const chatId = socket.handshake.query.chatid;

    // connect
    try{
        const user_query =`
        SELECT USER_ID
        FROM USERS
        WHERE USER_ID=$1;
        `;
        const user_result = await client.query(user_query, [userId]);

        const chat_query =`
        SELECT CHAT_ID
        FROM CHAT_ROOM
        WHERE CHAT_ID=$1;
        `;
        const chat_result = await client.query(chat_query, [chatId]);
        if(user_result.rows.length===0 || chat_result.rows.length===0){
            socket.emit("message", "Bad Request");
            socket.close();
        }
        console.log("Client connected:", socket.id);
    }catch(err){
        console.error(err);
        socket.emit("message", "Server Error" );
        socket.close();
    }


    // disconnect
    socket.on('disconnect', function(){
        console.log('Client disconnected');
    });

    // error
    socket.on('error', (err) => {
        console.error(err);
     });
    
    // reply
    socket.on("message", async (msg) => {
        if(JSON.parse(msg).userid != userId){
            return socket.emit("message", "Bad Request");
        };
        const parsedMsg = JSON.parse(msg).msg;
        try{
            query = `
            INSERT INTO CHAT_MSG(MSG, USER_ID, CHAT_ID)
            VALUES($1, $2, $3);
            `;
            const {rows} = await client.query(query, [parsedMsg, userId, chatId]);
            socket.emit("message", {message: parsedMsg});
        }catch(err){
            console.log(err);
            socket.emit("message", "Server Error");
        }

    });
    
  });
  
};
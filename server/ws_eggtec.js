const SocketIO = require("socket.io");
// require('dotenv').config();
// const { Client } = require("pg");
// const client = new Client({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT,
// });
// client.connect();

const PSWD = "0000";

module.exports = (server) => {
  const io = SocketIO(server, { 
    cors: {
        origin: '*', 
    },
   });
  io.on("connection", async (socket) => {
    const pswd = socket.handshake.query.pswd;

    // connect
    if(pswd!==PSWD){
        socket.emit("message", "Wrong pswd");
        socket.close();
    }
    console.log("Client connected:", socket.id);



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
        // if(JSON.parse(msg).userid != userId){
        //     return socket.emit("message", "Bad Request");
        // };
        // const parsedMsg = JSON.parse(msg).content;
        // try{
        //     query = `
        //     INSERT INTO CHAT_MSG(MSG, USER_ID, CHAT_ID)
        //     VALUES($1, $2, $3);
        //     `;
        //     const {rows} = await client.query(query, [parsedMsg, userId, chatId]);
        //     io.emit("message", {message: parsedMsg});
        // }catch(err){
        //     console.log(err);
        //     io.emit("message", "Server Error");
        // }

    });
    
  });
  
};
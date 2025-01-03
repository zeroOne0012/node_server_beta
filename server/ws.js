const SocketIO = require("socket.io");

log=[]

module.exports = (server) => {
  const io = SocketIO(server, { path: "/socket.io" });
  io.on("connection", (socket) => {

    // connect
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
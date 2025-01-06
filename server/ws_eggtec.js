const SocketIO = require('socket.io');
const getRoomState = require('./getRoomState')
const roomState = {
    CAM1: 0,
    CAM2: 0,
    Analysis: 0,
    Encorder: 0,
}
let connectedUsers = 0;

module.exports = (server) => {
  const io = SocketIO(server, { 
    cors: {
        origin: '*', 
    },
   });
  io.on('connection', async (socket) => {

    // connect
    connectedUsers++;
    console.log('Client connected:', connectedUsers, socket.id);
    io.emit('message', connectedUsers);

    // disconnect
    socket.on('disconnect', function(){
        connectedUsers--;
        console.log('Client disconnected', connectedUsers);
    });

    // error
    socket.on('error', (err) => {
        console.error(err);
     });
    
    // room state reply
    socket.on('message', async (msg) => {
        try{
            const roomName = JSON.parse(msg).room;
            socket.join(roomName);
            socket.emit('message', {state:roomState[roomName], 'message':getRoomState(roomName, roomState[roomName])});
        }catch(err){
            socket.emit('message', 'Invalid message format');
        }
    });

    // change test
    socket.on('message', (data) => {
        try {
            const { event, roomName, newState } = JSON.parse(data);
            if (event === 'updateRoomState') {
                if (rooms[roomName] && [0, 1, 2].includes(newState)) {
                    rooms[roomName].state = newState;
                    io.to(roomName).emit('roomState', newState);
                } else {
                    socket.emit('error', 'Invalid room or state');
                }
            }
        } catch (error) {
            socket.emit('error', 'Invalid JSON format');
        }
    });
    
  });
  
};
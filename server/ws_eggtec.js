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
    const serverIO = SocketIO(server, { 
        cors: {
            origin: '*', 
        },
    });

    const roomStateUpdate = serverIO.of('/roomStateUpdate');

    roomStateUpdate.on('connection', async (socket) => {

        // connect
        console.log('admin connected:', socket.id);

        // disconnect
        socket.on('disconnect', function(){
            console.log('disconnected');
        });

        // error
        socket.on('error', (err) => {
            console.error(err);
        });

        // change test
        socket.on('message', (data) => {
            try {
                const { event, roomName, newState } = JSON.parse(data);
                if (event == 'updateRoomState') {
                    if (roomName in roomState && [0, 1, 2].includes(newState)) {
                        roomState[roomName].state = newState;
                        roomStateListen.to(roomName).emit('message', newState);
                        socket.emit('message', {changed:newState});
                    } else {
                        socket.emit('message', 'Invalid room or state');
                    }
                }
            } catch (error) {
                socket.emit('message', 'Invalid JSON format');
            }
        });

    });

    const roomStateListen = serverIO.of('/roomState');
    roomStateListen.on('connection', async (socket) => {

        // connect
        connectedUsers++;
        console.log('Client connected:', connectedUsers, socket.id);
        roomStateListen.emit('message', connectedUsers);

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


    });

};
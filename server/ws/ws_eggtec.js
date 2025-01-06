const SocketIO = require('socket.io');
const getRoomState = require('../methods/getRoomStateMessage')
const roomState = {
    CAM1: 0,
    CAM2: 0,
    Analysis: 0,
    Encorder: 0,
}
const connectedUsers = {
    CAM1: 0,
    CAM2: 0,
    Analysis: 0,
    Encorder: 0,
}
const roomNum = {
    CAM1: "room1",
    CAM2: "room2",
    Analysis: "room3",
    Encorder: "room4",
}


function setupNamespace(serverIO, namespace) {
    // namespace setting (/room1, /room2, ...)
    const nsp = serverIO.of(`/${roomNum[namespace]}`);
    
    nsp.on('connection', async (socket) => {
        // connect
        connectedUsers[namespace]++;
        socket.emit('message', { state: roomState[namespace], message: getRoomState(namespace, roomState[namespace]) });
        console.log(`${namespace} connected:`, connectedUsers[namespace]);

        // disconnect
        socket.on('disconnect', () => {
            connectedUsers[namespace]--;
            console.log(`Client disconnected from ${namespace}`, connectedUsers[namespace]);
        });

        // error
        socket.on('error', (err) => {
            console.error(`${namespace} error:`, err);
        });

        // message
        socket.on('message', async (msg) => {
            try {
                const { message } = JSON.parse(msg);
                socket.emit('message', { message });
            } catch (err) {
                socket.emit('message', 'Invalid message format');
            }
        });
    });
}

module.exports = (server) => {
    const serverIO = SocketIO(server, { 
        cors: {
            origin: '*', 
        },
    });

    ['CAM1', 'CAM2', 'Encorder', 'Analysis'].forEach(namespace => setupNamespace(serverIO, namespace));


    process.stdin.on('data', (data) => {
        const input = data.toString().trim();
        console.log(`Server Input: ${input}`);
        if (input === 'exit') {
            console.log('Server shutting down...');
            process.exit();
        }
        serverIO.of('/room1').emit('message', { message: `Server says: ${input}` });
    });

};
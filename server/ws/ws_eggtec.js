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
                nsp.emit('message', { message });
            } catch (err) {
                socket.emit('message', 'Invalid message format');
            }
        });

        // custom event test
        socket.on('msg', async (msg) => {
            try {
                const { message } = JSON.parse(msg);
                nsp.emit('msg', { message });
            } catch (err) {
                socket.emit('msg', 'Invalid message format');
            }
        });

        // image broadcast test
        socket.on('send_image', (data) => {
            console.log(`Received image in ${namespace}`);
            nsp.emit('receive_image', data);  // 모든 클라이언트에게 전송
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

    // 서버 콘솔 입력으로 상태 변경 테스트; input ex) CAM1 1
    process.stdin.on('data', (data) => { 
        const input = data.toString().trim(); 
        const inputs = input.split(' ');
        const updateNsp = inputs[0];
        const newState = parseInt(inputs[1]);
        if(updateNsp in roomNum && newState in [-1, 0, 1]){
            roomState[updateNsp] = newState;
            serverIO.of(`/${roomNum[updateNsp]}`).emit('message', {state: newState, message: getRoomState(updateNsp, newState) });
            console.log(`State changed! ${updateNsp}: ${newState}`);
        }else{
            console.log('Invalid input');
        }
    });

};


// const [letter, numStr] = input.trim().split(/\s+/);  // 정규표현식 긴 공백

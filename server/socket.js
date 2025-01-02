const socketIo = require('socket.io');

// Socket.IO 서버 설정 함수
const setupSocket = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: "*", // 필요한 경우 허용할 도메인으로 변경
            methods: ["GET", "POST"],
        },
    });

    // 클라이언트 연결 처리
    io.on('connection', (socket) => {
        console.log('새 클라이언트 연결됨:', socket.id);

        // 메시지 수신 및 응답 예제
        socket.on('message', (data) => {
            console.log('클라이언트 메시지:', data);
            socket.emit('response', `서버로부터 응답: ${data}`);
        });

        // 연결 종료 처리
        socket.on('disconnect', () => {
            console.log('클라이언트 연결 종료:', socket.id);
        });
    });

    return io;
};

module.exports = setupSocket;

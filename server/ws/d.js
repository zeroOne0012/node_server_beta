const SocketIO = require('socket.io');
const connectedUsers = {
    CAM1: 0,
    CAM2: 0,
    Analysis: 0,
    Encorder: 0,
}

module.exports = (server) => {
    const serverIO = SocketIO(server, { 
        cors: {
            origin: '*', 
        },
    });

    // CAM1
    const cam1 = serverIO.of('/cam1');

    // CAM2
    const cam2 = serverIO.of('/cam2');

    // Analysis
    const analysis = serverIO.of('/analysis');

    // Encorder
    const encorder = serverIO.of('/encorder');


    // CAM1
    cam1.on('connection', async (socket) => {

        // connect
        connectedUsers['CAM1']++;
        cam1.emit('message', {status: 1, message: "CAM01 is connected"});
        console.log('CAM01 connected:', connectedUsers['CAM1']);

        // disconnect
        socket.on('disconnect', function(){
            connectedUsers['CAM1']--;
            socket.emit('message', {status: 0, message: "CAM01 is disconnected"});
            console.log('CAM01 disconnected', connectedUsers['CAM1']);
        });

        // error
        socket.on('error', (err) => {
            socket.emit('message', {status: -1, message: "CAM01 is error"});
        });

        // message
        socket.on('message', async (msg) => {
            try{
                const {message} = JSON.parse(msg);
                socket.emit("message", {message: message});
            }catch(err){
                socket.emit('message', 'Invalid message format');
            }
        });
    });


    // CAM2
    cam2.on('connection', async (socket) => {

        // connect
        connectedUsers['CAM2']++;
        cam2.emit('message', {status: 1, message: "CAM02 is connected"});
        console.log('CAM2 connected:', connectedUsers['CAM2']);
    
        // disconnect
        socket.on('disconnect', function(){
            connectedUsers['CAM2']--;
            socket.emit('message', {status: 0, message: "CAM02 is disconnected"});
            console.log('CAM2 disconnected', connectedUsers['CAM2']);
        });
    
        // error
        socket.on('error', (err) => {
            socket.emit('message', {status: -1, message: "CAM02 is error"});
        });
    
        // message
        socket.on('message', async (msg) => {
            try{
                const {message} = JSON.parse(msg);
                socket.emit("message", {message: message});
            }catch(err){
                socket.emit('message', 'Invalid message format');
            }
        });
    });
    
    // Analysis
    analysis.on('connection', async (socket) => {

        // connect
        connectedUsers['Analysis']++;
        analysis.emit('message', {status: 1, message: "Analysis is running"});
        console.log('Analysis connected:', connectedUsers['Analysis']);
    
        // disconnect
        socket.on('disconnect', function(){
            connectedUsers['Analysis']--;
            socket.emit('message', {status: 0, message: "Analysis is stopped"});
            console.log('Analysis disconnected', connectedUsers['Analysis']);
        });
    
        // error
        socket.on('error', (err) => {
            socket.emit('message', {status: -1, message: err});
        });
    
        // message
        socket.on('message', async (msg) => {
            try{
                const {message} = JSON.parse(msg);
                socket.emit("message", {message: message});
            }catch(err){
                socket.emit('message', 'Invalid message format');
            }
        });
    });
    
    // Encorder
    encorder.on('connection', async (socket) => {

        // connect
        connectedUsers['Encorder']++;
        encorder.emit('message', {status: 1, message: "Encorder is connected"});
        console.log('Encorder connected:', connectedUsers['Encorder']);
    
        // disconnect
        socket.on('disconnect', function(){
            connectedUsers['Encorder']--;
            socket.emit('message', {status: 0, message: "Encorder is disconnected"});
            console.log('Encorder disconnected', connectedUsers['Encorder']);
        });
    
        // error
        socket.on('error', (err) => {
            socket.emit('message', {status: -1, message: "Encorder is error"});
        });
    
        // message
        socket.on('message', async (msg) => {
            try{
                const {message} = JSON.parse(msg);
                socket.emit("message", {message: message});
            }catch(err){
                socket.emit('message', 'Invalid message format');
            }
        });
    });
    
};
const roomMessages = {
    CAM1: new Map([
        [1, "CAM01 is connected"],
        [0, "CAM01 is disconnected"],
        [-1, "CAM01 is error"]
    ]),
    CAM2: new Map([
        [1, "CAM02 is connected"],
        [0, "CAM02 is disconnected"],
        [-1, "CAM02 is error"]
    ]),
    Analysis: new Map([
        [1, "Analysis is running"],
        [0, "Analysis is stopped"],
        [-1, "Analysis is error"]
    ]),
    Encorder: new Map([
        [1, "Encorder is connected"],
        [0, "Encorder is disconnected"],
        [-1, "Encorder is error"]
    ])
};

module.exports = (roomName, state) => {
    if (!roomMessages[roomName]) return "Room Name Error";
    if (!roomMessages[roomName].has(state)) return "State Value Error";
    return roomMessages[roomName].get(state);
};

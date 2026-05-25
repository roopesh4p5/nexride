"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitToAll = exports.emitToRide = exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
let io;
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
        socket.on('join_ride', (rideId) => {
            socket.join(rideId);
        });
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
    return io;
};
exports.initSocket = initSocket;
const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
exports.getIO = getIO;
const emitToRide = (rideId, event, data) => {
    if (io) {
        io.to(rideId).emit(event, data);
    }
};
exports.emitToRide = emitToRide;
const emitToAll = (event, data) => {
    if (io) {
        io.emit(event, data);
    }
};
exports.emitToAll = emitToAll;
//# sourceMappingURL=socketService.js.map
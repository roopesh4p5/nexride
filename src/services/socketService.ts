import { Server } from 'socket.io';
import http from 'http';

let io: Server;

export const initSocket = (server: http.Server) => {
    io = new Server(server, {
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

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

export const emitToRide = (rideId: string, event: string, data: any) => {
    if (io) {
        io.to(rideId).emit(event, data);
    }
};

export const emitToAll = (event: string, data: any) => {
    if (io) {
        io.emit(event, data);
    }
};

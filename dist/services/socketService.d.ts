import { Server } from 'socket.io';
import http from 'http';
export declare const initSocket: (server: http.Server) => Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
export declare const getIO: () => Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
export declare const emitToRide: (rideId: string, event: string, data: any) => void;
export declare const emitToAll: (event: string, data: any) => void;

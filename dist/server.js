"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const http_1 = __importDefault(require("http"));
const socketService_1 = require("./services/socketService");
const PORT = process.env.PORT || 3000;
const server = http_1.default.createServer(app_1.default);
(0, socketService_1.initSocket)(server);
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map
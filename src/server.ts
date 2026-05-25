import 'dotenv/config';
import app from './app';
import http from 'http';
import { initSocket } from './services/socketService';

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

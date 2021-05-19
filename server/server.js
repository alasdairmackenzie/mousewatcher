const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const app = express();
const server = http.createServer(app);

const io = socketIo(server, { cors: { origin: "*", } });
const { createClient } = require('redis');
const redisAdapter = require('@socket.io/redis-adapter');

const pubClient = createClient({ host: 'localhost', port: 6379 });
const subClient = pubClient.duplicate();
io.adapter(redisAdapter(pubClient, subClient));

const index = require("./routes/index");
app.use(index);

let clientList = [];
let mousePositions = [];

io.on("connection", (socket) => {
    clientList.push({
        id: socket.id,
    });

    io.emit('clientListChange', clientList)

    socket.on("message", ({ clientId, message }) => {
        io.emit('newMessage', { clientId: clientId, message: message })
    });

    socket.on("mouseMove", (position) => {
        const newMousePosition = mousePositions.find((mousePosition) => socket.id === mousePosition.clientId)

        if (!newMousePosition) {
            mousePositions.push({
                clientId: socket.id,
                position: position
            })
        }
        else {
            mousePositions = mousePositions.map((mousePosition)=> {
                mousePosition.position = mousePosition.clientId === socket.id ? position : mousePosition.position
                return mousePosition;
            })
        }

        io.emit('mousePositionsChanged', mousePositions)
    });

    socket.on("disconnect", () => {
        console.log(socket.id)
        clientList = clientList.filter(item => socket.id !== item.id)
        mousePositions = mousePositions.filter(item => socket.id !== item.clientId)
        io.emit('clientListChange', clientList)
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));

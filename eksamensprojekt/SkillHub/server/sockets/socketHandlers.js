const connectedUsers = {};

function socketHandlers(io) {
    io.on("connection", (socket) => {
        socket.on("register-user", (userId) => {
            connectedUsers[userId] = socket.id;
        });

        socket.on("send-chat-message", (data) => {
            const { text, to, timestamp, from } = data;
            if (!text) {
                return;
            }

            const recipientSocketId = connectedUsers[to];
            io.to(recipientSocketId).emit("chat-message", {
                text,
                from,
                timestamp,
                to,
            });
        });

        socket.on("disconnect", () => {
            for (const userId in connectedUsers) {
                if (connectedUsers[userId] === socket.id) {
                    delete connectedUsers[userId];
                    break;
                }
            }
        });
    });
}

export default socketHandlers;

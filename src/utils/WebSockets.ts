class WebSockets {
    users = []
    connection(client) {
        console.log("a user connected")

        client.on("disconnect", () => {
            // this.users = this.users.filter((user) => user.socketId !== client.id)
        })

        client.on("identity", (userId) => {
            this.users.push({
                socketId: client.id,
                userId: userId
            })
        })

        client.on("subscribe", (room) => {
            //this.subscribeOtherUser(room, otherUserId);
            client.join(room)
        })

        client.on("unsubscribe", (room) => {
            client.leave(room)
        })

        client.on("new-message", (data) => {
            client.to(data.roomId).emit("new-message", { message: data.post })
          //  global.io.sockets.in(data.roomId).emit("new-message", { message: data.post })

            console.log("from socket " + data)
        })
    }

    subscribeOtherUser(room, otherUserId) {
        const userSockets = this.users.filter(
            (user) => user.userId === otherUserId
        )
        userSockets.map((userInfo) => {
            const socketConn = global.io.sockets.connected(userInfo.socketId)
            if (socketConn) {
                socketConn.join(room)
            }
        })
    }
}

export default new WebSockets()
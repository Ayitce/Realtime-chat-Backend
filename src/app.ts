import express from 'express';
import * as dotenv from "dotenv";
import mongoose from 'mongoose';
import cors, { CorsOptions } from "cors";
import bodyParser from "body-parser";
import socketio from "socket.io"
import WebSockets from './utils/WebSockets';
import http from "http";
import logger from "morgan";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MAXIMUMFILE_SIZE = process.env.MAXIMUMFILE_SIZE || 10;
//const whitelist = process.env.CORS_WHITELIST?.split(',')

// const corsOptions: CorsOptions = {
//     origin: (origin: string | undefined, callback: Function) => {
//         if (!origin || whitelist?.indexOf(origin) !== -1) {
//             callback(null, true)
//         } else {
//             callback(new Error('Not allowed by CORS'))
//         }
//     },
//     credentials: true
// }


// const corsOptions = {
//     origin: "http://localhost:3000",
//     credentials: true
// };

//Create HTTP server
const server = http.createServer(app);

//Create socket connection
global.io = new socketio.Server(server, {
    cors: {
        origin: 'http://localhost:3000',  // Replace with your front-end origin
        methods: ['GET', 'POST'],
    },
})
global.io.on('connection', WebSockets.connection)

app.use(bodyParser.json({ limit: `${MAXIMUMFILE_SIZE}mb` }));
app.use(bodyParser.urlencoded({ limit: `${MAXIMUMFILE_SIZE}mb`, extended: true }));
app.use(cors());
app.use(logger("dev"));


//import Route
import AuthRoute from "./routes/auth.route"
import ChatRoomRoute from "./routes/chatRoom.route"

app.use("/api/v1/auth", AuthRoute);
app.use("/api/v1/room", ChatRoomRoute);

app.get('/', (req, res) => {
    res.send('Hello World!');
});


server.listen(PORT, async () => {
    await mongoose.connect(process.env.MONGO_DATABASE as string);
    console.log("MongoDB Connected")

    return console.log(`Express is listening at http://localhost:${PORT}`);
});
/* server.listen(PORT);

server.on("listening", async () => {
    await mongoose.connect(process.env.MONGO_DATABASE as string);
    console.log("MongoDB Connected")

    console.log(`Listening on port:: http://localhost:${PORT}/`)
}); */
/* 
app.listen(PORT, async () => {
    await mongoose.connect(process.env.MONGO_DATABASE as string);
    console.log("MongoDB Connected")

    return console.log(`Express is listening at http://localhost:${PORT}`);
}); */
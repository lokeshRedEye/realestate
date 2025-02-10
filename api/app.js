import express from 'express'
import postRoute from './routes/post.route.js'
import authRoutes from './routes/auth.route.js'
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
import cors from 'cors'
import http from "http"; 
import testRoute from './routes/test.route.js';
import userRoute from './routes/user.route.js'
import chatRoute from './routes/chat.route.js'
import messageRoute from './routes/message.route.js'
import { initializeSocket } from "./socket.js"; 

dotenv.config()

const app = express();
const __dirname = path.resolve();

const server = http.createServer(app); 

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))




app.use(express.json())
app.use(cookieParser())

app.use('/api/posts' , postRoute)
app.use('/api/auth' , authRoutes)
app.use('/api/test' , testRoute)
app.use('/api/users' , userRoute)
app.use('/api/chats' , chatRoute)
app.use('/api/messages' , messageRoute)

initializeSocket(server);




if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../api/dist")));
  
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../api", "dist", "index.html"));
    });
  }


const PORT = process.env.PORT || 8800;
server.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
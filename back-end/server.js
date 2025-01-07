require('dotenv').config()

const express = require("express")
const app = express()
const charityRoutes = require('./routes/charities')
const indexRoutes = require('./routes/index')
const upstreamRoutes = require('./routes/upstream')
const userRoutes = require('./routes/user')

const path = require("path")
const pool = require("./database/db-driver")

const cors = require("cors")
const { Server } = require("socket.io")
const http = require("http")
const server = http.createServer(app)
app.use(cors())
const origin = process.env.NODE_ENV === 'production' ? 'https://drp47-project.herokuapp.com' : 'http://localhost:3000';
const io = new Server(server, {
    cors: {
        origin: origin,
        methods: ["GET", "POST"]
    }
})

// middleware
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

app.use(express.static(path.join(__dirname, '../front-end/build')))
app.use(express.json())

// routes
app.use('/api/charities', charityRoutes)
app.use('/api/upstream', upstreamRoutes)
app.use('/api/user/', userRoutes)
app.use('/api/', indexRoutes)
app.get('*', async (req, res) => {
    res.sendFile(path.join(path.join(__dirname, '../front-end/build', 'index.html')))
})

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("view_charity", (data) => {
        socket.join(data)
    })

    socket.on("send_message", (data) => {
        // console.log(data)
        socket.to(data.room).emit("recieve_message", data)
    })
})

pool.connect()
    .then(() => {
        // Listening for requests
        server.listen(process.env.PORT, () => {
            console.log("Connected to DB and listening on port " + process.env.PORT + "...")
        })
    })
    .catch((error) => {
        console.log(error)
    })

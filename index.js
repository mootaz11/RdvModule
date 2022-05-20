const Express = require("express");
const BodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const http = require('http');
const jwt = require('jsonwebtoken');
const app = Express();
const NotificationController = require("../RdvModule/controllers/notificationController");
app.use(BodyParser.urlencoded({ extended: false }))
app.use(BodyParser.json());
app.use(cors());
app.use(morgan('tiny'));


//database connection 
const uri="mongodb://127.0.0.1:27017/rdv";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.on('err', () => { console.log('connection failed') });
mongoose.connection.on('ok', () => { console.log('connection done') })



// routes
const userRoute = require("./routes/user");
const rdvRoute = require("./routes/rdv");
const agenceRoute = require("./routes/agence");
const calendarRoute = require("./routes/calendar")
const feedbackRoute = require("./routes/feedback")
const notificationRoute = require("./routes/notification")



app.use("/user",userRoute);
app.use("/rdv", rdvRoute);
app.use("/agence", agenceRoute);
app.use("/calendar", calendarRoute);
app.use("/notification", notificationRoute);
app.use("/feedback", feedbackRoute);

app.use('/uploads', Express.static('uploads'));

const server = http.createServer(app)

const io = require('socket.io')(server,{cors: {
    origin: "*",
  }})


const connectedusers = []; 

server.listen(3000, () => {
    console.log("server is listening on 3000");
    io.on('connection', (socket) => {
        socket.on('connect-server',({token})=>{
            try {

                let user = jwt.decode(token)
                const clientIndex = connectedusers.findIndex((connected)=>{return connected.client == user.user_id});
                if(clientIndex===-1){
                    console.log(user.user_id)
                    connectedusers.push({client:user.user_id,socketIds:[socket.id]});
                }
                else {
                    console.log(user.user_id)

                    if (!connectedusers[clientIndex].socketIds.includes(socket.id))
                    connectedusers[clientIndex].socketIds.push(socket.id)
                    }
            }
            catch (err){
                console.log(err);
            } 
        })
        socket.on('disconnect-server', () => {
            const userIndex = connectedusers.findIndex(connecteduser => {
                return connecteduser.socketIds.includes(socket.id)
            })
            if (userIndex >= 0) {
                const socketIndex = connectedusers[userIndex].socketIds.findIndex(socketId => socketId === socket.id)
                connectedusers[userIndex].socketIds.splice(socketIndex, 1)
                if (connectedusers[userIndex].socketIds.length === 0) {
                    connectedusers.splice(userIndex, 1)
                }

            }
        })

        socket.on('rdv-confirmed',({clientId,notification_created})=>{
            console.log(connectedusers)

            const userIndex = connectedusers.findIndex((connecteduser) => {
                return connecteduser.client === clientId
            })
            if (userIndex >= 0)
            {
                connectedusers[userIndex].socketIds.forEach(socketId => {
                    socket.broadcast.emit('rdv-confirmed-client', {client:clientId,notification_created});
                })
            }
        })

        socket.on('rdv-notconfirmed',({clientId,notification_created})=>{
                    try {
                        socket.broadcast.emit("rdv-notconfirmed-client", {client:clientId,notification_created});
                    }
                    catch (err){    
                        console.log(err)
                    }
                })
            

     

        socket.on('rdv-created',({conseillerId,notification_created})=>{
            const userIndex = connectedusers.findIndex((connecteduser) => {
                return connecteduser.client === conseillerId
            })

            if (userIndex >= 0)
            {
                connectedusers[userIndex].socketIds.forEach(socketId => {
                    socket.broadcast.emit("rdv-created-client", {conseillerId,notification_created});
                })

            }
        })
        
        socket.on('rdv-deleted',({conseillerId,notification_created})=>{
            const userIndex = connectedusers.findIndex((connecteduser) => {
                return connecteduser.client === conseillerId
            })
            if (userIndex >= 0)
            {   console.log(conseillerId)
                connectedusers[userIndex].socketIds.forEach(socketId => {
                    socket.broadcast.emit("rdv-deleted-client",{conseillerId,notification_created});
                })
            }
        })

        socket.on('rdv-updated',({conseillerId,notification_created})=>{
            const userIndex = connectedusers.findIndex((connecteduser) => {
                return connecteduser.client === conseillerId
            })
            
            if (userIndex >= 0)
            {
                connectedusers[userIndex].socketIds.forEach(socketId => {
                    socket.broadcast.emit("rdv-updated-client",{conseillerId,notification_created});
                })
            }

        })

    

    })})



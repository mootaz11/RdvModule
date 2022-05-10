const Express = require("express");
const BodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const http = require('http');

const app = Express();

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
const io = require('socket.io')(server)




server.listen(3000, () => {

    console.log("server is listenning on 3000");

    io.on('connection', (socket) => {

        socket.on('rdv-notconfirmed',({clientId,notification_created})=>{
            console.log(notification_created)
            
        })
    })})





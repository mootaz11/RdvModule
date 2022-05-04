const Express = require("express");
const BodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");

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


app.use("/user",userRoute);
app.use("/rdv", rdvRoute);
app.use("/agence", agenceRoute);



app.use('/uploads', Express.static('uploads'));

app.listen(3000, () => {
    console.log("app is running on port " + 3000);
})
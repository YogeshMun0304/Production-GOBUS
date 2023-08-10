const express=require("express")
const app=express();
const dbConfig=require("./config/dbConfig")

const port= process.env.PORT || 5000;
const path  = require('path')
require('dotenv').config();
app.use(express.json())

const usersRoute = require('./routes/usersRoute')
const busesRoute = require("./routes/busesRoute");
const bookingsRoute=require("./routes/bookingsRoute")

app.use('/api/users',usersRoute)
app.use("/api/buses", busesRoute);
app.use("/api/bookings", bookingsRoute);
app.use(express.static(path.join(__dirname,'./client/build')))

app.get('*',function(req,res){
    res.sendFile(path.join(__dirname,'./client/build/index.html'))
})


app.listen(port, ()=>console.log(`Server running on port ${port}`));
const mongoose=require('mongoose');
require('dotenv').config();
// mongoose.connect(process.env.mongo_url)
mongoose.connect(process.env.mongo_url, { useNewUrlParser: true } )
// mongoose.connect('mongodb+srv://m001-student:BaBaBa10@m001-xposu.mongodb.net/tea?retryWrites=true&w=majority', { useNewUrlParser: true } )
const db=mongoose.connection;
db.on('connected',()=>{
    console.log("MongoDb connection succesful")
})

db.on('error',()=>{
    console.log("Connection failed")
})

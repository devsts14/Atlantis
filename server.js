const express=require('express')
const morgan=require('morgan')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const cors=require('cors')
const connectDB=require('./database/db')
const fs=require('fs');
require('dotenv').config()



// app
const app=express()

// db
connectDB()

// middleware
app.use(morgan("dev"));
app.use(bodyParser.json({limit:"2mb"}));
app.use(cors());

// route middleware
fs.readdirSync('./routes').map((r)=> app.use('/api',require("./routes/"+r)))

if(process.env.NODE_ENV === 'production'){
  app.use(express.static('client/build'));
  app.get('*',(req, res)=>{
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  })
}
// Port
const PORT = process.env.PORT || 8000

app.listen(PORT,() => console.log(`Server started on port: ${PORT}`));

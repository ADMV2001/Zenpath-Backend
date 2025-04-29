import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import patientRouter from "./routes/patientRouter.js"; 
import therapistRouter from "./routes/therapistRouter.js"; 
import router from './routes/basicInfoRouter.js';
import phqRouter from './routes/phqResultRouter.js';
import profileRouter from "./routes/profileRouter.js";
import sessionRouter from './routes/sessionRouter.js';

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

  
//middleware to check the token of the user
app.use((req, res, next)=>{

    let token = req.header("Authorization")

    if(token != null){
        token = token.replace("Bearer ","")
        jwt.verify(token, process.env.jwt_secret, (err, decoded)=>{
            if(!err){
                console.log(decoded)
                req.user = decoded
            }
        })
    }
    next()
    //console.log(token)
});



const mongoUrl = process.env.mongoUrl
mongoose.connect(mongoUrl)
const connection = mongoose.connection;

connection.once('open',()=>{
    console.log('MongoDB database connection established successfully!')
})

app.use("/uploads", express.static("uploads"));

app.use("/api/patient",patientRouter);
app.use("/api/therapist",therapistRouter);
app.use("/api/basic", router);
app.use("/api/phq", phqRouter);
app.use("/api/profile", profileRouter);
app.use('/api/session', sessionRouter);



app.listen(5000,()=>{
    console.log('Server is running on port 5000')
})
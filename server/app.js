'use strict';
const express = require('express');
const { connection } = require('mongoose');
const app = express();
const port = 5000;
const connectDB = require('./db/connect')
require('dotenv').config();
const router = require('./routes/crud')
const cor = require('cors')

// Middleware
// app.use((req, res, next) => {
//     res.header('Acceess-Control-Allow-Origin')
//     res.header('Acceess-Control-Allow-Origin', '*')
//     if (req.method === 'OPTIONS') {
//         res.header('Acceess-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
//         return res.status(200).json({})
//     }
//     next();
// })

app.use(express.json())
app.use(cor ({
    origin: 'http://localhost:3000'
}))

//Route
app.use('/api/v1/crud', router)

//Connectiom
const start = async() => {
    try {
        await connectDB(process.env.MONGO_CONNECT);
        app.listen(port, (req, res) => {
            console.log("listeining to port ", port)
        })
    } catch (error) {
        console.log(error);
    }
} 

start();
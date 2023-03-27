const express = require("express");
const mongoose =  require("mongoose")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const expressJwt = require("express-jwt")

mongoose.connect('mongodb+srv://kevinRondon:10r3n20R6.@clusterpruebaholamundo.t3bysb7.mongodb.net/auth?retryWrites=true&w=majority') // The database name is changed but the same cluster is used 

const app = express() //app init
app.use(express.json()) //Data reading
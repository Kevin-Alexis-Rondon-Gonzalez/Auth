const express = require("express");
const mongoose =  require("mongoose")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const expressJwt = require("express-jwt")
const User = require("./user")

mongoose.connect('mongodb+srv://kevinRondon:10r3n20R6.@clusterpruebaholamundo.t3bysb7.mongodb.net/auth?retryWrites=true&w=majority') // The database name is changed but the same cluster is used 

const app = express() //app init
app.use(express.json()) //Data reading

const signToken = _id => jwt.sign({_id},"mySecret") 

app.post('/register', async(req, res) => {
    const {body} = req
    console.log({body})
    try {
        const isUser = await User.findOne({email: body.email})
        if(isUser){
            return res.status(403).send('User already exists')
        }
        const salt = await bcrypt.genSalt()
        const hashed = await bcrypt.hash(body.password, salt)
        const user = await User.create({email:body.email, password: hashed, salt})
        const signed= signToken(user._id)//encrypting the id in jsonWebToken
        res.status(201).send(signed) 
    }catch(err){
        console.log(err)
        res.status(500).send(err.message) //send type error
    }
})

app.listen(3000, ()=>{
    console.log('Listening in port 3000')
})
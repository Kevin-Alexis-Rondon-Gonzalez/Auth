const express = require("express")
const mongoose =  require("mongoose")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const { expressjwt: expressjwt } = require("express-jwt") // new forms of request according to the documentation
const User = require("./user")

mongoose.connect('mongodb+srv://kevinRondon:10r3n20R6.@clusterpruebaholamundo.t3bysb7.mongodb.net/auth?retryWrites=true&w=majority') // The database name is changed but the same cluster is used 

const app = express() //app init
app.use(express.json()) //Data reading

const validationJwt = expressjwt({ secret:process.env.SECRET, algorithms: ["HS256"]}) //middleware for validation
const signToken = _id => jwt.sign({_id},process.env.SECRET) //Hiding the encryption signature with an environment variable this changes when committing to production 

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

app.post('/login', async(req, res) => {
    const {body} = req
    try{
        const user = await User.findOne({email: body.email})
            if(!user){
                res.send('Username and/or password invalid').status(403)
            }else{
                const isMatch = await bcrypt.compare(body.password, user.password)
                if(isMatch){
                    const signed = signToken(user._id) 
                    res.status(200).send(signed)
                }else{
                    res.send('Username and/or password invalid').status(403)
                }
            }
    }catch(err){
        console.log(err)
        res.status(500).send(err.message)
    }
})
//created middleware in express for validated
const findAssignUser = async(req, res, next) =>{
    try {
        const user = await User.findById(req.auth._id)//with auth why
        if(!user){
            return res.status(401)
        }
        req.user = user
        next()
    }catch(err){
        next(err)
    }
}
const isAuthenticated = express.Router().use(validationJwt, findAssignUser)//validate both middleware and call only one to encapsulate the best

app.get('/lele',isAuthenticated,(req,res)=>{
    throw new Error('new error')
    res.send(req.user)
})
app.use((err, req, res, next)=>{
    console.log('my new error', err.stack) //show in console
    next(err)
})
app.use((err, req, res, next)=>{ //show users
    res.send('Error') //here html with error
})


app.listen(3000, ()=>{
    console.log('Listening in port 3000')
})
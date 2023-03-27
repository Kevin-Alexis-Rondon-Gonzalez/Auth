const mongoose = require("mongoose")
//User Model
const User = mongoose.model('User', { //name and model the scheme
    email: {type: String, required:true},
    password: {type:String, requited:true},
    salt: {type:String, required:true},
})
module.express = User
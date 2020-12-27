const mongoose=require('mongoose')

var loginSchema =new mongoose.Schema({
    email:{type:String},
    password:{type:String}
});
const user=mongoose.model('users',loginSchema)

module.exports=user;
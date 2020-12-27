const mongoose=require("mongoose")

mongoose.connect("mongodb+srv://niteshsingh:nitesh5695@cluster0.annh3.mongodb.net/<reservation>?retryWrites=true&w=majority",{useNewUrlParser:true,useCreateIndex:true, useUnifiedTopology: true },(err)=>
{
    if(!err){
       console.log("connection established");
}
    else
    {
      console.log("something wrong with db connection");  
    } 
})
var customerSchema = new mongoose.Schema({
    name:{type:String},
    mobile:{type:Number,unique:true},
    gender:{type:String},
    items:{type:String},
    price:{type:String},
    tip:{type:String},
    pay_mode:{type:String},
    address:{type:String}
});
 var loginSchema =new mongoose.Schema({
     email:{type:String},
     password:{type:String}
 });

const customer=mongoose.model("customer",customerSchema)
module.exports=customer;
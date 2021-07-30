const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");

// Level 2 security npm package->
const encrypt=require("mongoose-encryption");
require('dotenv').config();

const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');

mongoose.connect("mongodb://localhost:27017/usersDB",{useNewUrlParser:true, useUnifiedTopology:true});
const userSchema=new mongoose.Schema({
  email:String,
  password:String
},{versionKey: false});


// Level-2 Authentication(Using mongoose-encryption npm package) ->

const secret=process.env.SECRET;
userSchema.plugin(encrypt,{secret:secret, encryptedFields:["password"]});


const User=new mongoose.model("User",userSchema);

app.get("/",function(req,res){
  res.render("home");
});
app.get("/login",function(req,res){
  res.render("login");
});
app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  const newUser=new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  });
});
app.post("/login",function(req,res){
  const userEmail= req.body.username;
  const password= req.body.password;
  User.findOne({email:userEmail},function(err,foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        if(foundUser.password===password){
          res.render("secrets");
        }else{
          res.send("<h1>Password is incorrect</h1>");
        }
      }else{
        res.send("<h1>User not found, register first</h1>");
      }
    }
  });
});

app.listen(3000,function(){
  console.log("Server started at 3000");
})

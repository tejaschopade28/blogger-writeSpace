
const path = require("path");
const express= require("express");

const mongoose= require('mongoose');

const userRoutes= require("./router/user");
const blogRoute = require("./router/blog");
const Blog = require('./models/blog');
const cookieParser=require("cookie-parser");

const { checkForAuthenticationCookies } = require("./middleware/authentication");
const app= express();
const PORT=8000;

mongoose.connect('mongodb://127.0.0.1:27017/blogify').
then((e)=>console.log('Mongodb connnected'));
 

app.use(express.urlencoded({extended:false}));
app.use(express.static(path.resolve("./public")))
app.use(express.static('public'));
app.use(cookieParser()); 
app.use(checkForAuthenticationCookies("token")); 

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.get('/',async(req,res)=>{
    const allBlog = await Blog.find({});
    // console.log('User:', res.locals.user);
    res.render("home", {
        user: req.user,
        blogs: allBlog,
    });
});

app.use('/user', userRoutes);
app.use('/blog', blogRoute);

app.listen( PORT,()=> console.log(`server started at ${PORT}`));
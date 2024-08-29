
const { Router }= require("express");
const { route } = require("./user");
const router = Router();
const Blog= require("../models/blog");
const path= require('path');
const User = require('../models/user'); 
const multer= require("multer");
const { count } = require("console");
const Comment=require("../models/comment");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads/`));
    },
    filename: function (req, file, cb) {
      const filename =  `${Date.now()}-${file.originalname}`;
      cb(null, filename);
    },
});

const upload = multer({ storage: storage });

router.get('/add-new', (req, res)=>{
    return res.render("addBlog", {
        user: req.user,
    })
});

router.get('/:id', async(req,res)=>{
  try {
    const blog = await Blog.findById(req.params.id).populate('createdBy');
    const comment= await Comment.find({blogId: req.params.id}).populate('createdBy');
    if (!blog) {
      return res.status(404).send("Blog post not found");
    }

    // Check if `blog.createdBy` is populated correctly
    console.log("Populated Blog:", blog);
    console.log("Comment",comment);

    return res.render("blog", {
      user: req.user,
      blog,
      createdBy: blog.createdBy,  // Passing the populated user object
      comment,
    });
  } catch (err) {
    console.error("Error fetching blog:", err);
    return res.status(500).send("Server Error");
  }
});

router.post("/comment/:blogId",async(req,res)=>{
    const comment=await Comment.create({
      content:req.body.content,
      blogId: req.params.blogId,
      createdBy:req.user._id,
    });
    return res.redirect(`/blog/${req.params.blogId}`);
})
router.post("/", upload.single("CoverImage"), async (req, res) => {
    console.log(req.body);
    // const { title, body } = req.body;
    const jsonString = JSON.stringify(req.body);
    const data = JSON.parse(jsonString);
    const body=data.Body;
    const title=data.title;
    const blog = await Blog.create({
      title,
      body,
      createdBy: req.user._id,
      coverImageURL: `/uploads/${req.file.filename}`,
    });
    return res.redirect(`/blog/${blog._id}`);
  });

module.exports=router;
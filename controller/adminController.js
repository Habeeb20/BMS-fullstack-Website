const BlogSetting = require("../models/blogSetingsModel");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const bcrypt = require("bcrypt");




const securePassword = async(password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);

        return passwordHash;
        
    } catch (error) {
        console.log(error)
        
    }
}


const login =(async(req, res)=>{
    res.send ('blog 1')

});



const blogSetUp =(async(req, res)=>{
    try {
        var blogSetting = await BlogSetting.find({})
        if(blogSetting.length > 0){
           
        }else {
            res.render('blogSetup')
        }
        
    } catch (error) {
        console.log(error)
        
    }
    

});


const blogSetupSave = async(req, res)=>{
    try {
        const blog_title= req.body.blog_title;
        const blog_file = req.file.filename;
        const description = req.body.description;
        const email = req.body.email;
        const name = req.body.name;
        const password = await securePassword(req.body.password)

        const blogSetting = new BlogSetting({
            blog_title:blog_title,
            blog_logo:blog_image,
            description:description
        });

        await blogSetting.save();

        const user = new User({
            name:name,
            email:email,
            password:password,
            is_admin:1
        });

        const userData = await user.save()
        if(userData){
            res.redirect('/login')
        } else {
            req.render('blogSetup', {message:"blog set up is not properly set"})
        }
        
    } catch (error) {
        console.log(error)
        
    }
}

const dashboard = (async( req, res) => {
    try {
        const allposts=await Post.find({})
        req.render('admin/dashboard', {posts:allposts})
        
    } catch (error) {
        console.log(error.message)
        
    }
});

const loadPostDashboard = (async(req, res) => {
    try {
        res.render('admin/postdashboard');
    } catch (error) {
        console.log(error)
    }
})

const AddPost = (async(req, res) => {
    try {


        var image = '';
        if(req.body.image !== undefined){
            image = req.body.image;
        }
        const post = new Post ({
            title: req.body.title,
            content: req.body.content,
            image : image
        });

        const postData = await post.save();

        res.send({ success: true, msg:"post added successfully",_id:postData._id})

        // res.render('admin/postDashBoard', {message:'post data successfully'})
        
    } catch (error) {
        res.send({success:false, message: error})
        
    }
});

const uploadPostImage = (async(req, res) => {
    try {
        var imagePath ='/images';
        imagePath = imagePath+ '/' + req.file.filename;

        res.send({success:true, msg:"Post Image upload successfully", path:imagePath})
    } catch (error) {
        console.log(error)
        
    }
});

const deletePost = (async(req, res) => {
    try {
        await Post.deleteOne({_id:req.params.id})
        res.status(200).json({success:true, msg:"successfully deleted"})
        
    } catch (error) {
        console.log(error)
        
    }
});

const loadeditPost = (async(req, res) => {
    try {
         var postData = await Post.findOne({_id: req.params.id});

         res.render('admin/editPost', {post:postData })
        
    } catch (error) {
        console.log(error)
        
    }
});

const updatePost = (async(req, res) => {
    try {
        var editData = await Post.findByIdAndUpdate({_id: req.params.id}, {
            $set:{
                title:req.body.title,
                content:req.body.content
            }
        });

        
        
    } catch (error) {
        console.log(error)
        
    }
})


module.exports = {
    login,
    blogSetUp,
    blogSetupSave,
    dashboard,
    loadPostDashboard,
    AddPost,
    securePassword,
    uploadPostImage,
    deletePost,
    loadeditPost,
    updatePost
}

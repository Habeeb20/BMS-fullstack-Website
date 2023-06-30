const Post = require('../models/postModel');
const { ObjectID } = require('mongodb');

const config = require('../config/config');
const nodemailer = require('nodemailer');
const sendCommentMail = (async(name, email, post_id)=>{
    try {

        const transporter = await nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.emailPassword
            }

        });
        const mailOptions= {
            from:'BMS',
            to:email,
            subject:'new Reply',
            html:'<p>'+name+', has replied on your comment <a href="http://127.0.0.1:3000/post/'+post_id+'">Read your replies here '
        }

        transporter.sendMail(mailOptions,function(info, error){
            if(info){
                console.log("email has been sent:- ", info.response);
            }else {
                console.log(error)
            }
        });
        
    } catch (error) {
        console.log(error)
        
    }
})

const loadBlog = (async (req, res) => {
    try {
        const posts = await Post.find({});
        res.render('blog', { posts: posts });

    } catch (error) {
        console.log(error)
    }
});

const loadPost = (async (req, res) => {
    try {
        const post = await Post.findOne({ "_id": req.params.id });
        res.render('post', { post: post })
    } catch (error) {
        console.log(error);

    }
});

const addComment = (async( req, res) => {
    try {

        var post_id = req.body.post_id;
        var username = req.body.username;
        var comment = req.body.comment;
        var email = req.body.email;

        var comment_id = new ObjectID();

        await Post.findByIdAndUpdate({_id:post_id}, {
            $push:{
                "comments": {_id:comment_id, username: username, email:email, comment:comment }
            }
        });
        res.status(200).send({success: true, msg:"comment is successfully added", _id:comment_id })
        
    } catch (error) {
        console.log(error)
        res.status(200).send({ success: false, msg:error});
    }

});

const doReply = (async(req, res) => {
    try {
        var reply_id = new ObjectID();
        await Post.updateOne({
            '_id':ObjectID(req.body.post_id),
            "comments._id":ObjectID(req.body.comment_id),
        },{
            $push:{
                "comments:$.replies":{ _id:reply_id, name:req.body.name, reply:req.body.reply}
            }
        });

        sendCommentMail(req.body.name, req.body.comment_email, req.body.post_id);

        res.status(200).send({ success:true, msg:'Reply added'})

        
    } catch (error) {
        res.status(200).send({success:false,msg: error})
        
    }
})


    module.exports = {
        loadBlog,
        loadPost,
        addComment,
        doReply
    }
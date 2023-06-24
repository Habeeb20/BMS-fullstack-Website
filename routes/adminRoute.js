const express = require ('express');
const admin_route = express();
const adminController = require('../controller/adminControlleer')
const bodyParser= require("body-parser");
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}));

const session = require('express-session');


const adminLoginAuth= require('../middleware/adminLoginAuth')

const config = require('../config/config')
admin_route.use(session({secret:config.sessionSecret,
                        resave:true,
                        saveUninitialized:true
                        }));



admin_route.set('view engine', 'ejs');
admin_route.set('views', './views')

const multer = require("multer");
const path =require("path");

admin_route.use(express.static('public'));

const storage= multer.diskStorage({
    destination:function(req, file, cb){
        cb(null,path.join(_dirname, '../public/images'))
    },

    filename:function(req, file, cb){
       const name= Date.now()+ '_' +file.originalname;
       cb(null,name);

    
    }
});

const upload = multer({storage:storage});


admin_route.get('/login',adminController.login);

admin_route.get('/blog-setup', adminController.blogSetUp);
admin_route.post('/blog-setup',upload.single('blog_image'),adminController.blogSetUp);
admin_route.get('/dashboard', adminLoginAuth.isLogin, adminController.dashboard);
admin_route.get('/create-post', adminLoginAuth.isLogin, adminController.loadPostDashboard);
admin_route.post('/create-post', adminLoginAuth.isLogin, adminController.AddPost);

 


module.exports = admin_route
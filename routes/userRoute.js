const express = require ('express');
const user_route = express();
const adminController = require('../controller/adminControlleer')
const bodyParser= require("body-parser");
user_route.use(bodyParser.json());
const userController = require('../controller/userController')
user_route.use(bodyParser.urlencoded({extended:true}));


const session = require('express-session');


const config = require('../config/config')
user_route.use(session({secret:config.sessionSecret,
                        resave:true,
                        saveUninitialized:true
                        }));

const adminLoginAuth= require('../middleware/adminLoginAuth')

user_route.set('view engine', 'ejs');
user_route.set('views', './views');

const multer = require("multer");
const path =require("path");

user_route.use(express.static('public'));

user_route.get('/login', adminLoginAuth.isLogout, userController.loadLogin);
user_route.post('/login', userController.verifyLogin);
user_route.get('/profile', userController.profile);

user_route.get('/logout', adminLoginAuth.isLogin, userController.logout);
user_route.get('/forget-pasword', adminLoginAuth.isLogout, userController.forgetLoad)
user_route.post('/forget-password', userController.forgetPasswordVerify);



module.exports = user_route;

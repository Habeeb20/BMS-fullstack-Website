const connectdb = require('./dbconnection/dbconnect');
connectdb();
const express = require('express')
const app = express();


// app.listen(22000);



var http=require('http').createServer(app);
var {Server} = require('socket.io');
var io = new Server (http,{});


io.on("connection", function(socket){
    console.log('User Connected');

    socket.on('new_post', function(formData){
        console.log(formData);
        socket.broadcast.emit("new_post", formData);


    });
    socket.on("new_comment", function(comment){
        io.emit("new_comment", comment);
    });

    socket.on("new_reply", function(reply){
        io.emit("new_reply", reply);
    });
});

http.listen(3000, function(){
    console.log("User connected")
});



const bodyParser = require('body-parser');

const port = process.env.PORT || 22000
app.set('view engine', 'ejs');
const adminController = require('./controller/adminController');



const isBlog = require("./middleware/isBlog");

app.use(isBlog.isBlog)

//for admin routes
const adminRoutes= require("./routes/adminRoute");
app.use('/', adminRoutes);



//for user routes
const userRoutes= require("./routes/userRoute");
app.use('/', userRoutes);



//for blog routes
const blogRoutes= require("./routes/blogRoute");
app.use('/', blogRoutes);




console.log("Hello!!!, your server is running on the port " + port)

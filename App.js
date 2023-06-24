const connectdb = require('./dbconnection/dbconnect');
connectdb();
const express = require('express')
const app = express();
app.listen(22000);

const bodyParser = require('body-parser');

const port = process.env.PORT || 22000
app.set('view engine', 'ejs');
const adminController = require('./controller/adminControlleer');



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

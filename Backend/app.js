const express = require("express");
const mongoose=require('mongoose')
const morgan = require("morgan");
const Productrouter=require('./routers/Product')
const categoriesrouter=require('./routers/categories')
const ordersrouter=require('./routers/orders')
const usersrouter=require('./routers/users')
const cors=require("cors");
const Auth = require("./helper/aurth");
const errorhandler = require("./helper/errorhandler");
require("dotenv/config");

const app = express();
app.use(cors())
app.options('*',cors())

// Middleware

app.use(express.json())
app.use(morgan('tiny'))
app.use('/public/upload',express.static(__dirname + '/public/upload'))
app.use(Auth())
app.use(errorhandler())

mongoose.connect(process.env.CONNECTION_STRING,{
dbName:'eshop-database'
}).then(()=>console.log("Database is added successfully")).catch((err)=>console.log(err))

const api = process.env.API_URL;

app.use(`/${api}/product`,Productrouter)
app.use(`/${api}/category`,categoriesrouter)
app.use(`/${api}/order`,ordersrouter)
app.use(`/${api}/user`,usersrouter)






app.listen(3000, () => {
  console.log(`${api}/product`)
  console.log(`server is running on http://localhost:3000`);
});

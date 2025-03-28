const express = require('express');
const cors = require('cors');
const connection = require('./connection');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const itemRoutes= require('./routes/item');
const billRoute = require('./routes/bill');
const dashboardRoute =require('./routes/dashboard');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use('/user',userRoutes);

app.use('/product',productRoutes); 

app.use('/item',itemRoutes); 

app.use('/bill',billRoute);

app.use('/dashboard',dashboardRoute);  

module.exports = app;
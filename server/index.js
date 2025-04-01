const express = require('express');
const cors = require('cors');
const connection = require('./connection');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes= require('./routes/product');
const billRoute = require('./routes/bill');
const dashboardRoute =require('./routes/dashboard');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use('/user',userRoutes);

app.use('/category',categoryRoutes); 

app.use('/product',productRoutes); 

app.use('/bill',billRoute);

app.use('/dashboard',dashboardRoute);  

module.exports = app;
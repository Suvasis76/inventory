const express = require('express');
const connection = require('../connection');
const router =express.Router();
var auth= require('../services/authentication');
var checkRole = require('../services/checkRole');


router.post('/add',auth.authenticateToken,(req,res)=>{
    let product = req.body;
    query='INSERT INTO product (name) values(?)';
    connection.query(query,[product.name],(err, result) => {
        if(err) throw err;
        res.send('Product added successfully');
    })
});

router.get('/get',auth.authenticateToken,(req,res)=>{
    var query = "select * from product order by name";
    connection.query(query,(err, result) => {
        if (!err){
            res.json(result)
        } else{
            res.status(500).json({ message: 'Database error', error: err });
        }
    });
});

router.patch('/update',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    let product = req.body;
    var query = 'UPDATE product SET name =? WHERE id =?';
    connection.query(query,[product.name, product.id],(err, result) => {
        if (!err){
            if(result.affectedRows==0){
                return res.status(404).json({ message: 'Product not found' });
            }
            res.send('Product updated successfully');
        } else{
            res.status(500).json({ message: 'Database error', error: err });
        }
    });
});

module.exports=router;
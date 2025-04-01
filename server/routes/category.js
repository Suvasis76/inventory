const express = require('express');
const connection = require('../connection');
const router =express.Router();
var auth= require('../services/authentication');
var checkRole = require('../services/checkRole');


router.post('/add',auth.authenticateToken,(req,res)=>{
    console.log("Received data:", req.body);
    let category = req.body;
    query='INSERT INTO category (name) values(?)';
    connection.query(query,[category.name],(err, result) => {
        if(err) throw err;
        res.json({ message: 'Category added successfully' });

    })
});

router.get('/get',auth.authenticateToken,(req,res)=>{
    var query = "select * from category order by name";
    connection.query(query,(err, result) => {
        if (!err){
            res.json(result)
        } else{
            res.status(500).json({ message: 'Database error', error: err });
        }
    });
});

router.patch('/update',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    let category = req.body;
    var query = 'UPDATE category SET name =? WHERE id =?';
    connection.query(query,[category.name, category.id],(err, result) => {
        if (!err){
            if(result.affectedRows==0){
                return res.status(404).json({ message: 'Category not found' });
            }
            res.json({message:'Category updated successfully'});
        } else{
            res.status(500).json({ message: 'Database error', error: err });
        }
    });
});


module.exports=router;
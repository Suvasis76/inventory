const express =require('express');
const connection = require('../connection');
const router = express.Router();
const auth =  require('../services/authentication');
const checkRole =require('../services/checkRole');

router.post('/add',auth.authenticateToken,checkRole.checkRole,(req, res) => {
    let product=req.body;
    query = 'INSERT INTO product (name,categoryId,description, price,status) VALUES(?,?,?,?,"1")';
    connection.query(query,[product.name, product.categoryId, product.description, product.price],(err, result) => {
        if(err) throw err;
        res.json({message:'Product added successfully'});
    });
});

router.get('/get',auth.authenticateToken,checkRole.checkRole,(req, res) => {
    query = "select p.id, p.name, p.description, p.price,p.status,c.id as categoryId ,c.name as categoryName from product as p  INNER JOIN category as c on p.categoryId = c.id";
    connection.query(query,(err, result) => {
        if (!err){
            res.json(result);
        } else{
            res.status(500).json({ message: 'Database error', error: err });
        }
    });
});

router.get('/getByCategory/:id',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    const id=req.params.id;
    query ="select id,name from product where categoryId =? and status = '1'";
    connection.query(query,[id],(err, result) => {
        if (!err){
            res.json(result);
        } else{
            res.status(500).json({ message: 'Database error', error: err });
        }
    });
});

router.get('/getById/:id',auth.authenticateToken,(req,res,next)=>{
    const id=req.params.id;
    query ="select id,name,description,price from product where id =?";
    connection.query(query,[id],(err, result) => {
        if (!err){
            res.json(result[0])
        } else{
            res.status(500).json({ message: 'Database error', error: category})
        }
    });
});

router.patch('/update',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    let product=req.body;
    var query="UPDATE product SET name=?, categoryId=?, description=?, price=? WHERE id=?";
    connection.query(query,[product.name, product.categoryId, product.description, product.price, product.id],(err,result) => {
        if (!err){
            if(result.affectedRows==0){
                return res.status(404).json({ message: 'Product not found' });
            }
            return res.json({message:'Product updated successfully'});
        } else{
            res.status(500).json({ message: 'Database error', error: err });
        }
    });
});

router.delete('/delete/:id',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    const id=req.params.id;
    var query= "delete from product where id=?";
    connection.query(query,[id],(err, result) => {
        if (!err){
            if(result.affectedRows==0){
                return res.status(404).json({ message: 'Product not found' });
            }
            return res.json({message:'Product deleted successfully'});
        } else{
            res.status(500).json({ message: 'Database error', error: err });
        }
    }); 
});

router.patch('/updateStatus',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    let user =req.body;
    var query = 'UPDATE product SET status=? WHERE id=?';
    connection.query(query,[user.status, user.id],(err, result) => {
        if (!err){
            if(result.affectedRows==0){
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json({message:'Product status updated successfully'});
        } else{
            res.status(500).json({ message: 'Database error', error: err });
        }
    });
});

module.exports = router;
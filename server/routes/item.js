const express =require('express');
const connection = require('../connection');
const router = express.Router();
const auth =  require('../services/authentication');
const checkRole =require('../services/checkRole');

router.post('/add',auth.authenticateToken,checkRole.checkRole,(req, res) => {
    let item=req.body;
    query = 'INSERT INTO item (name,itemId,description, price,status) VALUES(?,?,?,?,"1")';
    connection.query(query,[item.name, item.itemId, item.description, item.price],(err, result) => {
        if(err) throw err;
        res.send('Item added successfully');
    });
});

router.get('/get',auth.authenticateToken,checkRole.checkRole,(req, res) => {
    query = "select i.id, i.name, i.description, i.price,i.status,p.id as productId ,  p.name as productName from item as i  INNER JOIN product as p where i.itemId = p.id";
    connection.query(query,(err, result) => {
        if (!err){
            res.json(result);
        } else{
            res.status(500).json({ message: 'Database error', error: err });
        }
    });
});

router.get('/getByProduct/:id',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    const id=req.params.id;
    query ="select id,name from item where itemId =? and status = '1'";
    connection.query(query,[id],(err, result) => {
        if (!err){
            res.json(result)
        } else{
            res.status(500).json({ message: 'Database error', error: err });
        }
    });
});

router.get('/getById/:id',auth.authenticateToken,(req,res,next)=>{
    const id=req.params.id;
    query ="select id,name,description,price from item where id =?";
    connection.query(query,[id],(err, result) => {
        if (!err){
            res.json(result[0])
        } else{
            res.status(500).json({ message: 'Database error', error: err });
        }
    });
});

router.patch('/update',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    let item=req.body;
    var query="UPDATE item SET name=?, itemId=?, description=?, price=? WHERE id=?";
    connection.query(query,[item.name, item.itemId, item.description, item.price, item.id],(err,result) => {
        if (!err){
            if(result.affectedRows==0){
                return res.status(404).json({ message: 'Item not found' });
            }
            return res.send('Item updated successfully');
        } else{
            res.status(500).json({ message: 'Database error', error: err });
        }
    });
});

router.delete('/delete/:id',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    const id=req.params.id;
    var query= "delete from item where id=?";
    connection.query(query,[id],(err, result) => {
        if (!err){
            if(result.affectedRows==0){
                return res.status(404).json({ message: 'Item not found' });
            }
            return res.send('Item deleted successfully');
        } else{
            res.status(500).json({ message: 'Database error', error: err });
        }
    }); 
});

router.patch('/updateStatus',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    let user =req.body;
    var query = 'UPDATE item SET status=? WHERE id=?';
    connection.query(query,[user.status, user.id],(err, result) => {
        if (!err){
            if(result.affectedRows==0){
                return res.status(404).json({ message: 'Item not found' });
            }
            res.send('Item status updated successfully');
        } else{
            res.status(500).json({ message: 'Database error', error: err });
        }
    });
});

module.exports = router;
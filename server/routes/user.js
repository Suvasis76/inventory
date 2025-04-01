const express = require('express');
const connection = require('../connection');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config;
var auth=require('../services/authentication');
var checkRole = require('../services/checkRole');

router.post('/signup',(req, res) => {
    let user = req.body;
    query='select email,password,role,status from user where email=?'
    connection.query(query,[user.email],(err, result) => {
        if(err) {
            
            return res.status(500).json({ message: 'Database error', error: err });
        };
        if(result.length <= 0){
            const query = 'INSERT INTO user (name, contactNumber, email, password, status, role) VALUES (?, ?, ?, ?, false, "user")';
            connection.query(query,[user.name,user.contactNumber,user.email,user.password],(err, result) => {
                if(err) {
                    
                    return res.status(500).json({ message: 'Database error', error: err });
                };
                res.json({message: 'User registered successfully'});
            })
        }else{
            res.status(409).json({message: 'Email already exists'});
            
        }
    })

})

router.post('/login',(req, res) => {
    let user=req.body;
    query='select email,password,role,status from user where email=?'
    connection.query(query,[user.email],(err, result) => {
        if(err) {

            return res.status(500).json({ message: 'Database error', error: err });

        }else{
            if  (result.length <= 0 || result[0].password != user.password){
                return res.status(500).json({ message: 'Invalid credentials' });
            }
            else if (result[0].status ==0){
                return res.status(200).json({message: 'Wait for admin approval'})
            }
            else if (result[0].password ==user.password){
                const response ={email:result[0].email, role:result[0].role}
                const accessToken=jwt.sign(response,process.env.ACCESS_TOKEN,{expiresIn:'8h'})
                res.status(200).json({token:accessToken});
            }
            else{
                return res.status(400).json({ message: 'Something went wrong please try again' });
            }
        }
        
    });
})

router.get('/get',auth.authenticateToken,checkRole.checkRole,(req,res)=>{
    var query="select id,name,email,contactNumber,status from user where role ='user' ";
    connection.query(query,(err,result) => {
        if (!err){
            return res.status(200).json(result)
        }else{
            return res.status(500).json({ message: 'Database error', error: err });
        }
    })
})

router.patch('/update',auth.authenticateToken,checkRole.checkRole,(req,res)=>{
    let user=req.body;
    var query="UPDATE user SET status=? WHERE id=?";
    connection.query(query,[user.status,user.id],(err,result) => {
        if (!err){
            if(result.affectedRows==0){
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json({ message: 'User updated successfully' });
        }else{
            return res.status(500).json({ message: 'Database error', error: err });
        }
    })
})

router.get('/checkToken',auth.authenticateToken,(req,res)=>{
    return  res.status(200).json({message:"true"});
})

router.post('/changePassword',auth.authenticateToken,(req,res)=>{
    const user=req.body;
    const email=res.locals.email;
    var query="select *from user where email=?";
    connection.query(query,[email,user.oldPassword],(err, result) => {
        if (!err){
            if(result.length <= 0){
                return res.status(500).json({ message: 'Invalid credentials' });
            }
            else if(result[0].password==user.oldPassword){
                query="update user set password=? where email=?";
                connection.query(query,[user.newPassword,email],(err, result) => {
                    if (!err){
                        return res.status(200).json({ message: 'Password updated successfully' });
                    }else{
                        return res.status(500).json({ message: 'Database error', error: err });
                    }
                });
            }else{
                return res.status(400).json({ message: 'Something  went wrong. Try again' });
            }
        }else{
            return res.status(500).json({ message: 'Database error', error: err });
        }
    });
});

module.exports = router;
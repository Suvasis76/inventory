const express = require('express');
const connection = require('../connection');
const router =express.Router();
let ejs = require('ejs');
let pdf = require('html-pdf');
let path = require('path');
var fs=require('fs');
var uuid = require('uuid');
var auth = require('../services/authentication');

router.post('/generateReport',auth.authenticateToken,(req,res)=>{
    const generateUuid = uuid.v1();
    const orderDetails =req.body;
    var productDetailsReport = JSON.parse(orderDetails.productDetails);

    query="insert into bill (name,uuid,email,contactNumber,paymentMethod,total,productDetails,createBy) values(?,?,?,?,?,?,?,?)";
    connection.query(query,[orderDetails.name,generateUuid,orderDetails.email,orderDetails.contactNumber,orderDetails.paymentMethod,orderDetails.total,orderDetails.productDetailsReport,res.locals.email],(err, result) => {
        if(!err){
            ejs.renderFile(path.join(__dirname,'',"report.ejs"),{productDetails:productDetailsReport,name:orderDetails.name,email:orderDetails.email,contactNumber:orderDetails.contactNumber,paymentMethod:orderDetails.paymentMethod,total:orderDetails.total},(err,result)=>{
                if(!err){
                    pdf.create(result).toFile('./generated_pdf/'+generateUuid+".pdf",function(err,result){
                        if(!err){
                            return res.status(200).json({uuid:generateUuid});
                        }
                        else{
                            return res.status(500).json({ message: 'Error creating pdf file', error: err });
                        }
                    })
                }
                else{
                    return res.status(500).json({ message: 'Error rendering report', error: err });
                }
            });
        }
        else{
            return res.status(500).json({ message: 'Database error', error: err });
        }
    });
});

router.post('/getPdf',auth.authenticateToken,function(req,res){
    const orderDetails = req.body;
    const pdfPath = './generated_pdf/'+orderDetails.uuid+".pdf";
    if (fs.existsSync(pdfPath)){
        res.contentType("application/pdf");
        fs.createReadStream(pdfPath).pipe(res);
    }else{
        var productDetailsReport = JSON.parse(orderDetails.productDetails);
        ejs.renderFile(path.join(__dirname,'',"report.ejs"),{productDetails:productDetailsReport,name:orderDetails.name,email:orderDetails.email,contactNumber:orderDetails.contactNumber,paymentMethod:orderDetails.paymentMethod,total:orderDetails.total},(err,result)=>{
            if(!err){
                pdf.create(result).toFile('./generated_pdf/'+orderDetails.uuid+".pdf",function(err,result){
                    if(!err){
                        res.contentType("application/pdf");
                        fs.createReadStream(pdfPath).pipe(res);
                    }
                    else{
                        return res.status(500).json({ message: 'Error creating pdf file', error: err });
                    }
                })
            }
            else{
                return res.status(500).json({ message: 'Error rendering report', error: err });
            }
        });
    }
});

router.get('/getBills',auth.authenticateToken,function(req,res){
    query="select * from bill order by id DESC";
    connection.query(query,(err, result) => {
        if (!err){
            return res.status(200).json(result);
        } else{
            return res.status(500).json({ message: 'Database error', error: err });
        }
    });
});

router.delete('/delete/:id',auth.authenticateToken,(req,res)=>{
    const id=req.params.id;
    query="delete from bill where id=?";
    connection.query(query,[id],(err, result) => {
        if (!err){
            if(result.affectedRows==0){
                return res.status(404).json({ message: 'Bill not found' });
            }
            return res.send('Bill deleted successfully');
        } else{
            return res.status(500).json({ message: 'Database error', error: err });
        }
    });
});

module.exports = router;
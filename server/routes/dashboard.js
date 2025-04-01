const  express= require('express');
const connection =require ('../connection');
const router = express.Router();
const auth = require('../services/authentication');

router.get('/details',auth.authenticateToken,(req,res)=>{
    var categoryCount;
    var productCount;
    var billCount;
    var query = "SELECT COUNT(id) as categoryCount FROM category";
    connection.query(query,(err, result) => {
        if (!err){
            categoryCount = result[0].categoryCount;
        } else{
            return res.status(500).json({ message: 'Database error', error: err });
        }
    });
    var query = "SELECT COUNT(id) as productCount FROM product";
    connection.query(query,(err, result) => {
        if (!err){
            productCount = result[0].productCount;
        } else{
            return res.status(500).json({ message: 'Database error', error: err });
        }
    });
    var query = "SELECT COUNT(id) as billCount FROM bill";
    connection.query(query,(err, result) => {
        if (!err){
            billCount = result[0].billCount;
            var data={
                category: categoryCount,
                product: productCount,
                bill: billCount
            };
            return res.status(200).json(data);
        } else{
            return res.status(500).json({ message: 'Database error', error: err });
        }
        
    });
});

module.exports = router;
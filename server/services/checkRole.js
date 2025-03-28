require('dotenv').config;

function checkRole(req, res, next) {
    if(res.locals.role==process.env.USER){
        res.send(401);
    }else{
        next();
    }
}

module.exports = {checkRole: checkRole};
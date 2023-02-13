const { decode } = require('jsonwebtoken');
const jwt = require('jsonwebtoken');

function decodeToken(token) {
    return new Promise(
        (resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
                if(error) reject(error);
                resolve(decoded);
            });
        }
    );
}

const authMiddleware = async(req, res, next) => {
    const {token} = req.cookies;
    if(!token){
        return next();
    }
    try{
        const user = await decodeToken(token);
        console.log(user);
        res.cookie('email',user.uid,{ expires: new Date(Date.now() + 5000), path: '/'});
        next();
    }catch(err){
        console.log(err);
    }
    
}

module.exports = authMiddleware;
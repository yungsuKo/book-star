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
        res.locals.isLogin = false;
        return next();
    }
    try{
        const user = await decodeToken(token);
        res.locals.isLogin = true;

        res.cookie('email',user.email,{ expires: new Date(Date.now() + 5000), path: '/'});
        res.cookie('token',token,{ expires: new Date(Date.now() + 5000), path: '/'});
        next();
    }catch(err){
        console.log(err);
    }
    
}

module.exports = authMiddleware;
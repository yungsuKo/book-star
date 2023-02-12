const User = require('../../../models/User');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    const createUser = async () => {    
        try{
            const {email, password, nickname} = req.body;
            const exist = await User.exists({email: email});
            console.log(exist);
            if(!exist){
                const user = await User.create({
                    email, password, nickname
                })
                console.log(user)
                return res.json({
                    status : {
                        code : 200,
                        message: 'success'
                    },
                    data: user
                });
            }
            return res.json({
                status : {
                    code : 401,
                    message: '중복된 회원가입'
                },
            });
        }catch(err){
            console.log(err);
        }
    }
    await createUser();
}

exports.login = async (req, res) => {
    const loginUser = async () => {    
        try{
            const { email } = req.body;
            const user = await User.find({
                email
            })
            const loginUserToken = jwt.sign({email}, process.env.JWT_SECRET,{
                expiresIn : 10,
            })
            res.json({
                status : {
                    code : 200,
                    message: 'success'
                },
                data: user[0],
                token: loginUserToken,
            });
        }catch(err){
            console.log(err);
        }
    }
    await loginUser();
}
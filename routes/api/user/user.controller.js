const User = require('../../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
    const createUser = async () => {    
        try{
            const {email, password, nickname} = req.body;
            console.log(email)
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
                    message: '이미 존재하는 아이디 입니다.'
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
            const { email, password } = req.body;
            const user = await User.find({
                email
            })
            // 유저가 존재하는지 
            // 존재한다면 비밀번호 compare
            console.log(user);
            if(user.length===0) {
                return res.json({
                    status : {
                        code : 401,
                        message: '존재하지 않는 계정입니다.'
                    }
                })
            }else{
                const match = bcrypt.compare(password, user[0].password);
                if(match){
                    const loginUserToken = jwt.sign({email}, process.env.JWT_SECRET,{
                        expiresIn : 1000*60*60,
                    })
                    res.json({
                        status : {
                            code : 200,
                            message: 'success'
                        },
                        data: user[0],
                        token: loginUserToken,
                    });
                }else{
                    // 실제 로그인에서는 해킹의 우려가 있어 이런식으로 로그인 실패를 알려주지는 않는다.
                    return res.json({
                        status : {
                            code : 401,
                            message: '비밀번호가 일치하지 않습니다.'
                        }
                    })
                }
                
            }
        }catch(err){
            console.log(err);
        }
    }
    await loginUser();
}

exports.logout = async (req, res) => {
    const logoutUser = async () => {    
        try{
            res.clearCookie('token').redirect("/");
        }catch(err){
            console.log(err);
        }
    }
    await logoutUser();
}
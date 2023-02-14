const User = require('../../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
                    message: '�̹� �����ϴ� ȸ���Դϴ�.'
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
            // ȸ���� ���� ���θ� Ȯ���ϴ� ���� �ʿ�
            // ȸ���� ��ȣȭ�� ��й�ȣ�� �����ϴ� ���� �ʿ�
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
        }catch(err){
            console.log(err);
        }
    }
    await loginUser();
}
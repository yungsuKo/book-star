const User = require('../../../models/User');
const SavedBook = require('../../../models/SavedBook');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const AWS = require('aws-sdk');

exports.signup = async (req, res) => {
    const createUser = async () => {    
        try{
            const {email, password, nickname} = req.body;
            console.log(email)
            const exist = await User.exists({email: email});
            console.log(exist);
            // 이미지를 전달 받아서 aws s3에 올리고, url을 저장하는 작업이 필요함
            if(!exist){
                const user = await User.create({
                    email, password, nickname
                })
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
            res.json({
                status : {
                    code: 200,
                    message : "로그아웃이 처리 시작!."
                }
            });
            
        }catch(err){
            console.log(err);
        }
    }
    await logoutUser();
}

exports.mybooks = async (req, res, next) => {
    const {email} = req.body;
    const user = await User.find({email})
    const getBooks = async (user) => {
        const books = await SavedBook.find({uid: user[0]._id, use_yn:'y'});
        return res.json(books)
    }
    await getBooks(user);
}

exports.mybooksDetail = async (req, res, next) => {
    const {email} = req.body;
    const user = await User.find({email})
    const {id} = req.params;
    const getBook = async (user, id) => {
        const mybook = await SavedBook.findOne({uid: user[0]._id, use_yn:'y', isbn: id});
        return res.json(mybook);
    }
    await getBook(user, id);
}

exports.mybooksUpdate = async(req, res, next) => {
    const {email, comment} = req.body;
    const user = await User.find({email})
    const {id} = req.params;
    const getBook = async (user, id) => {
        const mybook = await SavedBook.findOneAndUpdate(
            {uid: user[0]._id, isbn: id},
            {$set:{comment}},
            {new: true}
            );
        return res.json(mybook);
    }
    await getBook(user, id);

}
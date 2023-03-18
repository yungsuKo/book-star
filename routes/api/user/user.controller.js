const User = require('../../../models/User');
const SavedBook = require('../../../models/SavedBook');
const jwt = require('jsonwebtoken');
const request = require('requestretry');
const axios = require('axios');
const bcrypt = require('bcrypt');
const qs = require('qs');
const { query } = require('express');

exports.signup = async (req, res) => {
    const createUser = async () => {    
        try{
            const {email, password, nickname, profile_img} = req.body;
            const exist = await User.exists({email: email});
            // 이미지를 전달 받아서 aws s3에 올리고, url을 저장하는 작업이 필요함
            let result

            if(!exist){
                const user = await User.create({
                    email, password, nickname, profile_img
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

exports.signInKakao = async (req, res) => {
    const headers = req.headers["authorization"];
    const kakaoToken = req.query.code;
    console.log('hi')
    let sendData = {
        grant_type: 'authorization_code',
        client_id: process.env.KAKAO_REST_API_KEY, 
        code: kakaoToken,
        redirect_uri: process.env.KAKAO_REDIRECT_URI,
        client_secret: process.env.KAKAO_REST_API_SECRET
    };
    
    sendData = qs.stringify(sendData);
    // 여기서의 카카오 토큰은 클라이언트단에서 넘어와야함
    const result = await axios.post(
        "https://kauth.kakao.com/oauth/token", 
        sendData,
        'Content-Type=application/x-www-form-urlencoded'
    ); 
    const {data: {access_token, refresh_token}} = result;
    console.log(access_token)
    
    const userData = await axios.get("https://kapi.kakao.com/v2/user/me",{
        headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json;charset=utf-8',
        }
    })
    const {data : {kakao_account}}= userData;
    console.log(kakao_account);
    const nickname = kakao_account.profile.nickname;
    let email = kakao_account.email;
    const kakaoId = userData.data.id;
    const profile_img = kakao_account.profile.thumbnail_image_url;

    if (!nickname || !email || !kakaoId) throw new error("KEY_ERROR", 400);

    let user = await User.findOne({email});
    let signupResult
    if (!user) {
        // 회원가입을 실행시킴
        // 카카오에서 전달 받은 인자를 전달 받음
        const options = {
            url: process.env.BASE_URL + '/api/user/signup',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            json: true,
            maxAttempts: 2,
            retryDelay: 500,
            retryStrategy: request.RetryStrategies.HTTPOrNetworkError,
            body: {
                profile_img,
                email,
                nickname, 
                kakaoId,
                password: ''
            }
        };
        
        signupResult = await request(options);
        console.log(signupResult.body)
        user =signupResult.body.data;
    }
    email = user.email;
    
    const loginUserToken = jwt.sign({email}, process.env.JWT_SECRET,{
        expiresIn : 1000*60*60,
    })

    res.cookie("token", loginUserToken,
        {
            httpOnly: true, expires: new Date(Date.now() + 5000)
        }
    );
    res.redirect("/");
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
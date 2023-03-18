const express = require('express');
const request = require('requestretry');
const router = express();
const User= require('../../models/User');

const aws = require('aws-sdk');
const fs = require('fs')
const multerS3 = require('multer-s3');
const multer = require('multer');
const s3 = new aws.S3({
    accessKeyId : process.env.AWS_ACCESS_KEY,
    secretAccessKey : process.env.AWS_ACCESS_SECRET,
    region: 'ap-northeast-2',
});

const base_url = process.env.BASE_URL || 'http://localhost:3000';

const storage = multerS3({
    s3: s3,
    acl: 'public-read-write',
    bucket: "elasticbeanstalk-ap-northeast-2-053255126826/profileImage",   // s3 버킷명+경로
    key: (req, file, callback) => {
        let dir = 'profileimage';
        let datetime = new Date();
        callback(null, dir + "/"+datetime + "_" + file.originalname);  // 저장되는 파일명
    }
});
const upload = multer({ storage: storage });

router.get('/signup', (req, res)=>{
    res.render('signup2');
})
router.post('/signup', upload.single('profile_img'), async (req, res, next)=>{
    console.log("Sign up post is in here")
    console.log(req.body);
    req.body.profile_img = req?.file?.location;
    let result
    try{
        let options = {
            url: base_url+"/api/user/signup",
            method: "post",
            json: true,
            maxAttempts: 2,
            form: req.body,
            retryDelay: 500,
            retryStrategy: request.RetryStrategies.HTTPOrNetworkError
        }
        result = await request(options);
        if(result.body.status.message === "success"){
            res.redirect("/");
        }else{
            res.redirect("/user/signup");
        }
        
    }catch(err){
        console.log(err);
    }
})

router.get('/login', (req, res)=>{
    res.render('login2',{
        errorMsg: "",
        base_url
    });
})

router.post('/login', async (req, res, next)=>{
    let result;
    let user;
    try{
        let options = {
            url: base_url+"/api/user/login",
            method: "post",
            json: true,
            maxAttempts: 2,
            form: req.body,
            retryDelay: 500,
            retryStrategy: request.RetryStrategies.HTTPOrNetworkError
        }
        result = await request(options);
        const {code, message} = result.body.status;
        console.log(code)
        if(code === 200){
            user = result.body.data;
            res.cookie("token", result.body.token,
                {
                    httpOnly: true, expires: new Date(Date.now() + 5000)
                }
            );
            res.redirect("/");
        }
        else if(code === 401){
            res.render("login2", {
                errorMsg : message,
                base_url
            });
        }
        
    }catch(err){
        console.log(err);
    }
})

router.get("/logout", async (req, res)=>{
    let result;
    try{
        let options = {
            url: `${base_url}/api/user/logout`,
            method: "post",
            json: true,
            maxAttempts: 2,
            form: req.body,
            retryDelay: 500,
            retryStrategy: request.RetryStrategies.HTTPOrNetworkError
        }
        result = await request(options);
        let {status:{code}} = result.body;
        if(code === 200){
            res.clearCookie('token').clearCookie('email').redirect("/");
        }
        
    }catch(err){
        console.log(err);
    }
})

router.get("/mypage", async (req, res)=>{
    let result;
    let sendData = {
        email: req.cookies.email
    }
    const user = await User.findOne({email: req.cookies.email});
    try{
        let options = {
            url: `${base_url}/api/user/mybooks`,
            method: "get",
            json: true,
            maxAttempts: 2,
            form: sendData,
            retryDelay: 500,
            retryStrategy: request.RetryStrategies.HTTPOrNetworkError
        }
        result = await request(options);
        const items = result.body;
        res.render("mypage2",{items, user})
    }catch(err){
        console.log(err)
    }
})

router.get("/mypage/:id", async (req, res)=>{
    let item;
    let sendData = {
        email: req.cookies.email,
    }
    let {id} = req.params
    try{
        let options = {
            url: `${base_url}/api/user/mybooks/${id}`,
            method: "get",
            json: true,
            maxAttempts: 2,
            form: sendData,
            retryDelay: 500,
            retryStrategy: request.RetryStrategies.HTTPOrNetworkError
        }
        result = await request(options);
        item = result.body
        
        res.render("saveDetail2",{
            item
        })
    }catch(err){
        console.log(err)
    }
})

router.post("/mypage/:id", async (req, res)=>{
    let item;
    let sendData = {
        email: req.cookies.email,
        comment : req.body.comment,
    };
    let {id} = req.params;
    try{
        let options = {
            url: `${base_url}/api/user/mybooks/${id}`,
            method: "post",
            json: true,
            maxAttempts: 2,
            form: sendData,
            retryDelay: 500,
            retryStrategy: request.RetryStrategies.HTTPOrNetworkError
        }
        result = await request(options);
        console.log("result.body :",result.body);
        item = result.body
        
        res.redirect(`/user/mypage/${id}`);
    }catch(err){
        console.log(err)
    }
})

module.exports = router;
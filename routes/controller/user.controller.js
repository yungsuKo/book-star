const express = require('express');
const request = require('requestretry');
const router = express();

router.get('/signup', (req, res)=>{
    res.render('signup2');
})
router.post('/signup', async (req, res, next)=>{
    console.log("Sign up post is in here")
    console.log(req.body)
    let result
    try{
        let options = {
            url: process.env.BASE_URL+"/api/user/signup",
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
        errorMsg: ""
    });
})
router.post('/login', async (req, res, next)=>{
    let result;
    let user;
    try{
        let options = {
            url: process.env.BASE_URL+"/api/user/login",
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
                errorMsg : message
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
            url: "http://127.0.0.1:3000/api/user/logout",
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
    try{
        let options = {
            url: "http://127.0.0.1:3000/api/user/mybooks",
            method: "get",
            json: true,
            maxAttempts: 2,
            form: sendData,
            retryDelay: 500,
            retryStrategy: request.RetryStrategies.HTTPOrNetworkError
        }
        result = await request(options);
        const items = result.body;
        res.render("mypage2",{items})
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
            url: `http://127.0.0.1:3000/api/user/mybooks/${id}`,
            method: "get",
            json: true,
            maxAttempts: 2,
            form: sendData,
            retryDelay: 500,
            retryStrategy: request.RetryStrategies.HTTPOrNetworkError
        }
        result = await request(options);
        item = result.body
        
        res.render("saveDetail",{
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
    console.log(sendData.comment)
    let {id} = req.params;
    try{
        let options = {
            url: `http://127.0.0.1:3000/api/user/mybooks/${id}`,
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
const express = require('express');
const request = require('requestretry');
const router = express();

router.get('/signup', (req, res)=>{
    res.render('signup');
})
router.post('/signup', async (req, res, next)=>{
    let result
    try{
        let options = {
            url: "http://127.0.0.1:3000/api/user/signup",
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
    res.render('login',{
        errorMsg: ""
    });
})
router.post('/login', async (req, res, next)=>{
    let result;
    let user;
    try{
        let options = {
            url: "http://127.0.0.1:3000/api/user/login",
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
            res.render("login", {
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
            res.clearCookie().redirect("/");
        }
        
    }catch(err){
        console.log(err);
    }
})

module.exports = router;
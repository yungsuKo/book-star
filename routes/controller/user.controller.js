const express = require('express');
const request = require('requestretry');
const router = express();

router.get('/signup', (req, res)=>{
    res.locals.isLogin = false;
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
    res.locals.isLogin = false;
    res.render('login');
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
        console.log(result.body.data);
        user = result.body.data;
        res.cookie('jwt', result.body.token)
        res.redirect("/");
    }catch(err){
        console.log(err);
    }
})

module.exports = router;
const express = require('express');
const request = require('requestretry');
const router = express();

router.get('/signup', (req, res)=>{
    res.locals.isLogin = false;
    res.render('signup');
})
router.post('/signup', async (req, res, next)=>{
    let result
    console.log(req.body);
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
    }catch(err){
        console.log(err);
    }
    res.locals.isLogin = true;
    res.redirect("/");
})

module.exports = router;
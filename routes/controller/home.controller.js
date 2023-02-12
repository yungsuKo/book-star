const express = require('express');
const request = require('requestretry');
const router = express();

router.get('/', async(req, res, next) => {
    let result;
    try{
        let options = {
            url: `http://127.0.0.1:3000/api/book`,
            method: 'GET',
            json: true,
            maxAttempts: 2,
            retryDelay: 500,
            retryStrategy: request.RetryStrategies.HTTPOrNetworkError
        }
        result = await request(options);
        items = result.body.data;
    }catch(error){
        console.log(error);
    }
    res.locals.isLogin = false;
    res.render('home', {
        items
    })
})

module.exports = router;
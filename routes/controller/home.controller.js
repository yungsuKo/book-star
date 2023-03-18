const express = require('express');
const request = require('requestretry');
const router = express();

const base_url = process.env.BASE_URL || 'http://localhost:3000';

router.get('/', async(req, res, next) => {
    let result;
    try{
        console.log("req.cookies : ",req.cookies)
        let options = {
            url: `${base_url}/api/book`,
            method: 'GET',
            json: true,
            maxAttempts: 2,
            retryDelay: 500,
            retryStrategy: request.RetryStrategies.HTTPOrNetworkError
        }
        result = await request(options);
        items = result.body.data;
        console.log(process.env.BASE_URL)
    }catch(error){
        console.log(error);
    }
    res.render('home2', {
        items
    })
})

module.exports = router;
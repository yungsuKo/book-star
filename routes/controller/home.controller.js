const express = require('express');
const router = express.Router();
const request = require('requestretry');

router.get('/', async(req, res, next) => {
    try{
        let options = {
            url: `https://openapi.naver.com/v1/search/book.json?query=${encodeURI('애자일')}`,
            headers : {
                'X-Naver-Client-Id' : "991MGOeYV0TDxhr0iXDO",
                'X-Naver-Client-Secret' : "qxNN2JiZGw"
            },
            method: 'GET',
            json: true,
            maxAttempts: 2,
            retryDelay: 500,
            retryStrategy: request.RetryStrategies.HTTPOrNetworkError
        }
        let result = await request(options);
        console.log(result.body);
    }catch(error){
        console.log(error);
    }

    res.render('home')
})

module.exports = router;
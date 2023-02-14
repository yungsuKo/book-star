const express = require('express');
const request = require('requestretry');
const router = express();


router.get('/:id', async(req, res, next) => {
    let result;
    try{
        let options = {
            url: `http://127.0.0.1:3000/api/book/${req.params.id}`,
            method: 'GET',
            json: true,
            maxAttempts: 2,
            retryDelay: 500,
            retryStrategy: request.RetryStrategies.HTTPOrNetworkError
        }
        result = await request(options);
        console.log(result.body.data)
        
    }catch(error){
        console.log(error);
    }
    res.render('bookDetail',{
        item : result.body.data
    })
})

module.exports = router;
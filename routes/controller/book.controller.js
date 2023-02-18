const express = require('express');
const request = require('requestretry');
const router = express();


router.get('/:id', async(req, res, next) => {
    let result;
    let item;
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
        item = result.body.data;
        console.log(item);
    }catch(error){
        console.log(error);
    }
    res.render('bookDetail',{
        item
    })
})

router.post('/save/:id', async(req, res, next) => {
    let result;
    let item;
    try{
        console.log('im in contoller')
        let options = {
            url: `http://127.0.0.1:3000/api/book/save/${req.params.id}`,
            method: 'post',
            json: true,
            body: {email: req.body.email},
            maxAttempts: 2,
            retryDelay: 500,
            retryStrategy: request.RetryStrategies.HTTPOrNetworkError
        }
        result = await request(options);
        item = result.body.data;
        console.log(item);
    }catch(error){
        console.log(error);
    }
    res.json({
        status: {
            code: 200,
            message : 'Book save success'
        }
    })
})

module.exports = router;
const express = require('express');
const request = require('requestretry');
const router = express();
const BookSave = require('../../models/SavedBook');

router.get('/:id', async(req, res, next) => {
    let result;
    let item;
    let exist;
    try{
        let {email} = req.cookies;
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
        exist = await BookSave.exists({email, isbn:item.isbn._text, use_yn: 'y'})
    }catch(error){
        console.log(error);
    }
    res.render('bookDetail',{
        item,
        exist
    })
})

router.post('/save/:id', async(req, res, next) => {
    let result;
    let item;
    try{
        let options = {
            url: `http://127.0.0.1:3000/api/book/save/${req.params.id}`,
            method: 'post',
            json: true,
            body: {
                email: req.body.email,
                comment: req.body.comment,
                rating: req.body.rating
            },
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
router.post('/unsave/:id', async(req, res, next) => {
    let result;
    let item;
    console.log(req.params.id)
    try{
        let options = {
            url: `http://127.0.0.1:3000/api/book/unsave/${req.params.id}`,
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
            message : 'Book unsave success'
        }
    })
})

module.exports = router;
const express = require('express');
const request = require('requestretry');
const router = express();
const BookSave = require('../../models/SavedBook');
const User = require('../../models/User');

router.get('/:id', async(req, res, next) => {
    let result;
    let item;
    let exist;
    try{
        let {email} = req.cookies;
        let user = await User.find({email})
        
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
        exist = await BookSave.exists({$and:[{uid: user[0]._id}, {isbn:item.isbn._text}, {use_yn: 'y'}]})
        console.log(exist)
        // 1. user가 없는 경우
        // 2. 책이 저장되어 있지 않은 경우
        
    }catch(error){
        console.log(error);
    }
    res.render('bookDetail2',{
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
                title: req.body.title,
                img: req.body.img,
                rating: req.body.rating,
                bookUrl: req.body.bookUrl
            },
            maxAttempts: 2,
            retryDelay: 500,
            retryStrategy: request.RetryStrategies.HTTPOrNetworkError
        }
        result = await request(options);
        item = result.body;
        console.log(item);
    }catch(error){
        console.log(error);
    }
    res.json(item)
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
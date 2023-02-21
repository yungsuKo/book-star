const request = require('requestretry');
const convert = require('xml-js');
const SavedBook = require('../../../models/SavedBook');
const User = require('../../../models/User');

exports.getBookList = async (req, res) => {
    const getData = async (req) => {
        try{
            let items;
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
                items = result.body.items; 
                res.json({
                    status : {
                        code : 200,
                        message: 'success'
                    },
                    paging : {
                        count : items.length
                    },
                    data : items,
                });
            }catch(error){
                console.log(error);
            }
        }catch(err){
            onError(err);
        }
    }
    // error occured
    const onError = (error) => {
        res.status(400).json({
            status : {
                code : 400,
                message: error.name==='logic'?error.message:''
            },
            items : [
                {
                    title: '',
                    link: '',
                    image: '',
                    author:'',
                    discount: '',
                    publisher: '',
                    pubdate: '',
                    isbn : '',
                    description: ''
                }
            ]
        });
    }
    await getData();
}

exports.getBookSearchList = async (req, res) => {
    const getData = async () => {
        try{
            let searchKeyword = req.query.search_keyword;
            console.log("searchlist is running", searchKeyword);
            let items;
            try{
                let options = {
                    url: `https://openapi.naver.com/v1/search/book.json?query=${encodeURI(searchKeyword)}`,
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
                items = result.body.items; 
                console.log(items);
                res.json({
                    status : {
                        code : 200,
                        message: 'success'
                    },
                    paging : {
                        count : items.length
                    },
                    data : items,
                });
            }catch(error){
                console.log(error);
            }
        }catch(err){
            onError(err);
        }
    }
    // error occured
    const onError = (error) => {
        res.status(400).json({
            status : {
                code : 400,
                message: error.name==='logic'?error.message:''
            },
            items : [
                {
                    title: '',
                    link: '',
                    image: '',
                    author:'',
                    discount: '',
                    publisher: '',
                    pubdate: '',
                    isbn : '',
                    description: ''
                }
            ]
        });
    }
    await getData();
}

exports.getBookDetail = async (req, res) => {
    const getData = async () => {
        const id = req.params.id;
        try{
            let item;
            try{
                let options = {
                    url: `https://openapi.naver.com/v1/search/book_adv.xml?d_isbn=${id}`,
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
                item = convert.xml2json(result.body, {compact: true, spaces: 4});
                item = JSON.parse(item).rss.channel.item;
                res.json({
                    status : {
                        code : 200,
                        message: 'success'
                    },
                    data : item,
                });
            }catch(error){
                console.log(error);
            }
        }catch(err){
            onError(err);
        }
    }
    // error occured
    const onError = (error) => {
        res.status(400).json({
            status : {
                code : 400,
                message: error.name==='logic'?error.message:''
            },
            items : [
                {
                    title: '',
                    link: '',
                    image: '',
                    author:'',
                    discount: '',
                    publisher: '',
                    pubdate: '',
                    isbn : '',
                    description: ''
                }
            ]
        });
    }
    await getData();
}

exports.postBookSave = async (req, res) => {
    const postData = async () => {
        const {id} = req.params;
        const {email, comment, rating} = req.body;

        try{
            const user = await User.findOne({email});
            try{
                const exist = await SavedBook.findOne({uid: user._id, isbn: id});
                if(!exist){
                    let book = await SavedBook.create({
                        isbn: id,
                        uid: user._id,
                        comment,
                        rating,
                        use_yn: 'y'
                    })
                    console.log(book);
                    return res.json({
                        status: {
                            code: 200
                        }
                    })
                }else{
                    let updatedBook = await SavedBook.findOneAndUpdate({
                        isbn: id,
                        uid: user._id,
                    }, {
                        isbn: id,
                        uid: user._id,
                        comment,
                        rating,
                        use_yn: 'y',
                        update_dt : new Date(Date.now())
                    },{
                        new: true
                    })
                    console.log("updatedBook", updatedBook.use_yn);
                    return res.json({
                        status: {
                            code: 200
                        }
                    })
                }
                
            }catch(error){
                console.log(error);
            }
        }catch(err){
            onError(err);
        }
    }
    // error occured
    const onError = (error) => {
        res.status(400).json({
            status : {
                code : 400,
                message: error.name==='logic'?error.message:''
            },
            items : [
                {
                    title: '',
                    link: '',
                    image: '',
                    author:'',
                    discount: '',
                    publisher: '',
                    pubdate: '',
                    isbn : '',
                    description: ''
                }
            ]
        });
    }
    await postData();
}

exports.postBookUnsave = async (req, res) => {
    const postData = async () => {
        const id = req.params.id;
        const email = req.body.email;
        console.log(id)
        try{
            const user = await User.findOne({email});
            let updatedBook = await SavedBook.findOneAndUpdate({
                isbn: id,
                uid: user._id,
            }, {
                use_yn: 'n',
                update_dt : new Date(Date.now())
            },{
                new: true
            })
            console.log("updatedBook", updatedBook);
            return res.json({
                status: {
                    code: 200
                }
            })
        }
        catch(error){
            console.log(error);
        }
        
    }
    // error occured
    const onError = (error) => {
        res.status(400).json({
            status : {
                code : 400,
                message: error.name==='logic'?error.message:''
            },
            items : [
                {
                    title: '',
                    link: '',
                    image: '',
                    author:'',
                    discount: '',
                    publisher: '',
                    pubdate: '',
                    isbn : '',
                    description: ''
                }
            ]
        });
    }
    await postData();
}
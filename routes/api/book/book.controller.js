const request = require('requestretry');

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
        let searchKeyword = req.query.search_keyword;
        console.log("searchlist is running");

        try{
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
                item = result.body; 
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
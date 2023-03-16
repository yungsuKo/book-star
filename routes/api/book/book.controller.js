const request = require('requestretry');
const convert = require('xml-js');
const SavedBook = require('../../../models/SavedBook');
const User = require('../../../models/User');
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

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
        const { bookUrl, comment, title, img, rating, email } = req.body;
        
        try{
            const user = await User.findOne({email});
            if(id === 'newBook'){
                // 크롤링
                console.log('hi im in here');
                try {
                    const browser = await puppeteer.launch({ headless: false });
                    const page = await browser.newPage();
                    await page.goto(bookUrl);
                    const content = await page.content();
                    const $ = cheerio.load(content);
                    const title = $('#contents > div.prod_detail_header > div > div.prod_detail_title_wrap > div > div.prod_title_box.auto_overflow_wrap > div.auto_overflow_contents > div > h1 > span').text();
                    const isbn = $('#scrollSpyProdInfo > div.product_detail_area.basic_info > div.tbl_row_wrap > table > tbody > tr:nth-child(1) > td').text().split('(')[0].trim();
                    const author = $('#contents > div.prod_detail_header > div > div.prod_detail_view_wrap > div.prod_detail_view_area > div:nth-child(1) > div > div.prod_author_box.auto_overflow_wrap > div.auto_overflow_contents > div > div > a:nth-child(1)').text();
                    const img = $('#contents > div.prod_detail_header > div > div.prod_detail_view_wrap > div.prod_detail_view_area > div.col_prod_info.thumb > div.prod_thumb_swiper_wrap.active > div.swiper-container.prod_thumb_list_wrap.swiper-container-fade.swiper-container-horizontal > ul > li.prod_thumb_item.swiper-slide.swiper-slide-visible.swiper-slide-active > div > div.portrait_img_box.portrait > img').attr('src');
                    await page.close();
                    await browser.close();
                    const exist = await SavedBook.exists({isbn, use_yn: 'y'});
                    console.log(exist)
                    if(exist){
                        return res.json({
                            status: {
                                code: 409
                            }
                        })
                    }
                    try {
                        let book = await SavedBook.create({
                            isbn,
                            uid: user._id,
                            img,
                            comment,
                            title,
                            rating,
                            author,
                            use_yn: 'y'
                        })
                        return res.json({
                            status: {
                                code: 200
                            }
                        })
                    }
                    catch(err){
                        console.log(err);
                    }
                } catch (error) {
                    console.log(error);
                }
            }else{   
                try{
                    const exist = await SavedBook.findOne({uid: user._id, isbn: id});
                    if(!exist){
                        let book = await SavedBook.create({
                            isbn: id,
                            uid: user._id,
                            img,
                            comment,
                            title,
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
                        await SavedBook.findOneAndUpdate({
                            isbn: id,
                            uid: user._id,
                        }, {$set:
                            {
                                isbn: id,
                                uid: user._id,
                                comment,
                                title,
                                img,
                                rating,
                                use_yn: 'y',
                                update_dt : new Date(Date.now())
                            }
                        },{
                            new: true
                        })
                        return res.json({
                            status: {
                                code: 200
                            }
                        })
                    }                   
                }catch(error){
                    console.log(error);
                }
            }
        }catch(err){
            console.log(err);
            return res.json({
                status: {
                    code: 401
                }
            })
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
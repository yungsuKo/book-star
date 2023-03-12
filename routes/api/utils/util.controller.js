

exports.profileImageUploader = async (req, res, next) => {

    
    s3.upload(params, function(err, data){
        if(err){
            throw err;
        }
        console.log('File uploaded successfully');
        return res.json(data);
    })
}
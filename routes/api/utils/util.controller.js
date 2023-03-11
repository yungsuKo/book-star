const aws = require('aws-sdk');
const fs = require('fs')
const s3 = new aws.s3({
    accessKeyId : process.env.AWS_ACCESS_KEY,
    secretAccessKey : process.env.AWS_ACCESS_SECRET,
})

exports.profileImageUploader = async (req, res, next) => {
    const params = {
        Bucket : 'elasticbeanstalk-ap-northeast-2-053255126826',
        Key : 'profileImage',
        Body : fs.readFileSync(req.body.profile_img),
        ContentType: "image/*"
    }

    s3.upload(params, function(err, data){
        if(err){
            throw err;
        }
        console.log('File uploaded successfully');
        return res.json(data);
    })
}
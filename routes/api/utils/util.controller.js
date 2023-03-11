const aws = require('aws-sdk');
const s3 = new aws.s3({
    accessKeyId : process.env.AWS_ACCESS_KEY,
    secretAccessKey : process.env.AWS_ACCESS_SECRET,
})

exports.profileImageUploader = async (req, res, next) => {

}
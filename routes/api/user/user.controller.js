const User = require('../../../models/User');

exports.signup = async (req, res) => {
    const createUser = async () => {    
        try{
            const {email, password, nickname} = req.body;
            const user = await User.create({
                email, password, nickname
            })
            console.log(user)
            res.json({
                status : {
                    code : 200,
                    message: 'success'
                },
                data: user
            });
        }catch(err){
            console.log(err);
        }
    }
    await createUser();
}
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = new mongoose.Schema({
    email : String,
    password : String,
    nickname : String
});

userSchema.pre('save' , async function(next){
    try{
        const user = this;
        if(user.isModified('password')){
            console.log('비밀번호가 변경됩니다.');
            const hash = await bcrypt.hash(user.password, saltRounds);
            user.password = hash;
            console.log(user)
            
        }
    }
    catch(err){
        console.log(err);
    }
})

module.exports = mongoose.model('User', userSchema);
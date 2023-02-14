const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email : String,
    password : String,
    nickname : String
});

userSchema.pre('save' , async (next)=>{
    const user = this;
    console.log(user);
    // this를 못가져오고 있는중
    if(this.$isNew){
        console.log('비밀번호가 변경됩니다.')
    }
})

module.exports = mongoose.model('User', userSchema);
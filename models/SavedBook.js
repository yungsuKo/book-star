const mongoose = require('mongoose');

const savedBookSchema = new mongoose.Schema({
    isbn : String,
    uid : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    use_yn : {type: String, default:"y"}
});

module.exports = mongoose.model('savedBook', savedBookSchema);
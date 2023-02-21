const mongoose = require('mongoose');

const savedBookSchema = new mongoose.Schema({
    isbn : String,
    uid : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    use_yn : {type: String, default:"y"},
    comment: String,
    rating: String,
    create_dt : {type: Date, default: new Date(Date.now())},
    update_dt : {type: Date, default: new Date(Date.now())}
});

module.exports = mongoose.model('savedBook', savedBookSchema);
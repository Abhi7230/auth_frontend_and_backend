const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    referralCode: {
        type: String,
        required: true,
        unique: true
    },
    referralBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    referralCount: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Referral', referralSchema);

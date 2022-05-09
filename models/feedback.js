const mongoose = require("mongoose");


const feedback = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    feedback: { type: String, required: true },
    rdv:{type:mongoose.Schema.Types.ObjectId,ref:'rdvs'}
});

module.exports = mongoose.model('feedbacks', feedback);

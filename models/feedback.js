const mongoose = require("mongoose");


const feedback = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    feedback: { type: Number, required: true },
    rdv:{type:mongoose.Schema.Types.ObjectId,ref:'rdvs'}
});

module.exports = mongoose.model('feedbacks', feedback);

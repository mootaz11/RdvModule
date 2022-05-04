const mongoose = require("mongoose");


const rdvModel = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    date: {type:Date,required:true},
    participants:[{type:mongoose.Schema.Types.ObjectId,ref:'user'}]



});


module.exports = mongoose.model('rdv', rdvModel);

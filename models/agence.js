const mongoose = require("mongoose");


const agenceModel = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    addresse: {type:String,required:true},
    conseillers:[{type:mongoose.Schema.Types.ObjectId,ref:'users'}],
    image: { type: String, required: true }

});


module.exports = mongoose.model('agences', agenceModel);

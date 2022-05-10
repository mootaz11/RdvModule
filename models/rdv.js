const mongoose = require("mongoose");


const rdvModel = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    date: {type:Date,required:true},
    hour : {type:String,required:true},
    confirmed: {type:Boolean,default:false},
    participants:[{type:mongoose.Schema.Types.ObjectId,ref:'users'}],
    state: {type: String,enum: ['opened', 'closed']
}
});

module.exports = mongoose.model('rdvs', rdvModel);

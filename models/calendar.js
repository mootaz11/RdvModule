const mongoose = require("mongoose");


const calendarModel = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstday: { type: Date, required: true },
    lastday: {type:Date,required:true},
    starthour:{type:String,required:true},
    lasthour:{type:String,required:true},
    notavailabledays : {
        begin: {type:Date,required:true},
        end: {type:Date,required:true},
    },
    conseiller:{type:mongoose.Schema.Types.ObjectId,ref:'users'}
});
module.exports = mongoose.model('calendars', calendarModel);

const mongoose = require("mongoose");


const calendarModel = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstday: { type: Date, required: true },
    lastday: {type:Date,required:true},
    starthour:{type:Date,required:true},
    lasthour:{type:Date,required:true},
    notavailabledays : {
        begin: {type:Date,required:true},
        end: {type:Date,required:true},
    },
    conseiller:{type:mongoose.Schema.Types.ObjectId,ref:'users'}
});

module.exports = mongoose.model('calendars', calendarModel);

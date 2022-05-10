const calendarModel = require("../models/calendar");
const userModel = require("../models/user");
const mongoose = require("mongoose");



exports.creatCalendar = (req,res)=>{
    const calendar = new calendarModel({
        _id: new mongoose.Types.ObjectId(),
        firstday: req.body.firstday,
        lastday:req.body.lastday,
        starthour:req.body.starthour,
        lasthour:req.body.lasthour,
        notavailabledays :req.body.notavailabledays,
        conseiller:req.params.idconseiller
    })
    calendar.save().then( async (calendar_crated) =>{
        if (calendar_crated) {
            const conseillerupdated = await userModel.findByIdAndUpdate(req.params.idconseiller,{$set:{calendar:calendar_crated}})
            if(conseillerupdated){
                return res.status(201).json({ message: 'calendar created', calendar_crated });
            }
            else {
                return res.status(400).json({ message: 'something went wrong'});

            }
        }
        else 
        {
            return res.status(400).json({ message: 'something went wrong' });
        }
    }).catch(err=>{
        return res.status(500).json(err);

    })
}




exports.updateCalendar = async  (req,res)=>{
    try {
        const calendar = await calendarModel.findById(req.params.id);
        if(calendar){
            Object.keys(req.body).forEach(element=>{
                calendar[element]=req.body[element];
            })
            calendar.save().then(calendar_updated=>{
                calendar_updated && res.status(200).json(calendar_updated);
                !calendar_updated && res.status(400).json({message:'something went wrong'});
            }).catch(err=>{
                return res.status(500).json(err);

            })
        }
        else {
            return res.status(404).json({message:'calendar not found'});
        }
    }
    catch(err){
        return res.status(500).json(err);
    }

}





exports.deleteCalendar = (req,res)=>{
    calendarModel.findOneAndDelete({_id:req.params.id})
    .exec()
    .then(result => {
        if (result) {
            return res.status(200).json({ message: 'calendar deleted' });
        } else {
            return res.status(400).json({ message: 'calendar delete failed' });
        }
    })
    .catch(err => {
        return res.status(500).json(err);
    })

}


exports.getCalendar = async (req,res)=>{
    
    try {
        const calendar = await calendarModel.findById(req.params.id)
        calendar && res.status(200).json(calendar);
        !calendar && res.status(404).json({message:"agence not found"});
    }
    catch( err) { 
        return res.status(500).json(err);
    }
    
}

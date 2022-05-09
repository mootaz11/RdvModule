const rdvModel = require("../models/rdv");
const socket = require('socket.io-client')("localhost:3000");
const notificationModel = require("../models/notification");


exports.createRdv = (req,res) => { 
    try { 
            const  rdv = new rdvModel({
                _id: new mongoose.Types.ObjectId(),
                title:req.body.title,
                date: req.body.date,
                hour : req.body.hour,
                confirmed: false,
                participants:req.body.participants
            })
            rdv.save().then(rdvCreated=>{
                if(rdvCreated){
                    return res.status(201).json({ message: 'rdv created', rdvCreated });
            }
            else 
            {
                return res.status(400).json({ message: 'something went wrong' });
            }

            }).catch(err=>{
                return res.status(500).json(err);

            })
    }
    catch(err){
        return XPathResult.status(500).json(err)
    }
}

exports.updateRdv = async (req,res) => { 
    try {
        const rdv = await rdvModel.findById(req.params.id);
        if(rdv){
            Object.keys(req.body).forEach(element=>{
                rdv[element]=req.body[element];
            })
            rdv.save().then(rdv_updated=>{
                rdv_updated && res.status(200).json(rdv_updated);
                !rdv_updated && res.status(400).json({message:'something went wrong'});
            }).catch(err=>{
                return res.status(500).json(err);
            })
        }
        else {
            return res.status(404).json({message:'rdv not found'});
        }
    }
    catch(err){
        return res.status(500).json(err);
    }

}


exports.deleteRdv = (req,res) => { 
    rdvModel.findOneAndDelete({_id:req.params.id})
    .exec()
    .then(result => {
        if (result) {
            return res.status(200).json({ message: 'rdv deleted' });
        } else {
            return res.status(400).json({ message: 'rdv delete failed' });
        }
    })
    .catch(err => {
        return res.status(500).json(err);
    })
}
exports.confirmRdv = async (req,res) =>{ 
try { 

    const rdv = await rdvModel.findById(req.params.id);
    if(rdv){
        if(req.body.confirmed===false){
            const Notification = new notificationModel({
                _id:mongoose.Types.ObjectId(),
                message:" rendez-vous n'est pas confirmé",
                user:req.params.idclient
            })
            Notification.save().then(notification_created=>{
                if(notification_created){
                    socket.emit('rdv-notconfirmed',{clientId:req.params.idclient,notification:notification_created});
                }
                else {
                    return res.status(400).json({ message: 'rdv confirm failed' });
                }            
            })
        }
        else {
            const rdv_updated = await rdvModel.findByIdAndUpdate(req.params.id,{$set:{confirmed:true}});
            if(rdv_updated) {
                return res.status(200).json({ message: 'rdv confirmed' });
            }
        }}}
catch (err){
    return res.status(500).json(err);
}}


exports.getRdvsByConseiller = async (req,res) =>{
    try {
    const rdvs = await rdvModel.find({participants:{"$in":[req.params.idconseiller]}});
    rdvs && rdvs.length>0 &&  res.status(200).json(rdvs);
    rdvs && rdvs.length==0 && res.status(404).json({message:"rdvs not found"});
    }
    catch( err) { 
        return res.status(500).json(err);
    }
}

exports.getRdv = async (req,res) => {    
    try {
        const rdv = await rdvModel.findById(req.params.id)
        rdv && res.status(200).json(rdv);
        !rdv && res.status(404).json({message:"rdv not found"});
    }
    catch( err) { 
        return res.status(500).json(err);
    }
}
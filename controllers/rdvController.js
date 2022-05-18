const rdvModel = require("../models/rdv");
const socket = require('socket.io-client')("http://localhost:3000");
const notificationModel = require("../models/notification");
const mongoose = require('mongoose');


exports.createRdv = (req,res) => { 
    try { 
            const  rdv = new rdvModel({
                _id: new mongoose.Types.ObjectId(),
                title:req.body.title,
                date: req.body.date,
                hour : req.body.hour,
                confirmed: false,
                participants:req.body.participants,
                state:'opened'
            })
            rdv.save().then(rdvCreated=>{
                if(rdvCreated){
                    const Notification = new notificationModel({
                        _id:mongoose.Types.ObjectId(),
                        message:" rendez-vous est créé",
                        user:req.params.idconseiller
                    })
                    Notification.save().then(notif_created=>{
                        if (notif_created){
                            socket.emit('rdv-created',{conseillerId:req.params.idconseiller,notification:notif_created});
                           res.status(201).json({ message: 'rdv created', rdvCreated });
                        }
                    })
            }
            else 
            {
                return res.status(400).json({ message: 'something went wrong' });
            }

            }).catch(err=>{
                console.log(err)
                return res.status(500).json(err);

            })
    }
    catch(err){
        console.log(err)

        return res.status(500).json(err)
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

                if(rdv_updated){
                    const Notification = new notificationModel({
                        _id:mongoose.Types.ObjectId(),
                        message:" rendez-vous est mis à jour",
                        user:req.params.idconseiller
                    })

                    Notification.save().then(notif_created=>{
                       if(notif_created){
                        socket.emit('rdv-updated',{conseillerId:req.params.idconseiller,notification:notif_created});

                        return res.status(200).json(rdv_updated);

                       }
                       else {
                        return res.status(400).json({message:'something went wrong'});
                       }
                    })
                }

                else {
                    return res.status(400).json({message:'something went wrong'});
                }

                
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

                const Notification = new notificationModel({
                _id:mongoose.Types.ObjectId(),
                message:" rendez-vous est supprimé",
                user:req.body.idconseiller
                    })
                    Notification.save().then(notif_created=>{
                        if(notif_created){
                            socket.emit('rdv-deleted',{conseillerId:req.body.idconseiller,notification:notif_created});
                            return res.status(200).json({ message: 'rdv deleted' });
                        }
                    })
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
                    res.status(200).json({ message: 'rdv non confirmé'});

                }
                else {
                    return res.status(400).json({ message: 'rdv confirm failed' });
                }            
            })
        }
        
        else {
            const rdv_updated = await rdvModel.findByIdAndUpdate(req.params.id,{$set:{confirmed:true}});
            if(rdv_updated) {
                const Notification = new notificationModel({
                    _id:mongoose.Types.ObjectId(),
                    message:" rendez-vous est confirmé",
                    user:req.params.idclient
                })

                Notification.save().then(notification_created=>{
                    if(notification_created){
                        try {
                            socket.emit('rdv-confirmed',{clientId:req.params.idclient,notification:notification_created});
                            res.status(200).json({ message: 'rdv confirmé',rdv_updated });

                        }
                        catch (err){
                            console.log(err)
                        }

                    }
                    else {
                        return res.status(400).json({ message: 'rdv confirm failed' });
                    }            
                })
            }
        }}}
catch (err){
    return res.status(500).json(err);
}}


exports.getRdvsByConseiller = async (req,res) =>{
    try {
    const rdvs = await rdvModel.find({$and :[{participants:{"$in":[req.params.idconseiller]}},{state:"opened"}]}).populate('participants')
    rdvs && rdvs.length>0 &&  res.status(200).json(rdvs);
    rdvs && rdvs.length==0 && res.status(404).json({message:"rdvs not found"});
    }
    catch( err) { 
        return res.status(500).json(err);
    }
}


exports.getClosedRdvs = async (req,res) =>{
    try{
        const rdv = await rdvModel.find({$and:[{_id:req.params.id},{state:"closed"}]}).populate('participants')
        rdv && res.status(200).json(rdv);
        !rdv && res.status(404).json({message:"closed rdv not found"});
    }
    catch(err){
        return res.status(500).json(err)
    }
}

exports.getRdv = async (req,res) => {    
    try {
        const rdv = await rdvModel.findById(req.params.id).populate('participants')
        rdv && res.status(200).json(rdv);
        !rdv && res.status(404).json({message:"rdv not found"});
    }
    catch( err) { 
        return res.status(500).json(err);
    }
}

const agenceModel = require("../models/agence");
const userModel = require("../models/user");
const mongoose = require("mongoose");

exports.getAgences= async (req,res) =>{
try {
    const agences = await agenceModel.find().populate('conseillers');
    agences && agences.length>0 &&  res.status(200).json(agences);
    agences && agences.length==0 && res.status(404).json({message:"agences not found"});
}
catch( err) { 
    return res.status(500).json(err);
}
    }

exports.getAgence = async (req,res) =>{
    
try {

    const agence = await agenceModel.findById(req.params.id).populate('conseillers')
    agence && res.status(200).json(agence);
    !agence && res.status(404).json({message:"agence not found"});
}
catch( err) { 
    return res.status(500).json(err);
}

}

exports.createAgence = (req,res)=>{
    const agence = new agenceModel({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        addresse:req.body.addresse,
        conseillers : []
    })
    agence.save().then((agence_crated) =>{
        if (agence_crated) {
            return res.status(201).json({ message: 'agence created', agence_crated });
        }
        else 
        {
            return res.status(400).json({ message: 'something went wrong' });
        }
    })

}

exports.updateAgence = async (req,res)=>{
    try {
        const agence = await agenceModel.findById(req.params.id);
        if(agence){
            Object.keys(req.body).forEach(element=>{
                agence[element]=req.body[element];
            })
            agence.save().then(agence_updated=>{
                agence_updated && res.status(200).json(agence_updated);
                !agence_updated && res.status(400).json({message:'something went wrong'});
            }).catch(err=>{
                return res.status(500).json(err);

            })
        }
        else {
            return res.status(404).json({message:'agence not found'});
        }
    }
    catch(err){
        return res.status(500).json(err);
    }
}


exports.deleteAgence=(req,res)=>{
    agenceModel.findOneAndDelete({_id:req.params.id})
    .exec()
    .then(result => {
        if (result) {
            return res.status(200).json({ message: 'agence deleted' });
        } else {
            return res.status(400).json({ message: 'agence delete failed' });
        }
    })
    .catch(err => {
        return res.status(500).json(err);
    })
}

exports.addConseiller=async (req,res)=>{

    userModel.findOne({$and : [{_id:req.params.idconseiller},{role:"conseiller"}]}).exec()
    .then(async conseiller=>{
           
        const agence = await agenceModel.findOneAndUpdate({$and:[{_id:req.params.idagence},{conseillers:{$nin:[conseiller]}}]},{$push:{conseillers:conseiller}})        
        if(agence){
            conseiller.agence=agence._id;
            conseiller.save().then(updated=>{
                updated &&  res.status(200).json(agence);
                !updated   && res.status(400).json("something went wrong"); 
        }).catch(err=>{
                return res.status(500).json(err);
            })
           }
           else {
               return res.status(400).json("agence not found ou conseiller déja existe ");  
           }
    })
    .catch(err=>{
        return res.status(500).json(err);
    })
    
    }

    

exports.deleteConseiller=(req,res)=>{
    userModel.findOne({$and : [{_id:req.params.idconseiller},{role:"conseiller"}]}).exec()
    .then(async conseiller=>{
            const agence = await agenceModel.findByIdAndUpdate(req.params.idagence,{$pull:{conseillers:conseiller}})
            if(agence){
                conseiller.agence=null;
                conseiller.save().then(
                    updated=>{
                updated &&  res.status(200).json("conseiller deleted");
                !updated  && res.status(404).json("conseiller not found ");  
                }).catch(err=>{
                    return res.status(500).json(err);
                })
            }
            else {
                return res.status(404).json("agence not found ");  
            }
    })
    .catch(err=>{
        return res.status(500).json(err);
    })
    
}
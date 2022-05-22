const agenceModel = require("../models/agence");
const userModel = require("../models/user");
const mongoose = require("mongoose");

exports.getAgences= async (req,res) =>{
try {
    const agences = await agenceModel.find().populate('conseillers');
    agences && agences.length>0 && agences.map(result=>{
        if(result.image){
            result.image="http://localhost:3000/" + result.image.split("\\")[0]+ "/"+ result.image.split("\\")[1] ;
        }
        return result
    }) && res.status(200).json(agences);
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
        image:req.file.path,
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
        console.log(req.params.id)
        const agence = await agenceModel.findById(req.params.id);
        if(agence){
            console.log(req.body)
            Object.keys(req.body).forEach(element=>{
                agence[element]=req.body[element];
            })
            agence.image=req.file.path
            agence.save().then(agence_updated=>{
                agence_updated && res.status(200).json(agence_updated);
                !agence_updated && res.status(400).json({message:'something went wrong'});
            }).catch(err=>{
                console.log(err);
                return res.status(500).json(err);

            })
        }
        else {
            return res.status(404).json({message:'agence not found'});
        }
    }
    catch(err){
        console.log(err);
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
    userModel.findOneAndUpdate({_id:req.params.idconseiller},{$set:{agence:null}}).exec()
    .then(async conseillerupdated=>{
       if(conseillerupdated){
           const agence = await agenceModel.findByIdAndUpdate(req.params.idagence,{$pull:{conseillers:req.params.idconseiller}});
           if(agence){
               return res.status(200).json({message:"conseiller deleted"});
           }
           else {
            return res.status(404).json({message:"agence not found "});
           }
       }
       else { 
        return res.status(404).json({message:"conseiller not found "});
       }
          
    })
    .catch(err=>{
        console.log(err);
        return res.status(500).json(err);
    })
    
}

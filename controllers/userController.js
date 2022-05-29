const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const userModel = require('../models/user');
const agenceModel=require('../models/agence')

exports.getAllUsers = async (req,res) =>{
    try {
        const users = await userModel.find({$or :[{role:'conseiller'},{role:'client'}]});
        users &&  users.length > 0 && res.status(200).json(users);
        users &&  users.length == 0 && res.status(404).json({message:"users not found"});
    }

    catch(err){
        return res.status(500).json(err);
    }
}
exports.getAllConseillers = async  (req,res) => {
    try { 
       const conseillers = await userModel.find({role:'conseiller'}).populate('calendar');
       conseillers &&  conseillers.length > 0 && res.status(200).json(conseillers);
       conseillers &&  conseillers.length == 0 && res.status(404).json({message:"conseillers not found"});
    }
    catch (err){
        return res.status(500).json(err);
    
    }
}
exports.getAllClients =async  (req,res) => {
    try { 
        const clients = await userModel.find({role:'client'});
        clients &&  clients.length > 0 && res.status(200).json(clients);
        clients &&  clients.length == 0 && res.status(404).json({message:"clients not found"});
     }
 
 
     catch (err){
         return res.status(500).json(err);
     }
}

exports.signup = async (req,res)=>{
try {
   const user =  await  userModel.findOne({ $and :[{email: req.body.email },{cin:req.body.cin}]})

    if(user) {
        return res.status(401).json({ message: 'email exists try another one' });
    }
    else { 

        bcrypt.hash(req.body.mdp, 10, (err, encrypted) => {

            if (err) {
                return new Error("crypting error");

            }
            if (encrypted) {

                const user = new userModel({
                    _id: new mongoose.Types.ObjectId(),
                    nom: req.body.nom,
                    prenom: req.body.prenom,
                    mdp: encrypted,
                    email: req.body.email,
                    genre:req.body.genre,
                    role: req.body.role,
                    cin:req.body.cin,
                    image:req.file.path,
                    numtel:req.body.numtel
                })
                user.save()
                    .then(user => {
                        if (user) {
                            return res.status(201).json({ message: 'User created', user });
                        }
                        else 
                        {
                            return res.status(400).json({ message: 'something went wrong'});
                        }
                    })
                    .catch(err => {
                        return res.status(500).json(err);
                    })
    }
})}
}

catch(err) { 
    return res.status(500).json(err);
}

}



exports.login =async  (req,res)=>{
try {
const user = await userModel.findOne({$or:[{email: req.body.email},{cin:req.body.cin}]});
if (user) { 
    bcrypt.compare(req.body.mdp, user.mdp, (err, same) => {
        if (err) {
            return new Error("comparing failed");
        }
        if (same) {
            if(user.role=="conseiller"&&user.validated==false){
                return res.status(401).json({ message: 'conseiller not validated' });
            }
            else {
                let nom=user.nom
                let role=user.role;
                const token = jwt.sign({user_id: user._id, role:user.role,nom:user.nom}, "Secret", { expiresIn: 60 * 60 * 60 })
               return res.status(200).json({ message: 'login successfully', token,nom,role});    
            }
        } 
        else
        {
            return res.status(401).json({ message: 'mot de passe incorrect' });
        }

    })
}

}

catch( err ) { 
}
}


exports.updateConseilleragence=(req,res)=>{
    userModel.findOneAndUpdate({_id:req.params.id},{r$set:{agence:req.body.newagence}}).exec()
   .then(async  conseiller=>{
       if(conseiller)
                 {
                     await agenceModel.findByIdAndUpdate(req.body.oldagence,{$pull:{conseillers:conseiller._id}});   
                     await agenceModel.findByIdAndUpdate(req.body.newagence,{$push:{conseillers:conseiller._id}});   
                     return res.status(200).json(conseiller);
                 }
  }).catch(err=>{
      console.log(err)
     return res.status(500).json(err);
 
  })
 }
                  

exports.updateConseiller = (req,res)=>{

    userModel.findOne({$and:[{_id:req.params.id},{role:"conseiller"}]})
    .exec()
    .then(async user => {
        if (user) {
            if(req.body.mdp){

             const  encrypted = await  bcrypt.hash(req.body.mdp, 10);
             user.mdp=encrypted;

        }
        Object.keys(req.body).forEach(element=>{
            if(element.toString() !== "mdp"){
                user[element]=req.body[element]
            }
        })
        
        user.save().then(result=>{
            if(result){
                return res.status(200).json({message:'update done ',user})
               }
               else {
                   return res.status(400).json({message:'update failed'});
               }
        }).catch(err=>{
            return res.status(500).json(err);
        })
    }
    else {
        return res.status(404).json({message:'conseiller not found'});

    }
})    

    
    .catch(err => {
        return res.status(500).json(err)
    })
}


exports.updateClient = (req,res)=>{

    userModel.findOne({$and:[{_id:req.params.id},{role:"client"}]})
    .exec()
    .then(async user => {
        if (user) {
            if(req.body.mdp){

             const  encrypted = await  bcrypt.hash(req.body.mdp, 10);
             user.mdp=encrypted;

        }
        Object.keys(req.body).forEach(element=>{
            if(element.toString() !== "mdp"){
                user[element]=req.body[element]
            }
        })
        
        user.save().then(result=>{
            if(result){
                return res.status(200).json({message:'update done ',user})
               }
               else {
                   return res.status(400).json({message:'update failed'});
               }
        }).catch(err=>{
            return res.status(500).json(err);
        })
    }
    else {
        return res.status(404).json({message:'conseiller not found'});

    }
})    

    
    .catch(err => {
        return res.status(500).json(err)
    })
}




exports.deleteClient = (req,res)=>{

    userModel.findOneAndDelete({$and:[{_id:req.params.id},{role:"client"}]})
    .exec()
    .then(result => {
        if (result) {
            return res.status(200).json({ message: 'client deleted' });
        } else {
            return res.status(401).json({ message: 'client delete failed' });
        }
    })
    .catch(err => {
        return res.status(500).json(err);
    })

}

exports.deleteConseiller = (req,res)=>{
    userModel.findOneAndDelete({$and:[{_id:req.params.id},{role:"conseiller"}]})
    .exec()
    .then(result => {
        if (result) {
            return res.status(200).json({ message: 'conseiller deleted' });
        } else {
            return res.status(401).json({ message: 'conseiller delete failed' });
        }
    })
    .catch(err => {
        return res.status(500).json(err);
    })
}
exports.validateConseiller = (req,res)=>{
    userModel.findByIdAndUpdate(req.params.idconseiller,{$set:{validated:true}})
    .exec()
    .then(result => {
        if (result) {
            return res.status(200).json({ message: 'conseiller validated' });
        } else {
            return res.status(401).json({ message: 'conseiller validation failed' });
        }
    })
    .catch(err => {
        return res.status(500).json(err);
    })
}


exports.getUser =(req,res)=>{
userModel.findById(req.params.id)
.populate('calendar')
.then(user=>{
     if(user){
   user.image="http://localhost:3000/" + user.image.split("\\")[0]+ "/"+ user.image.split("\\")[1] ;
        res.status(201).json(user)
     }else{
         res.status(401).json({message:'there is no user with this id '})
     }
}
)
.catch(err=>{
    res.send(err)
})

}

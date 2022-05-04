const mongoose = require("mongoose");

const userModel = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    mdp: { type: String, required: true },
    genre: { type:String,required:true},
    numtel: {type:String,required:true},
    cin : { type:String,required:true},
    role: {
        type: String,
        enum: ['client', 'conseiller']
    },
    email: { type: String, required: true },
});


module.exports = mongoose.model('user', userModel);

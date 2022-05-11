const mongoose = require("mongoose");
const userModel = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    mdp: { type: String, required: true },
    genre: {
        type: String,
        enum: ['male', 'female']
    },
    numtel: {type:String,required:true},
    cin : { type:String,required:true},
    role: {
        type: String,
        enum: ['client', 'conseiller','admin']
    },
    email: { type: String, required: true },
    agence: {type:mongoose.Schema.Types.ObjectId,ref:'agences'},
    calendar: {type:mongoose.Schema.Types.ObjectId,ref:'calendars'},
    image: { type: String, required: true }
});


module.exports = mongoose.model('users', userModel);

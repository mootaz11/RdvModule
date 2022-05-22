const feedbackModel = require("../models/feedback");
const mongoose = require("mongoose");


exports.getfeedbacks = async  (req,res)=>{
    try {
        let feedbacks = await feedbackModel.find().populate({path:'rdv',populate:'participants'})
        feedbacks = feedbacks.map(feedback => {
            feedback.rdv.participants = feedback.rdv.participants.filter(participant => participant.role != "conseiller");
            return feedback});
        feedbacks && res.status(200).json(feedbacks);
        !feedbacks && res.status(404).json({message:"feedback not found"});

    }
    catch(err){
        return res.status(500).json(err);

    }
}

exports.createfeedback = (req,res)=>{
    try {

            const feedback = new feedbackModel({
                _id: new mongoose.Types.ObjectId(),
                feedback:req.body.feedback,
                rdv:req.body.rdv
            })
            feedback.save().then(feedback_created=>{
                if(feedback_created){
                    return res.status(201).json({ message: 'feedback created', feedback_created });
                }
                else 
                {
                    return res.status(400).json({ message: 'something went wrong' });
                }
    
            }).catch(err=>{
                console.log(err);
                return res.status(500).json(err);

            })
    }
    catch(err){
        console.log(err);
        return res.status(500).json(err);

    }
}

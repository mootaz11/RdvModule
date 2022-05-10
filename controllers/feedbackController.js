const feedbackModel = require("../models/feedback");


exports.getfeedbacks = async  (req,res)=>{
    try {
        const feedbacks = await feedbackModel.find();
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
                return res.status(500).json(err);

            })
    }
    catch(err){
        return res.status(500).json(err);

    }
}
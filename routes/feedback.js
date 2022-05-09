const router = require("express").Router()
const authentication = require("../middlewares/authentication");
const feedbackController = require("../controllers/feedbackController");



router.get("/",authentication,feedbackController.getfeedbacks);
router.post("/",authentication,feedbackController.createfeedback);



module.exports = router;    

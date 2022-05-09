const router = require("express").Router()
const authentication = require("../middlewares/authentication");
const notificationController = require("../controllers/notificationController");



router.get("/:id",authentication,notificationController.getnotifications);



module.exports = router;    

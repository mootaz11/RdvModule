const router = require("express").Router()
const authentication = require("../middlewares/authentication");
const userController = require("../controllers/userController");
const multer_image=require('../config/multer_image');
const { route } = require("./rdv");

router.get("/client",userController.getAllClients);
router.get("/conseiller",userController.getAllConseillers);
router.get("/",userController.getAllUsers);
router.post("/signup",multer_image.single('image'), userController.signup);
router.post("/login", userController.login);


router.patch("/conseiller/:id",authentication,userController.updateConseiller);
router.patch("/client/:id",authentication,userController.updateClient);

router.delete("/client/:id",authentication,userController.deleteClient);
router.delete("/conseiller/:id",authentication,userController.deleteConseiller);
router.get("/:id",userController.getUser)
router.patch("conseiller/validate/:id",authentication,userController.validateConseiller);
router.patch("/conseiller/updateagence/:id",authentication,userController.updateConseilleragence)
module.exports = router;    

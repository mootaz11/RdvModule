const router = require("express").Router()
const authentication = require("../middlewares/authentication");
const userController = require("../controllers/userController");
const multer_image=require('../config/multer_image')

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
module.exports = router;    

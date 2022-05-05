const router = require("express").Router()
const authentication = require("../middlewares/authentication");
const userController = require("../controllers/userController");

router.get("/client",userController.getAllClients);
router.get("/conseiller",userController.getAllConseillers);
router.post("/signup/", userController.signup);
router.post("/login/", userController.login);


router.patch("/conseiller/:id",authentication,userController.updateConseiller);
router.patch("/client/:id",authentication,userController.updateClient);

router.delete("/client/:id",authentication,userController.deleteClient);
router.delete("/conseiller/:id",authentication,userController.deleteConseiller);



module.exports = router;    

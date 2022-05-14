const router = require("express").Router()
const authentication = require("../middlewares/authentication");
const agenceController = require("../controllers/agenceController");
const multer_image=require('../config/multer_image')


router.get("/",agenceController.getAgences);
router.get("/:id",authentication,agenceController.getAgence);
router.post("/",authentication,multer_image.single('image'), agenceController.createAgence);
router.patch("/:id",authentication,agenceController.updateAgence);
router.delete("/:id",authentication,agenceController.deleteAgence);
router.post("/conseiller/:idagence/:idconseiller",agenceController.addConseiller);
module.exports = router;    

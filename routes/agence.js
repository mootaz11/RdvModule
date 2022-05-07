const router = require("express").Router()
const authentication = require("../middlewares/authentication");
const agenceController = require("../controllers/agenceController");


router.get("/",authentication,agenceController.getAgences);
router.get("/:id",authentication,agenceController.getAgence);
router.post("/",authentication, agenceController.createAgence);
router.patch("/:id",authentication,agenceController.updateAgence);
router.delete("/:id",authentication,agenceController.deleteAgence);
router.post("/conseiller/:idagence/:idconseiller",authentication,agenceController.addConseiller);
module.exports = router;    

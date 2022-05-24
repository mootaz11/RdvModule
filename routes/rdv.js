const router = require("express").Router()
const authentication = require("../middlewares/authentication");
const rdvController = require("../controllers/rdvController");


router.get('/',authentication,rdvController.getRdvs);
router.get("/:id",authentication,rdvController.getRdv);
 router.get("/conseiller/:idconseiller",authentication,rdvController.getRdvsByConseiller);
router.post("/:idconseiller",authentication, rdvController.createRdv);
router.patch("/:id/:idconseiller",authentication,rdvController.updateRdv);
router.delete("/:id/:idconseiller",authentication,rdvController.deleteRdv);
router.post("/confirm/:id/:idclient",authentication,rdvController.confirmRdv);

module.exports = router;    

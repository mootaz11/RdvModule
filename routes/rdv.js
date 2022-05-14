const router = require("express").Router()
const authentication = require("../middlewares/authentication");
const rdvController = require("../controllers/rdvController");



router.get("/:id",authentication,rdvController.getRdv);
 router.get("/conseiller/:idconseiller",authentication,rdvController.getRdvsByConseiller);
router.post("/",authentication, rdvController.createRdv);
router.patch("/:id",authentication,rdvController.updateRdv);
router.delete("/:id",authentication,rdvController.deleteRdv);
router.post("/confirm/:id/:idclient",authentication,rdvController.confirmRdv);

module.exports = router;    

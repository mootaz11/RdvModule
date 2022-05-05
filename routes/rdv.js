const router = require("express").Router()
const authentication = require("../middlewares/authentication");
const rdvController = require("../controllers/rdvController");



router.get("/",authentication,rdvController.getAllrdv);
router.get("/:id",authentication,rdvController.getRdv);
router.post("/",authentication, rdvController.createRdv);
router.patch("/:id",authentication,rdvController.updateRdv);
router.delete("/:id",authentication,rdvController.deleteRdv);


module.exports = router;    

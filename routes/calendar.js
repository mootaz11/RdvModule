const router = require("express").Router()
const authentication = require("../middlewares/authentication");
const calendarController = require("../controllers/calendarContoller");



router.get("/:id",authentication,calendarController.getCalendar);
router.post("/:idconseiller", calendarController.creatCalendar);
router.patch("/:id",authentication,calendarController.updateCalendar);
router.delete("/:id",authentication,calendarController.deleteCalendar);

module.exports = router;    

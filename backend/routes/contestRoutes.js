const express = require("express");
const router = express.Router();
const contestController = require("../controllers/contestController");

router.post("/create", contestController.createContest);
router.get("/", contestController.getAllContests);
router.get("/:id", contestController.getContestById);
router.put("/:id", contestController.updateContest);      
router.delete("/:id", contestController.deleteContest);

module.exports = router;

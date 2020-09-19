const express = require("express");
const router = express.Router();
const db = require("../notes/queries.js");
const logger = require("../middleware/logger.js");

router.get("/allowed", (req, res) => {
  console.log(logger.getIP(req));
  if (
    logger.getIP(req) === "38.142.236.234" ||
    logger.getIP(req) === "192.168.4.41" ||
    logger.getIP(req) === "1"
  ) {
    res.status(200).send(true);
  } else {
    res.status(403).send(false);
  }
});
router.get("/", db.getNotes);
router.get("/:id", db.getNoteById);
router.post("/", db.createNote);
router.put("/:id", db.updateNote);
router.delete("/:id", db.deleteNote);

module.exports = router;

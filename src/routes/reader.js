const express = require("express");
const readerController = require("../controllers/reader");
const router = express.Router();

router.post("/", readerController.createReader);
router.get("/", readerController.findAllReader);
router.get("/:id", readerController.findByPk);

module.exports = router;

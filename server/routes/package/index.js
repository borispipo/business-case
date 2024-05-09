const express = require('express');
const router = express.Router();
const Model = require("../../models/Package");
const requestHandler = require("../requestHandler");

router.get('/', requestHandler.get(Model));
router.get("/:id",requestHandler.getOne(Model));
router.post("/:id",requestHandler.post(Model));
router.put("/:id",requestHandler.put(Model));
router.delete("/:id",requestHandler.delete(Model));

module.exports = router;
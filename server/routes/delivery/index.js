const express = require('express');
const router = express.Router();
const Model = require("../../models/Delivery");
const requestHandler = require("../requestHandler");

router.get('/', requestHandler.get(Model));
router.get("/:id",requestHandler.getOne(Model));
router.post("/:id",requestHandler.post(Model,{beforeInsert:(data)=>{
    if(!data.package_id){
        throw {message : `Unable to save delivery because package id is unspecified`,data}
    }
}}));
router.put("/:id",requestHandler.put(Model));
router.delete("/:id",requestHandler.delete(Model));

module.exports = router;
const express = require('express');
const router = express.Router();
const Model = require("../../models/Package");
const DeliveryModel = require("../../models/Delivery");
const requestHandler = require("../requestHandler");

router.get('/', requestHandler.get(Model));
router.get("/:id",requestHandler.getOne(Model));
router.post("/:id",requestHandler.post(Model));
router.put("/:id",requestHandler.put(Model));
router.delete("/:id",requestHandler.delete(Model,{
    beforeDelete : async (req,res)=>{
        const package_id = req.params.id;
        /****
            remove all deliveries on package id
        */
        if(package_id){
            await DeliveryModel.deleteMany({ package_id});//.exec();
        }
    }
}));

module.exports = router;
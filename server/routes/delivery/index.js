const express = require('express');
const router = express.Router();
const Model = require("../../models/Delivery");
const requestHandler = require("../requestHandler");
const PackageModel = require("../../models/Package");

router.get('/', requestHandler.get(Model));
router.get("/:id",requestHandler.getOne(Model));
router.post("/:id",requestHandler.post(Model,{
    beforeInsert:(data)=>{
        if(!data.package_id){
          throw {message : `Unable to save delivery because package id is unspecified`,data}
        }
    },
    afterInsert : async (data,req,res) =>{
        //if delivery was defined as active delivery, so we set this delivery as active on associated package
        if(req?.body?.isActive){
            await PackageModel.upsert(data.package_id,{active_delivery_id:data.delivery_id});
        }
    }
}));
router.put("/:id",requestHandler.put(Model));
router.delete("/:id",requestHandler.delete(Model,{
    afterDelete : async (data,req,res)=>{
        const deletedDeliveryId = req.params.id;
        //after delete, we need to reset pacakge where the deleted delivery is active to null
        if(deletedDeliveryId){
            await PackageModel.upsert({ active_delivery_id:deletedDeliveryId},{active_delivery_id:null});
        }
    }
}));

module.exports = router;
const express = require('express');
const router = express.Router();
const Model = require("../../models/Delivery");
const requestHandler = require("../requestHandler");
const PackageModel = require("../../models/Package");
const socket = require("../../socket");
const events = require("../../socket/events");
/***
    compare two locations fields, by their properties lat and lng
*/
const compareLocations = (l1,l2)=>{
    if(l1 === l2) return true;
    if(l1 && !l2 || l2 && !l1) return false;
    if(typeof l1 !=="object" || typeof l1 !== "object") return false;
    const fields = ["lat","lng"];
    for(let i in fields){
        if(l1[fields[i]] !== l2[fields[i]]) return false;
    }
    return true;
}
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
router.put("/:id",async (req,res)=>{
    const delivery_id = req.params.id;
    const data = Object.assign({},req.body);
    const locationHasChanged = ("location"  in data );//Location changed
    const statusChanged = ("status" in data); //status changed
    try {
        const toUpdate = await Model.getOne(delivery_id);
        const r = await requestHandler.put(Model)(req,res);
        if(statusChanged || locationHasChanged && toUpdate){
            setTimeout(async ()=>{
                //check if location_changed 
                if(locationHasChanged && !compareLocations(data.location,toUpdate.location)){
                    //location changes, emit events on location changed
                    socket.emit(events.location_changed,JSON.stringify({event:events.location_changed,delivery_id, location:data.location}));
                }
                    if(statusChanged && String(data.status).toLowerCase() !== String(toUpdate.status).toLowerCase()){
                    //status changed 
                    socket.emit(events.status_changed,JSON.stringify({event:events.status_changed,delivery_id, status:data.status}));
                }
            },500);//non blocking instruction
        }
        return r;
    } catch(e){
        requestHandler.handleError(e,res);
    }
});
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
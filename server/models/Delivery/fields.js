const ObjectId = require("mongoose").Types.ObjectId;
module.exports = {
    delivery_id : {
        type: ObjectId,
        unique: true,
        required: true,
        index: true,
        auto: true,
    },
    package_id : {
        type: ObjectId,
        ref: 'Package',
        required: true
    },
    pickup_time : {type : Date},
    start_time  : {type : Date},
    end_time : {type : Date},
    address : {type : String},//delivery address from wich to extract location
    location : {
        lat : { type : Number},
        lng : { type : Number},
    },
    status :  {
        type: String,
        enum : ['open','picked-up','in-transit','delivered','failed'],
        default: 'open'
    },
};
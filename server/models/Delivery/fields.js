const ObjectId = require("mongoose").Types.ObjectId;
module.exports = {
    delivery_id : {
        type: ObjectId,
        unique: true,
        required: true,
        index: true,
        auto: true,
    },
    pickup_time : {type : Date},
    start_time  : {type : Date},
    end_time : {type : Date,},
    location : {
        lat : { type : String},
        lng : { type : String},
    },
    status :  {
        type: String,
        enum : ['open','picked-up','in-transit','delivered','failed'],
        default: 'open'
    },
};
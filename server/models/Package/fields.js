const ObjectId = require("mongoose").Types.ObjectId;
module.exports = {
    _id: false,
    package_id : {
        type: ObjectId,
        unique: true,
        required: true,
        index: true,
        auto: true,
    },
    active_delivery_id : {type: ObjectId},
    description: { type: String},
    weight : { type: Number,unit : "cm"},
    height : { type: Number, unit : "cm"},
    depth : { type: Number, unit : "cm"},
    from_name : {type : String},
    from_address : {type : String},
    from_location : {
        lat : { type : String},
        lng : { type : String},
    },
    to_name : { type : String},
    to_address : {type : String},
    to_location : {
        lat : { type : String},
        lng : { type : String},
    }
};
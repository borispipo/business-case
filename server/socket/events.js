module.exports = {
    /***
        incomming : {event, delivery_id, location} Update the location of a delivery
    */
    location_changed : "location_changed",

    
    /***
        incomming : {event, delivery_id, status} Update the status of a delivery
        When the status changes from open to picked-up, set 
        the pickup_time to current time
        When the status changes from picked-up to in-transit, 
        set the start_time to current time
        When the status changes from in-transit to delivered 
        or failed, set the end_time to current time
    */
    status_changed : "status_changed",
    
    /***
        broadcast {event, delivery_object} Broadcast when a delivery is updated
    */
    delivery_updated : "delivery_updated",
}
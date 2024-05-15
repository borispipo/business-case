import Location from "./Location"

export type Status = 'open' | 'picked-up' | 'in-transit' | 'delivered' | 'failed';

export default interface Delivery {
    delivery_id : string;
    package_id : string;
    pickup_time : Date;
    start_time  : Date;
    end_time : Date;
    location : Location;
    address : string,
    status : Status;
}
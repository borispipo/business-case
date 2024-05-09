import Location from "./Location"
export default interface Package {
    package_id  : string,
    active_delivery_id : string,
    description?: string,
    weight : number,
    height : number,
    depth : number,
    from_name : string,
    from_address : string,
    from_location : Location,
    to_name : string,
    to_address : string,
    to_location : Location
}
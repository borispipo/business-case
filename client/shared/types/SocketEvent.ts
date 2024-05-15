export default interface SocketEvent {
    event : string;
    callback : (data:any)=>void;
}
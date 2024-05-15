const events  = require("events");
const eventEmitter = new events.EventEmitter();

const SOCKET_EVENT = "SOCKET_EVENT"; //sockett event prefix

module.exports = eventEmitter;

/***
    emit socket events
    @param {string} event, event name
    @param {object} data, data 
*/
module.exports.emitSocket = (event,data)=>{
    data = Object.assign({},data);
    data.event = event;
    return eventEmitter.emit(`${SOCKET_EVENT}`,data);
}
module.exports.SOCKET_EVENT = SOCKET_EVENT; ///all socket events
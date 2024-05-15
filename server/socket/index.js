const { Server } = require("socket.io");
const PINGINTERVAL = 5000;
const PINGTIMEOUT = 7100;
const events = require("./events");
const Delivery = require("../models/Delivery");

const clients = {};
/***
    retrieve socket request header params
*/
const getQueryParams = (socket)=>{
    return Object.assign({},socket?.handshake?.query);
}
const upsertDelivery = async (id,data)=>{
    try {
        await Delivery.upsert(id,data);
    } catch(e){
        console.log(e," upserrting delivering")
    }
}
const ioInstance = {current : null};
module.exports = {
    get init(){
        return function(server){
            const io =  new Server(server, {
              withCredentials: true,
              pingInterval: PINGINTERVAL,
              pingTimeout: PINGTIMEOUT,
              maxHttpBufferSize: 1e8,
              cors: {
                origin: "*",
              },
            });
            //on socket io connection opened
            io.on("connection", (socket) => {
                const params = getQueryParams(socket);
                const clientId = params.clientId;
                if(!clientId){
                    socket.emit("INVALID_CONNECTION",JSON.stringify(params));
                    socket.disconnect();
                    return;
                }
                clients [clientId] = socket;
                console.log(`socket client with id ${clientId} is connected`);
                socket.on(events.delivery_updated,(data)=>{
                    data = Object.assign({},JSON.parse(data));
                });
                socket.on(events.location_changed,(data)=>{
                    data = Object.assign({},JSON.parse(data));
                    if(data.delivery_id){
                        upsertDelivery(data.delivery_id,data);
                    }
                });
                socket.on(events.status_changed, (data)=>{
                    data = Object.assign({},JSON.parse(data));
                    if(data.delivery_id){
                        upsertDelivery(data.delivery_id,data);
                    }
                });
                socket.on('disconnect', (...rest) => {
                    console.log('socket client disconnected with id '+clientId+" is disconnected");
                    delete clients[clientId];
                });
            });
            ioInstance.current = io;
            return io;
        }
    },
    get io (){
        return ioInstance.current;       
    }
    
}

module.exports.clients = clients;

module.exports.emit = (...rest)=>{
    Object.keys(clients).map((clientId)=>{
        const socket = clients[clientId];
        if(! socket || !socket?.emit) {
            console.log(" client id has not valid for client ",clientId);
            return;
        }
        console.log("emitint socket event on client with id ",clientId);
        socket.emit(...rest);
    });
}
module.exports.broadcast = (...rest)=>{
    const io = module.exports.io();
    if(!io || typeof io?.emit !=="function") return;
    return io.emit(...rest);
}
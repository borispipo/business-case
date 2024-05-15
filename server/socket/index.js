const { Server } = require("socket.io");
const PINGINTERVAL = 5000;
const PINGTIMEOUT = 7100;
const events = require("./events");
const eventEmitter = require("../events");

const clients = {};
const getQueryParams = (socket)=>{
    return Object.assign({},socket?.handshake?.query);
}
const getClientId = (socket)=> getQueryParams(socket).clientId;

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
                clients [clientId] = {socket};
                console.log(`socket client with id ${clientId} is connected`);
                //socket.on(types.GET_GURUX_APP_CONNECT, authCtrl.getGuruxAppConnect);
                //socket.on(types.RESTART_APP, updateCtrl.restartApp);
                socket.on('disconnect', (...rest) => {
                    console.log('socket client disconnected',rest);
                    delete clients[clientId];
                });
                socket.on(events.delivery_updated,(...rest)=>{
                    console.log("delivery changeddd ",rest,clients);
                });
                socket.on(events.location_changed,(data,event)=>{
                    console.log("location change for ",data,event);
                });
                socket.on(events.status_changed,(data,event)=>{
                    console.log("delivery status change for ",data,event);
                });
                
            });
            eventEmitter.addListener(eventEmitter.SOCKET_EVENT,function(data){
                    
            });
            ioInstance.current = io;
            
            return io;
        }
    },
    get io (){
        return ioInstance.current;       
    }
    
}

module.exports.clients = {};
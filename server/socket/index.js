const { Server } = require("socket.io");
const PINGINTERVAL = 5000;
const PINGTIMEOUT = 7100;
const events = require("./events");

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
                console.log("a client is connected");
                //socket.on(types.GET_GURUX_APP_CONNECT, authCtrl.getGuruxAppConnect);
                //socket.on(types.RESTART_APP, updateCtrl.restartApp);
                socket.on('disconnect', () => {
                    console.log('user disconnected');
                });
                socket.on(events.location_changed,(data,event)=>{
                    console.log("location change for ",data,event);
                });
                socket.on(events.status_changed,(data,event)=>{
                    console.log("delivery status change for ",data,event);
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
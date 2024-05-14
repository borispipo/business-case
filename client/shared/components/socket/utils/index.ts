const isNonNullString = x=> typeof x =="string" && !!x;
import {io} from "socket.io-client";
import { API_HOST } from "$shared/fetch";
  
const defaultFunc = x=> typeof x =="function"? x : ()=>true;

export function connect(options : any = {}) {
    options = Object.assign({},options);
    let {
      onOpen,
      onClose,
      onSignedOut,
      onDisconnect,
      onError,
      queryParams,
      autoReconnect,
    } = options;
    autoReconnect = autoReconnect !== false ? true : false;
    onOpen = defaultFunc(onOpen);
    onError = defaultFunc(onError);
    onClose = defaultFunc(onClose);
    onSignedOut = defaultFunc(onSignedOut);
    onDisconnect = defaultFunc(onDisconnect);
    
    queryParams = Object.assign({},queryParams);
    queryParams.type  = "client_app";
    const socket = io(`${API_HOST}`, {
      //autoConnect : true,
      query : queryParams,
    });
    socket.on("connect", (...args) => {
      if (onOpen) {
        onOpen(...args);
      }
      const engine = socket.io.engine;
      engine.on("close", (reason) => {
        if (onClose) {
          onClose(reason);
        }
      });
    });
    socket.on("disconnect", () => {
      if (autoReconnect) {
        socket.connect();
      }
      if (typeof onDisconnect === "function") {
        onDisconnect();
      }
      console.log("socket disconnected");
    });
  
    socket.on("DISCONNECT_USER_EXIST", (d) => {
      console.log("on disconnect...............", socket.connected);
      if (socket.connected) {
        onDisconnect();
      }
      onSignedOut(d);
    });
    socket.on("connect_error", (...error) => {
        onError(...error);
    })
    if(autoReconnect){
        setTimeout(() => {
            if (!(socket.connected || !socket.disconnected)) {
              try {
                socket.connect();
              } catch {}
            }
        }, 500);
    }
    return socket;
}

/**** envoie un message via le webSocket
 * @param {Socket}, l'objet socket io
   @param {object} options
 * @return {Promise}
 */
export const sendMessage = (socket,type:string, options:object) : Promise<any> => {
    if (!socket || !socket.send) {
      console.log(socket, " is not defined, could not send message ");
      return Promise.reject({
        socket,
        message: " socket is not defined, could not send message ",
      });
    }
    options = Object.assign({},options);
    if (!options || !isNonNullString(type)) return Promise.reject({ message : "options non valides car le type de message ", options });
    return new Promise((resolve,reject)=>{
        return socket.emit(type, options, resolve);
    })
};
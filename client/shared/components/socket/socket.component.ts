import { Component } from '@angular/core';
import {connect,sendMessage} from "./utils";
import BaseComponent from '../base';
const {delivery_updated,location_changed,status_changed} = require("$socket-events");
@Component({
  selector: 'app-socket',
  standalone: true,
  imports: [],
  templateUrl: './socket.component.html',
  styleUrl: './socket.component.css'
})
export class SocketComponent extends BaseComponent{
  socket = null;
  readonly clientId = this.uniqid("socket-client-id");
  isConnected : boolean = false;
  init(){
    console.log("initiallizing socketttttt");
    this.socket = connect({
      clientId : this.clientId,
      onOpen : ()=>{
        this.isConnected = true;
        this.sendMessage(delivery_updated);
      },
      onClose : ()=>{
        console.log(this.clientId," socket connection closed");
        this.isConnected = false;
      }
    });
  }
  sendMessage(type:string, options = null){
      options = Object.assign({},options);
      options.clientId = this.clientId
      return sendMessage(this.socket,type,options);
  }
  ngAfterViewInit(): void {
    this.init();
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.socket?.disconnect();
  }
}

import { Component } from '@angular/core';
import {connect,sendMessage} from "./utils";
import BaseComponent from '../base';
import { Input } from '@angular/core';
import { SocketEvent } from '$shared/types';
@Component({
  selector: 'app-socket',
  standalone: true,
  imports: [],
  templateUrl: './socket.component.html',
  styleUrl: './socket.component.css'
})
export class SocketComponent extends BaseComponent{
  @Input() events? : SocketEvent [] = [];
  @Input() onOpen? : (context : SocketComponent)=> void;
  @Input() onClose? : (context: SocketComponent) => void;
  socket = null;
  readonly clientId = this.uniqid("socket-client-id");
  isConnected : boolean = false;
  init(){
    this.socket = connect({
      clientId : this.clientId,
      onOpen : ()=>{
        this.isConnected = true;
        if(this.onOpen){
          this.onOpen(this);
        }
        //initialize events
        this.events?.map(({event,callback})=>{
          this.socket.on(event,callback);
        });
      },
      onClose : ()=>{
        if(this.onClose){
          this.onClose(this);
        }
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

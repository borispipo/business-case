import { sendMessage } from './../../../shared/components/socket/utils/index';
import { Component } from '@angular/core';
import { MainComponent } from '$shared/components/main/main.component';
import { CommonModule } from '@angular/common';
import {Package,Delivery} from "$stypes";
import { getPackage,getDelivery} from '$fetch';
import { MatProgressBar } from '@angular/material/progress-bar';
import { PackageDetailsComponent } from '$shared/components/package-details/package-details.component';
import { DeliveryDetailsComponent } from '$shared/components/delivery-details/delivery-details.component';
import { SocketComponent } from '$shared/components/socket/socket.component';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MapComponent } from '$shared/components/map/map.component';
import {Status} from "$stypes/Delivery";
import {location_changed,status_changed} from "$shared/socket/events";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,MainComponent,MapComponent,MatProgressBar,
    PackageDetailsComponent,DeliveryDetailsComponent,SocketComponent,MatInput,MatButton
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent extends MapComponent{
  delivery :Delivery = null;
  package : Package = null;
  deliveryId : string = "";
  socketContext : SocketComponent = null;
  intervalRef  = null;
  
  isLoading : boolean = false;
  onSearchChange(text){
    this.deliveryId = text;
  }
  onConnectionOpen(socketContext:SocketComponent){
    this.socketContext = socketContext;
  }
  onConnectionClose(socketContext:SocketComponent){
    this.socketContext = null;
  }
  updateStatus(newStatus:Status){
    this.delivery.status = newStatus;
    this.sendMessage(status_changed,{event:status_changed,delivery_id:this.deliveryId, status:newStatus});
  }
  sendMessage(event,data){
    if(!this.delivery || !this.socketContext) return;
    this.socketContext.sendMessage(event,data);
  }
  //update driver postion
  updateCurrentPosition(){
    if(!this.deliveryId) return;
    this.getCurrentPosition((position)=>{
      if(!position) return;
      if(this.location && position?.lat == this.location?.lat && position?.lng == this.location?.lng){
        return;
      }
      this.location = position;
      this.sendMessage(location_changed,{event:location_changed,delivery_id:this.deliveryId, location:position});
    });
  }
  fetchDelivery () : void {
    if(this.deliveryId){
      if(!this.isLoading){
        this.isLoading = true;
      }
      getDelivery(this.deliveryId).then((delivery)=>{
        this.delivery = delivery;
        if(delivery){
          this.location = delivery.location;
          return getPackage(delivery.package_id).then((p)=>{
            this.package = p;
          });
        }
      }).finally(()=>{
        this.isLoading = false;
      });
    }
  }
  ngOnInit(): void {
    this.onConnectionOpen = this.onConnectionOpen.bind(this);
    this.onConnectionClose = this.onConnectionClose.bind(this);
    this.fetchDelivery();
    clearInterval(this.intervalRef);
    this.intervalRef = setInterval(()=>{
      this.updateCurrentPosition();
    },20000)//every 20 seconds
  }
}

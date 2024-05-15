import { Component } from '@angular/core';
import BaseComponent from '$shared/components/base';
import { MainComponent } from '$shared/components/main/main.component';
import { CommonModule } from '@angular/common';
import { MapComponent } from '$shared/components/map/map.component';
import {Package,Delivery} from "$stypes";
import { getPackage,getDelivery} from '$fetch';
import { MatProgressBar } from '@angular/material/progress-bar';
import { PackageDetailsComponent } from '$shared/components/package-details/package-details.component';
import { DeliveryDetailsComponent } from '$shared/components/delivery-details/delivery-details.component';
import { SocketComponent } from '$shared/components/socket/socket.component';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,MainComponent,MapComponent,MatProgressBar,
    PackageDetailsComponent,DeliveryDetailsComponent,SocketComponent,MatInput,MatButton
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent extends BaseComponent{
  delivery :Delivery = null;
  package : Package = null;
  deliveryId : string = "";
  
  isLoading : boolean = false;
  onSearchChange(text){
    this.deliveryId = text;
  }
  fetchDelivery () : void {
    if(this.deliveryId){
      if(!this.isLoading){
        this.isLoading = true;
      }
      getDelivery(this.delivery).then((delivery)=>{
        this.delivery = delivery;
        if(delivery){
          return getPackage(delivery.package_id).then((p)=>{
            this.package = p;
          });
        }
      }).finally(()=>{
        this.isLoading = false;
        console.log("update loadddingggg ");
      });
    }
  }
  ngOnInit(): void {
    this.fetchDelivery();
  }
}

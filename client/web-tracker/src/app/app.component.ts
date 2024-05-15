import { Component } from '@angular/core';
import { MainComponent } from '$scomponents/main/main.component';
import Delivery from '$stypes/Delivery';
import Package from "$stypes/Package";
import { getPackage,getDelivery} from '$fetch';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';  
import { ListDetailsComponent } from '$shared/components/list-detail/details.component';
import { MapComponent } from '$shared/components/map/map.component';
import BaseComponent from "$shared/components/base";
import { SocketComponent } from '$shared/components/socket/socket.component';
import {location_changed,status_changed,delivery_updated} from "$shared/socket/events";
import { parseJSON } from '$shared/components/socket/utils';
import { SocketEvent } from '$shared/types';
import { PackageDetailsComponent } from '$shared/components/package-details/package-details.component';
import { DeliveryDetailsComponent } from '$shared/components/delivery-details/delivery-details.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,MainComponent,MatButtonModule,MatInputModule,MatProgressSpinnerModule,MatProgressBarModule
    ,MatDividerModule,MatListModule,ListDetailsComponent,MapComponent,SocketComponent,PackageDetailsComponent,DeliveryDetailsComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent extends BaseComponent{
  delivery : Delivery;
  package : Package;
  packageId : string;
  trackPackageError : string;
  isLoading : boolean;
  readonly socketEvents : SocketEvent [] = [  
    {
      event : delivery_updated, 
      callback : function(data){
        data = parseJSON(data);
        this.delivery = data;
      }.bind(this)
    },
    {
      event : location_changed,
      callback : function(data){
        data = parseJSON(data);
        if(data.location && data.delivery_id && data.delivery_id == this.delivery?.delivery_id){
          this.delivery.location = data.location;
        }
      }.bind(this)
    },
    {
      event : status_changed,
      callback : function(data){
        data = parseJSON(data);
        if(data.status && data.delivery_id && data.delivery_id == this.delivery?.delivery_id){
          this.delivery.status = data.status;
        }
      }.bind(this),
    }
  ];
  ngOnInit(): void {
    this.packageId = "";
    this.isLoading = false;
  }
  onSearchChange(text){
    this.packageId = text;
  }
  trackPackage(){
    if(this.packageId){
      this.isLoading = true;
      getPackage(this.packageId,null).then((p)=>{
          this.package = p ? Object.assign({},p as Package) : null;
          if(this.package.from_location){
            this.package.from_location.title = this.package.from_location.name = this.package.from_address;
          }
          if(this.package.to_location){
            this.package.to_location.title = this.package.to_location.name  = this.package.to_address;
          }
          this.trackPackageError  = this.package ? null : `Package with Id : [${this.packageId}] doesn't exist in database.`;
          if(!this.trackPackageError && p?.active_delivery_id){
            getDelivery(p.active_delivery_id).then((delivery)=>{
              this.delivery = delivery;
              if(this.delivery.location){
                this.delivery.location.title = this.delivery.location.name = this.delivery.address;
              }
            });
          }
      }).catch((e)=>{
         this.trackPackageError = e?.message || e?.toString();
      }).finally(()=>{
        this.isLoading = false;
      });
    }
  }
}

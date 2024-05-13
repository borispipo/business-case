import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MainComponent } from '$shared/components/main/main.component';
import BaseComponent from "$shared/components/base";
import {MatButtonModule} from '@angular/material/button';
import {Package,Delivery} from "$stypes";
import { getPackages,getDeliveries,deleteDelivery,deletePackage} from '$shared/fetch';
import {MatTableModule} from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { PackageComponent } from './package/package.component';
import { DeliveryComponent } from './delivery/delivery.component';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,CommonModule,MainComponent,MatButtonModule,MatTableModule,MatProgressSpinnerModule,MatIconModule,
    MatProgressBarModule,RouterLink
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent extends BaseComponent {
  packages : Array<Package> = [];
  deliveries  : Array<Delivery> = [];
  isLoading : boolean = true;
  readonly packageColumns: string[] = ["package_id","active_delivery_id","description","weight","height","depth","from_name","from_address","to_name","to_address","actions"];
  readonly deliveryColumns: string[] = ["delivery_id","address","package_id","pickup_time","start_time","end_time","status","actions"];
  fetchPackages(updateLoading : boolean = true) : Promise<Array<Package>>{
    if(updateLoading && !this.isLoading){
      this.isLoading = true;
    }
    return getPackages(null).then(packages=>{
      this.packages = packages;
      return packages;
    }).finally(()=>{
       if(updateLoading && this.isLoading){
          this.isLoading = false;
       }
    });
  }
  fetchDeliveries(updateLoading : boolean = true) : Promise<Array<Delivery>>{
    if(updateLoading && !this.isLoading){
      this.isLoading = true;
    }
    return getDeliveries(null).then(deliveries=>{
      this.deliveries = deliveries;
      return deliveries;
    }).finally(()=>{
        if(updateLoading && this.isLoading){
           this.isLoading = false;
        }
    });
  }
  ngOnInit(): void {
    this.isLoading = true;
    Promise.all([this.fetchPackages(false),this.fetchDeliveries(false)]).finally(()=>{
      this.isLoading = false;
    });
  }
  upsertPackage(id:string = undefined) : void {
    const dialog = this.openDialog<PackageComponent>(PackageComponent);
    dialog.componentInstance.id = id;
    dialog.componentInstance.onUpsert = (data)=>{
      this.fetchPackages(true);
      dialog.close();
    };
  }
  upsertDelivery(id:string = undefined) : void {
    const dialog = this.openDialog<DeliveryComponent>(DeliveryComponent);
    dialog.componentInstance.id = id;
    dialog.componentInstance.onUpsert = (data)=>{
      this.fetchDeliveries(true);
      dialog.close();
    };
  }
  removeDelivery(id:string){
    return this.remove(id,true);
  }
  removePackage (id : string){
    return this.remove(id,false);
  }
  private remove (id : string,isDelivery:boolean){
    const prefix = isDelivery ? "Delivery"  : "Package";
    this.openConfirm({
      message : `Do you realy want to remove ${prefix} with Id [${id}] ${!isDelivery && `
        All deliveries associated with this package will be also removed from database?
      ` ||''} ?`,
      title : `Remove ${prefix} [${id}]`,
      onSuccess : ()=>{
        this.isLoading = true;
        return Promise.resolve(isDelivery ? deleteDelivery(id) : deletePackage(id)).then((d)=>{
          if(isDelivery){
            this.fetchDeliveries();
          } else {
            this.fetchPackages();
          }
        }).finally(()=>{
          this.isLoading = false;
        });
      },
    });
  }
}

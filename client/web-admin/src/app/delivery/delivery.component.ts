import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Package2DeliveryComponent } from '../package2Delivery';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { Delivery,Package } from '$shared/types';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { getPackages } from '$shared/fetch';
import { toMySQLDate,toLocaleDateString } from '$shared/utils';

import {
  FormControl,
  Validators,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [CommonModule,MatDialogModule,MatButtonModule,MatSelectModule,
    MatInputModule,MatFormFieldModule,MatSelectModule,Package2DeliveryComponent, ReactiveFormsModule,MatProgressSpinner
  ],
  templateUrl: './delivery.component.html',
  styleUrl: './delivery.component.css'
})
export class DeliveryComponent extends Package2DeliveryComponent{
  delivery : Delivery = null;
  packages : Array<Package> = [];
  readonly statutes : string [] = ['open','picked-up','in-transit','delivered','failed'];
  fetchPackages(){
    getPackages().then((packages)=>{
      this.packages = packages;
    });
  }
  override beforeUpsert(data){
      [ "pickup_time","start_time","end_time"].map(d=>{
        if(data[d]){
          data[d] = toMySQLDate(data[d]);
        }
      });
      return data;
  }
  ngOnInit(): void {
      super.ngOnInit();
      this.initFormGroup();
      this.fetchPackages();
  }
  protected isDelivery(): boolean {
    return true;
  }
  protected override setData(data : Delivery){
    this.delivery = data;
    this.initFormGroup();
  }
  initFormGroup(){
    this.formGroup = new FormGroup({
      package_id : new FormControl(this.delivery?.package_id || '', [Validators.required]),
      pickup_time : new FormControl(toLocaleDateString(this.delivery?.pickup_time), [Validators.required]),
      start_time : new FormControl(toLocaleDateString(this.delivery?.start_time), [Validators.required]),
      status : new FormControl(this.delivery?.status || 'open', [Validators.required]),
      end_time : new FormControl(toLocaleDateString(this?.delivery?.end_time),[])
    })
  }
}


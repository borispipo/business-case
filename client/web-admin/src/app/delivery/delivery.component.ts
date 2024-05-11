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
      pickup_time : new FormControl(toDateString(this.delivery?.pickup_time), [Validators.required]),
      start_time : new FormControl(toDateString(this.delivery?.start_time), [Validators.required]),
      status : new FormControl(this.delivery?.status || 'open', [Validators.required]),
      end_time : new FormControl(toDateString(this?.delivery?.end_time),[])
    })
  }
}


const toMysqlFormat = function(date) {
  if(!date) return undefined;
  date = new Date(date);
  return date.getUTCFullYear() + "-" + twoDigits(1 + date.getUTCMonth()) + "-" + twoDigits(date.getUTCDate()) + " " + twoDigits(date.getUTCHours()) + ":" + twoDigits(date.getUTCMinutes()) + ":" + twoDigits(date.getUTCSeconds());
};

const toDateString = (date)=>{
  if(!date) return undefined;
  date = new Date(date).toISOString();
  return date.substring(0, date.length - 1)
}

/**
 * You first need to create a formatting function to pad numbers to two digits…
 **/
function twoDigits(d) {
  if(0 <= d && d < 10) return "0" + d.toString();
  if(-10 < d && d < 0) return "-0" + (-1*d).toString();
  return d.toString();
}
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
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { debounceTime } from "rxjs/operators";
import {Location,PlaceChangeResult} from "$stypes";
import { MapLocationComponent } from '$shared/components/map/location/location.component';

import {
  FormControl,
  Validators,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [CommonModule,MatDialogModule,MatButtonModule,MatSelectModule,MapLocationComponent,
    MatInputModule,MatFormFieldModule,MatSelectModule,Package2DeliveryComponent, ReactiveFormsModule,MatProgressSpinner,MatAutocompleteModule
  ],
  templateUrl: './delivery.component.html',
  styleUrl: './delivery.component.css'
})
export class DeliveryComponent extends Package2DeliveryComponent{
  delivery : Delivery = null;
  packages : Array<Package> = [];
  location : Location = null;
  readonly packagesFiltersFields : string [] = ["description","from_name","from_address","to_name","to_address","package_id"]; 
  readonly packagesFiltersFieldsText : string = this.packagesFiltersFields.join(", ");
  filteredPackages : Array<Package> = [];
  packageFilterText : string = "";
  readonly statutes : string [] = ['open','picked-up','in-transit','delivered','failed'];
  
  onLocationPlaceChange (r:PlaceChangeResult) : void {
      this.location = r.location;
  }
  doFilterPackages(){
    if(!this.packageFilterText){
      this.filteredPackages = this.packages;
      return;
    }  
    const text = String(this.packageFilterText).toLowerCase();
    this.filteredPackages = this.packages.filter((p)=>{
      for(let i in this.packagesFiltersFields){
        if(String(p[this.packagesFiltersFields[i]]).toLowerCase().includes(text)) return true;
      }
      return false;
    });
  }
  fetchPackages(){
    getPackages().then((packages)=>{
      this.packages = packages;
      this.doFilterPackages();
    });
  }
  override beforeUpsert(data : Delivery){
      data.location = this.location;
      [ "pickup_time","start_time","end_time"].map(d=>{
        if(data[d]){
          data[d] = toMySQLDate(data[d]);
        }
      });
      return data;
  }
  
  ngOnInit(): void {
      super.ngOnInit();
      this.onLocationPlaceChange = this.onLocationPlaceChange.bind(this);
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
    this.location = this.delivery?.location;
    const packageIdFormControl : FormControl = new FormControl(this.delivery?.package_id || '', [Validators.required]);
    this.formGroup = new FormGroup({
      package_id : packageIdFormControl,
      address : new FormControl(this.delivery?.address, [Validators.required]),
      pickup_time : new FormControl(toLocaleDateString(this.delivery?.pickup_time), [Validators.required]),
      start_time : new FormControl(toLocaleDateString(this.delivery?.start_time), [Validators.required]),
      status : new FormControl(this.delivery?.status || 'open', [Validators.required]),
      end_time : new FormControl(toLocaleDateString(this?.delivery?.end_time),[])
    })
    packageIdFormControl.valueChanges
    .pipe(debounceTime(300)) //après chaque 0.3 seconde, on fera une requête afin de filtrer les données 
    .subscribe(value=>{
      this.packageFilterText = value;
      this.doFilterPackages();
    });
  }
}


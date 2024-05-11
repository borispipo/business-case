import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import BaseComponent from '$shared/components/base';
import { Package,Delivery } from '$shared/types';
import { getPackage,getDelivery,addPackage,updatePackage,addDelivery,updateDelivery} from '$shared/fetch';
import {ErrorStateMatcher} from '@angular/material/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import {ConfirmDialog} from "$stypes";

import {
  FormControl,
  FormGroupDirective,
  NgForm,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';


type T = Delivery | Package;

@Component({
  selector: 'app-package-delivery',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  template : `<div [class]='formClass'><ng-content></ng-content></div>`,
})
export class Package2DeliveryComponent  extends BaseComponent implements ErrorStateMatcher{
  data  : T = this.newInstance();
  formGroup : FormGroup;
  @Input() id ! : string;
  @Input() onUpsert ! :  (data) => void; //lorsqu'on upsert une données
  isUpdate : boolean = false;
  formClass : string  ="";
  isLoading : boolean = false;
  title : string = this.isDelivery()? "Add Delivery" : "Add Package";
  errorStateMatcher : ErrorStateMatcher = null;
  protected setData(data : T){
    this.data = data;
  }
  protected isDelivery(){
    return false;
  }
  protected addNew(data:T): Promise<T>{
     return this.isDelivery() ? addDelivery(data) : addPackage(data);
  }
  protected update(data : T) : Promise<any> {
    return this.isUpdate && this.id ? (this.isDelivery() ? updateDelivery(this.id,data) : updatePackage(this.id,data)) : Promise.reject({
        message : `Could not update data, because id ${this.id} is invalid`
    });
  }
  protected upsert(data : T) : Promise<any>{
    return (this.isUpdate && this.id ? this.update : this.addNew).bind(this)(data).then((r)=>{
      if(typeof this.onUpsert =="function"){
        this.onUpsert(r);
      }
      return r;
    })
  }
  protected newInstance() : T{
    return null;
  }
  ngOnInit(): void {
    this.isUpdate = false;
    this.errorStateMatcher = this;
    this.formClass = this.isDelivery()? "form-delivery" : "form-package";
    if(this.id){
        this.isLoading = true;
        (this.isDelivery()? getDelivery : getPackage)(this.id).then((p)=>{
          if(p){
            this.setData(p);
            this.isUpdate = true;
            this.title = `Edit ${this.isDelivery()? "Delivery":"Package"} [${this.id}]`;
          }
        }).finally(()=>{
          this.isLoading = false;
        });
    } else {
      this.isUpdate = false;
      this.title = `Add New `+(this.isDelivery()? "Delivery":"Package");
      this.setData(this.newInstance());
      this.id = undefined;
      this.isLoading = false;
    }
  }
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    const error = !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    return error;
  }
  saveForm(form: FormGroup = null) {
    if(!this.formGroup || !this.formGroup?.valid) return;
    this.isLoading = true;
    this.upsert(this.formGroup.value).finally(()=>{
      this.isLoading = false;
    });
  }
  getField (fieldName : string) : AbstractControl{
    if(typeof fieldName !="string" || !fieldName || !this.formGroup || !this.formGroup.get(fieldName)) return null;
    return this.formGroup.get(fieldName);
  }
  isFormValid(){
    return !!this.formGroup?.valid;
  }
  isFieldValid(fieldName : string){
    const field = this.getField(fieldName);
    if(!field) return false;
    return !((field.touched || field.dirty) && field.invalid);
  }
}
import { Component, Input, OnInit } from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Package2DeliveryComponent } from '../package2Delivery';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Package } from '$shared/types';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-package',
  standalone: true,
  imports: [CommonModule,MatDialogModule,MatButtonModule,
    MatInputModule,MatFormFieldModule,MatSelectModule,Package2DeliveryComponent, ReactiveFormsModule,MatProgressSpinner
  ],
  templateUrl: './package.component.html',
  styleUrl: './package.component.css'
})
export class PackageComponent extends Package2DeliveryComponent{
  descriptionControl : FormControl;
  weightControl : any;
  package : Package = null;
  fromNameControl : FormControl;
  toNameControl : FormControl;
  fromAddressControl : FormControl;
  toAddressControl : FormControl;
  protected override setData(data : Package){
    this.package = data;
    this.initFormGroup();
  }
  protected override isDelivery(): boolean {
    return false;
  }
  initFormGroup(){
    this.formGroup = new FormGroup({
      description : new FormControl(this.package?.description || '', [Validators.required]),
      from_name : new FormControl(this.package?.from_name || '', [Validators.required]),
      to_name : new FormControl(this.package?.to_name || '', [Validators.required]),
      from_address : new FormControl(this.package?.from_address || '', [Validators.required]),
      to_address : new FormControl(this.package?.to_address || '', [Validators.required]),
      weight : new FormControl(this?.package?.weight || 0,[]),
      height : new FormControl(this.package?.height|| 0,[]),
      depth : new FormControl(this.package?.depth|| 0,[]),
    })
  }
  ngOnInit(): void {
    super.ngOnInit();
    this.initFormGroup();
  }
}

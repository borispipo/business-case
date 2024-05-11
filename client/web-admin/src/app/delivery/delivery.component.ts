import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Package2DeliveryComponent } from '../package2Delivery';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { Delivery } from '$shared/types';

@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [
    CommonModule,MatFormFieldModule,MatInputModule,MatSelectModule,MatDialogModule,MatButtonModule
  ],
  templateUrl: './delivery.component.html',
  styleUrl: './delivery.component.css'
})
export class DeliveryComponent extends Package2DeliveryComponent{
  delivery : Delivery = null;
  protected isDelivery(): boolean {
    return true;
  }
  protected override setData(data : Delivery){
    this.delivery = data;
  }
}

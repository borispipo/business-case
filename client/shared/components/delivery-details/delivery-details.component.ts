import { MatDivider } from '@angular/material/divider';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListDetailsComponent} from '../list-detail/details.component';
import { Delivery } from '$shared/types';
import { Input } from '@angular/core';
import BaseComponent from '../base';
@Component({
  selector: 'delivery-details',
  standalone: true,
  imports: [CommonModule,ListDetailsComponent,MatDivider],
  templateUrl: './delivery-details.component.html',
  styleUrl: './delivery-details.component.css'
})

export class DeliveryDetailsComponent extends BaseComponent{
  @Input() delivery : Delivery = null;
  @Input() title : string = null; //title of delivery-details
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Input } from '@angular/core';
import BaseComponent from '../base';
import { Package } from '$shared/types';
import { ListDetailsComponent } from '../list-detail/details.component';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'package-details',
  standalone: true,
  imports: [CommonModule,ListDetailsComponent,MatDivider],
  templateUrl: './package-details.component.html',
  styleUrl: './package-details.component.css'
})
export class PackageDetailsComponent extends BaseComponent {
  @Input() package : Package;
  @Input() !title : string;
}

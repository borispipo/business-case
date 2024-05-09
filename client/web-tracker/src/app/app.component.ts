import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import Delivery from '$ctypes/Delivery';
import Package from "$ctypes/Package";
import { getPackage } from '$fetch';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';  
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,MatSlideToggleModule,MatButtonModule,MatInputModule,MatProgressSpinnerModule,CommonModule,MatProgressBarModule
    ,MatDividerModule,MatListModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  delivery : Delivery;
  package : Package;
  packageId : string;
  trackPackageError : string;
  isLoading : boolean;
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
          this.package = p as Package;
          this.trackPackageError  = this.package ? null : `Package with Id : [${this.packageId}] doesn't exist in database.`;
      }).catch((e)=>{
         this.trackPackageError = e?.message || e?.toString();
      }).finally(()=>{
        this.isLoading = false;
      });
    }
  }
}

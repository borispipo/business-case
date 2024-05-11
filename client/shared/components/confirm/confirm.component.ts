import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Input } from '@angular/core';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [CommonModule,MatDialogModule,MatButtonModule,],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.css'
})
export class ConfirmComponent {
  @Input() onSuccess! : ()=>void;
  @Input() onCancel ! : ()=>void;
  @Input() message ! :  string;
  @Input() title  ! : string;
  onNoClick(){
    if(this.onCancel){
      this.onCancel();
    }
  }
  onOkClick(){
    if(this.onSuccess){
      this.onSuccess();
    }
  }
}

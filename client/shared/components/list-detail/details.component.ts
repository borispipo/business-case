import { Component,Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'list-detail',
  standalone: true,
  imports: [CommonModule,MatDivider],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class ListDetailsComponent {
  @Input() label! : string; //le libele du détail
  @Input() value! : string | number | boolean | Array<any>; //le texte du détail
  @Input() containerClass! : string;
  @Input() divider ! : boolean;
  text : string;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.text = String(["string","number"].includes(typeof this.value)? this.value || "" : String(this.value));
  }
}

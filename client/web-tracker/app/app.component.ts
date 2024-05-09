import { Component } from '@angular/core';

@Component({
  selector: 'mean-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  note = 'Marma la maggggggggggg';

  public get currentDate() : number {
    return new Date().getFullYear();
  }
}

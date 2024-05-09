import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {environment} from "$environment";

console.log(environment," is environnement");

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Web tracker appp';
}

import { Component } from '@angular/core';
import {connect} from "./utils";
import BaseComponent from '../base';
@Component({
  selector: 'app-socket',
  standalone: true,
  imports: [],
  templateUrl: './socket.component.html',
  styleUrl: './socket.component.css'
})
export class SocketComponent extends BaseComponent{
  socket = null;
  ngAfterViewInit(): void {
    this.socket = connect();
    
  }
}

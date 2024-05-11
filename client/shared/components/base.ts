import {OnInit, Component } from '@angular/core';

@Component({
    selector: 'app-base',
    template: ``,
    styles: []
})

export default abstract class BaseComponent implements OnInit{
    ngOnInit(): void {}
}
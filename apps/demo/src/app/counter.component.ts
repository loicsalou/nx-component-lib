import { Component } from '@angular/core';

let instances = 0;

@Component({
  selector: 'zas-counter',
  template: '<h1>{{this.id}}</h1>'
})
export class CounterComponent {
  id: number;

  constructor() {
    this.id = ++instances;
  }
}

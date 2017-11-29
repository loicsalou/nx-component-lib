import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface Option {
  text: string;
}

export type Direction = 'horizontal' | 'vertical';

@Component({
  selector: 'zas-hover-menu',
  templateUrl: './hover-menu.component.html',
  styleUrls: ['./hover-menu.component.scss']
})
export class HoverMenuComponent {
  @Input() direction: Direction;

  @Input() options: Option[];

  @Output() action: EventEmitter<Option> = new EventEmitter();

  constructor() {}

  actionChosen(option: Option): void {
    this.action.emit(option);
  }
}

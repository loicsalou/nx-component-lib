import { Component, ContentChild, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'zas-wrapper-template',
  template: `
               <button (click)="show = !show">
                 {{ show ? 'Hide' : 'Show' }}
               </button>
               <div class="box" *ngIf="show">
                 <ng-container *ngTemplateOutlet="template; context: myContext"></ng-container>
               </div>
             `
})
export class WrapperTemplateComponent implements OnInit {
  show = true;
  @ContentChild(TemplateRef) template: TemplateRef<any>;

  myContext = { $implicit: { row: { col1: 'colonne 1', col2: 'colonne 2', col3: 'colonne 3' }, col: 'col1' } };

  constructor() {}

  get col() {
    return this.myContext.$implicit.col;
  }

  get row() {
    return this.myContext.$implicit.row;
  }

  ngOnInit() {}
}

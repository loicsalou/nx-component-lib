import {Component, Input, OnInit} from '@angular/core';

@Component({
             selector: 'zas-specific-cell',
             template: `
               <div *ngIf="col===for">
                 <a [href]="row[col].url">{{row[col].label}}</a>
               </div>
             `
           })
export class SpecificCellComponent implements OnInit {
  @Input() for: string;
  @Input() context;

  row: any;
  col: string;

  constructor() {
  }

  ngOnInit() {
    if (this.context) {
      this.row = this.context.row;
      this.col = this.context.col;
    }
  }
}

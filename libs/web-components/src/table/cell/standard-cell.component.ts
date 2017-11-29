import {Component, Input, OnInit} from '@angular/core';
import {Column} from '../table-model/table-column';

@Component({
             selector: 'zas-standard-cell',
             templateUrl: './standard-cell.component.html',
             styleUrls: [ './standard-cell.component.scss' ]
           })
export class StandardCellComponent implements OnInit {
  @Input() row;
  @Input() col: Column;

  type: string;

  constructor() {
  }

  ngOnInit() {
    if (this.row && this.col && this.row[ this.col.field ] && this.row[ this.col.field ].constructor) {
      this.type = this.row[ this.col.field ].constructor.name.toLowerCase();
    } else {
      this.type = typeof this.row[ this.col.field ];
    }
  }

  columnType(col: string): string {
    return this.type;
  }
}

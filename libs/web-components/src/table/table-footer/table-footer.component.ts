import {Component, Input, OnInit} from '@angular/core';
import {TableModelHandler} from '../table-model/tablemodel-handler';

@Component({
             selector: 'zas-table-footer',
             templateUrl: './table-footer.component.html',
             styleUrls: [ './table-footer.component.scss' ]
           })
export class TableFooterComponent<T> implements OnInit {
  @Input() tableModel: TableModelHandler<T>;

  constructor() {
  }

  ngOnInit() {
  }
}

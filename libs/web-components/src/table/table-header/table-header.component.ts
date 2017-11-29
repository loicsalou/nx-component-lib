import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {TableModelHandler} from '../table-model/tablemodel-handler';
import {DataTable} from 'primeng/primeng';

@Component({
             selector: 'zas-table-header',
             templateUrl: './table-header.component.html',
             styleUrls: [ './table-header.component.scss' ]
           })
export class TableHeaderComponent<T> implements OnInit, AfterViewInit {
  @Input() tableModel: TableModelHandler<T>;

  @Input() table: DataTable;
  selectedItemsLabel = '{0} sélectionnés';
  @ViewChild('globalFilter') private globalFilter: ElementRef;

  constructor() {
  }

  ngOnInit() {
  }

  // on rattache le filtre à la table
  ngAfterViewInit(): void {
    this.table.globalFilter = this.globalFilter.nativeElement;
  }
}

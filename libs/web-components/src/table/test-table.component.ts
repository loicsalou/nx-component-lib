import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DataTable} from 'primeng/primeng';
import {Column, TableModelHandler} from './index';
import {LocalPreferencesManagerService} from '../shared';

export class Link {
  url: string;
  label: string;

  constructor(url: string, label: string) {
    this.url = url;
    this.label = label;
  }

  toString() {
    return this.label;
  }
}

export interface Bottle {
  aoc: string;
  color: string;
  vintage: number;
  ready: boolean;
  link: Link;
  date: string;
  toto: string;
}

@Component({
             template: `
               <p-dataTable #zasTable *ngIf="bottlesModel" [alwaysShowPaginator]="false" [rowHover]="true"
                            [value]="bottlesModel.data" resizableColumns="true" reorderableColumns="true"
                            (onColResize)="bottlesModel.colResize($event)"
                            [rows]="10" [paginator]="bottlesModel.paginatorDisplayed"
                            [rowsPerPageOptions]="[10,15,20,50]"
                            (onColReorder)="bottlesModel.colReordered($event)"
                            (onSort)="bottlesModel.sorted($event)" [sortField]="bottlesModel.sortOptions?.field"
                            [sortOrder]="bottlesModel.sortOptions?.order"
                            rowGroupMode="subheader" [groupField]="bottlesModel.groupingColumn()"
                            expandableRowGroups="true"
                            [sortableRowGroup]="true">
                 <p-header>
                   <zas-table-header #zasHeader [tableModel]="bottlesModel" [table]="zasTable"></zas-table-header>
                 </p-header>

                 <ng-template pTemplate="rowgroupheader" let-rowData>
                   <span>{{bottlesModel.getGroupHeader(rowData, bottlesModel.groupingColumn())}}</span>
                 </ng-template>

                 <p-column *ngFor="let col of bottlesModel.visibleColumns" [field]="col.field"
                           header="{{col.label}}"
                           [sortable]="col.sortable" [style]="col.style">

                   <ng-template pTemplate="body" let-row="rowData">
                     <zas-standard-cell [col]="col" [row]="row">
                     </zas-standard-cell>
                   </ng-template>
                 </p-column>

                 <p-footer class="d-flex align-items-center">
                   <zas-table-footer [tableModel]="bottlesModel" class="ml-auto"></zas-table-footer>
                 </p-footer>
               </p-dataTable>
             `
           })
export class TestTableComponent implements OnInit, AfterViewInit {
  bottlesModel: TableModelHandler<Bottle>;
  data = [];
  @ViewChild(DataTable) private table;

  constructor(private preferencesService: LocalPreferencesManagerService) {
    const link1: Link = new Link('http://bordeaux.com', 'vins de Bordeaux');
    const link2: Link = new Link('http://bourgogne.com', 'vins de Bourgogne');
    const link3: Link = new Link('http://champagne.com', 'vins de Champagne');
    this.data = [
      {
        aoc: 'bordeaux',
        color: 'rouge',
        vintage: 2000,
        ready: true,
        link: link1,
        date: '2017-11-11',
        toto: 'toto' + ' cellule'
      },
      {
        aoc: 'bordeaux',
        color: 'rouge',
        vintage: 2005,
        ready: true,
        link: link1,
        date: '2017-11-11',
        toto: 'toto' + ' cellule'
      },
      {
        aoc: 'bordeaux',
        color: 'blanc',
        vintage: 2000,
        ready: true,
        link: link1,
        date: '2017-11-11',
        toto: 'toto' + ' cellule'
      },
      {
        aoc: 'bordeaux',
        color: 'liquoreux',
        vintage: 1997,
        ready: true,
        link: link1,
        date: '2017-11-11',
        toto: 'toto' + ' cellule'
      },
      {
        aoc: 'bourgogne',
        color: 'blanc',
        vintage: 2010,
        ready: false,
        link: link2,
        date: '2017-11-12',
        toto: 'toto' + ' cellule2'
      },
      {
        aoc: 'bourgogne',
        color: 'rouge',
        vintage: 2012,
        ready: false,
        link: link2,
        date: '2017-11-12',
        toto: 'toto' + ' cellule2'
      },
      {
        aoc: 'Champagne',
        color: 'effervescent',
        vintage: 2007,
        ready: true,
        link: link3,
        date: '2017-11-13',
        toto: 'toto' + ' cellule3'
      },
      {
        aoc: 'Champagne',
        color: 'effervescent rosé',
        vintage: 2007,
        ready: true,
        link: link3,
        date: '2017-11-13',
        toto: 'toto' + ' cellule3'
      },
      {
        aoc: 'Champagne',
        color: 'effervescent',
        vintage: 2007,
        ready: true,
        link: link3,
        date: '2017-11-13',
        toto: 'toto' + ' cellule3'
      }
    ];
  }

  ngOnInit(): void {
    this.initTable();
  }

  ngAfterViewInit(): void {
    this.bottlesModel.setDatatable(this.table);
  }

  initTable() {
    const cols: Column[] = [
      {field: 'aoc', label: 'Appellation'},
      {field: 'vintage', label: 'Millésime'},
      {field: 'color', label: 'Couleur'},
      {field: 'ready', label: 'Prête'},
      {field: 'link', label: 'Lien'},
      {field: 'date', label: 'Date'},
      {field: 'toto', label: 'Toto'}
    ];
    this.bottlesModel = new TableModelHandler('ma-table', cols, this.preferencesService, true);
    this.bottlesModel.setData(this.data);
  }
}

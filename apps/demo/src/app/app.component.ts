import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Option} from './hover-menu/hover-menu.component';
import {DataTable, OverlayPanel} from 'primeng/primeng';
import {Column, LocalPreferencesManagerService, TableModelHandler} from '@nx-component-lib/web-components';

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
             selector: 'zas-root',
             templateUrl: './app.component.html',
             styleUrls: [ './app.component.scss' ]
           })
export class AppComponent implements OnInit, AfterViewInit {
  page = 1;
  selectedItemsLabel = '{0} sélectionnés';
  // ABLE
  bottlesModel: TableModelHandler<Bottle>;
  currentRow: any;
  currentField: string;
  // ContentChild(TemplateRef) specific: TemplateRef<any>;
  @ViewChild(DataTable) private table;
  private data: Bottle[];

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

  openOverlay(event, opanel: OverlayPanel, row, field: string) {
    this.currentRow = row;
    this.currentField = field;
    opanel.toggle(event);
  }

  closeOverlay(event, opanel: OverlayPanel) {
    opanel.hide();
  }

  getVisibleColumns() {
    return this.bottlesModel.visibleColumns;
  }

  ngOnInit(): void {
    this.initTable();
  }

  ngAfterViewInit(): void {
    this.bottlesModel.setDatatable(this.table);
  }

  swiped(sense: number) {
    this.page += sense;
    if (this.page < 1) {
      this.page = 4;
    } else if (this.page > 4) {
      this.page = 1;
    }
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

  menuTriggered(option: Option) {
  }
}

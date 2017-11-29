import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TestStandardCellComponent} from './cell/standard-cell.component.spec';
import {TestTableComponent} from './test-table.component';
import {DataTableModule, MultiSelectModule} from 'primeng/primeng';
import {NavsModule} from '../navs';
import {SwiperModule} from '../swiper';
import {TableModule} from '../table';
import {PreferencesManagerModule} from '../shared';

@NgModule({
            imports: [
              CommonModule,
              NavsModule,
              SwiperModule,
              TableModule,
              DataTableModule,
              MultiSelectModule,
              PreferencesManagerModule
            ],
            declarations: [ TestStandardCellComponent, TestTableComponent ]
          })
export class TestModule {
}

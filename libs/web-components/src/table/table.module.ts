import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonModule, DataTableModule, MultiSelectModule, TooltipModule} from 'primeng/primeng';
import {StandardCellComponent} from './cell/standard-cell.component';
import {SpecificCellComponent} from './cell/specific-cell.component';
import {TableHeaderComponent} from './table-header/table-header.component';
import {FormsModule} from '@angular/forms';
import {TableFooterComponent} from './table-footer/table-footer.component';

@NgModule({
            imports: [ CommonModule, FormsModule, DataTableModule, MultiSelectModule, TooltipModule, ButtonModule ],
            declarations: [ TableHeaderComponent, TableFooterComponent, StandardCellComponent, SpecificCellComponent ],
            exports: [ TableHeaderComponent, TableFooterComponent, StandardCellComponent, SpecificCellComponent ]
          })
export class TableModule {
}

export * from './cell/cells';
export * from './table-model/table-model';
export * from './table-footer/table-footer';
export * from './table-header/table-header';

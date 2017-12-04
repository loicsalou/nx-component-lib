import {BrowserModule} from '@angular/platform-browser';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';

import {AppComponent} from './app.component';
import {SharedModule, SwiperModule, TableModule} from '@nx-component-lib/web-components';
import {DataTableModule, MultiSelectModule, OverlayPanelModule, TooltipModule} from 'primeng/primeng';
import {WrapperComponent} from './wrapper/wrapper.component';
import {CounterComponent} from './counter.component';
import {WrapperTemplateComponent} from './wrapper-template/wrapper-template.component';
import {FormsModule} from '@angular/forms';
import {HoverMenuComponent} from './hover-menu/hover-menu.component';
import {NxModule} from '@nrwl/nx';

@NgModule({
            declarations: [ AppComponent, CounterComponent, WrapperComponent, WrapperTemplateComponent, HoverMenuComponent ],
            imports: [
              BrowserModule,
              NxModule.forRoot(),
              FormsModule,
              SwiperModule,
              OverlayPanelModule,
              TableModule,
              SharedModule,
              MultiSelectModule,
              TooltipModule,
              DataTableModule
            ],
            providers: [],
            schemas: [ NO_ERRORS_SCHEMA ],
            bootstrap: [ AppComponent ]
          })
export class AppModule {
}

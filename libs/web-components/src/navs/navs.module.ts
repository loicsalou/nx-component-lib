import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavsService} from './navs.service';
import {NavsInputDirective} from './navs-input.directive';
import {NavsTextDirective} from './navs-text.directive';
import {ZasCommonModule} from '../shared';

@NgModule({
            imports: [ CommonModule, ZasCommonModule ],
            declarations: [ NavsInputDirective, NavsTextDirective ],
            providers: [ NavsService ],
            exports: [ NavsInputDirective, NavsTextDirective ]
          })
export class NavsModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: NavsModule,
      providers: [ NavsService ]
    };
  }
}

export * from './navs-input.directive';
export * from './navs.service';
export * from './navs';

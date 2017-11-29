/**
 * Created by U80830793 on 29.12.2016.
 */
import {NgModule} from '@angular/core';
import {RouterLinkStubDirective, RouterOutletStubComponent} from './router-stubs';

@NgModule({
            declarations: [ RouterLinkStubDirective,
              RouterOutletStubComponent
            ],
            exports: [ RouterLinkStubDirective,
              RouterOutletStubComponent
            ]
          })
export class TestingHelpersModule {
}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SwiperComponent} from './swiper.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
            imports: [ CommonModule, BrowserAnimationsModule ],
            declarations: [ SwiperComponent ],
            exports: [ SwiperComponent ]
          })
export class SwiperModule {
}

export * from './swiper.component';

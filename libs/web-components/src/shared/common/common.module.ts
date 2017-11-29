import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LibraryComponent} from './ngp-library.component';

@NgModule({
            imports: [
              CommonModule
            ],
            declarations: [ LibraryComponent ],
            exports: [ LibraryComponent ],
            providers: []
          })
export class ZasCommonModule {
}

export {Message} from './message';
export {LibraryComponent} from './ngp-library.component';
export {MessageLevel} from './abstract-message';

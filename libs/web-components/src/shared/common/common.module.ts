import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

@NgModule({
            imports: [ CommonModule ],
            declarations: [],
            providers: []
          })
export class ZasCommonModule {
}

export {Message} from './message';
export {I18nMessage} from './i18n-message';
export {MessageLevel} from './abstract-message';

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ZasCommonModule} from './common/common.module';
import {PreferencesManagerModule} from './preferences/preferences-manager.module';
import {LocalPreferencesManagerService} from './preferences/local-preferences-manager.service';
import {HttpPreferencesManagerService} from './preferences/http-preferences-manager.service';

@NgModule({
            imports: [ CommonModule, ZasCommonModule, PreferencesManagerModule ],
            providers: [ LocalPreferencesManagerService, HttpPreferencesManagerService ]
          })
export class SharedModule {
}

export * from './preferences/preferences-manager.module';
export * from './common/common.module';

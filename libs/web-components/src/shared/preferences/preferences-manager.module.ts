import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LocalPreferencesManagerService} from './local-preferences-manager.service';
import {HttpPreferencesManagerService} from './http-preferences-manager.service';

@NgModule({
            imports: [ CommonModule ],
            declarations: [],
            providers: [ LocalPreferencesManagerService, HttpPreferencesManagerService ],
            exports: []
          })
export class PreferencesManagerModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: PreferencesManagerModule,
      providers: [ LocalPreferencesManagerService, HttpPreferencesManagerService ]
    };
  }
}

export * from './local-preferences-manager.service';
export * from './http-preferences-manager.service';
export * from './preferences-manager.service';
export * from './mock-preferences-manager.service';

import {inject, TestBed} from '@angular/core/testing';

import {PreferencesManagerService} from './preferences-manager.service';
import {LocalPreferencesManagerService} from './local-preferences-manager.service';

describe('PreferencesManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
                                     providers: [ LocalPreferencesManagerService ]
                                   });
  });

  it(
    'should be created',
    inject([ LocalPreferencesManagerService ], (service: PreferencesManagerService) => {
      expect(service).toBeTruthy();
    })
  );
});

import {inject, TestBed} from '@angular/core/testing';

import {LocalPreferencesManagerService} from './local-preferences-manager.service';

describe('LocalPreferencesManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
                                     providers: [ LocalPreferencesManagerService ]
                                   });
  });

  it(
    'should be created',
    inject([ LocalPreferencesManagerService ], (service: LocalPreferencesManagerService) => {
      expect(service).toBeTruthy();
    })
  );
});

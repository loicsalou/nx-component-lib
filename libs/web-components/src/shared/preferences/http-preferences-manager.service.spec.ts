import {inject, TestBed} from '@angular/core/testing';

import {HttpPreferencesManagerService} from './http-preferences-manager.service';

describe('HttpPreferencesManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
                                     providers: [ HttpPreferencesManagerService ]
                                   });
  });

  it(
    'should be created',
    inject([ HttpPreferencesManagerService ], (service: HttpPreferencesManagerService) => {
      expect(service).toBeTruthy();
    })
  );
});

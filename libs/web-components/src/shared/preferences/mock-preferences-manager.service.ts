import {Injectable} from '@angular/core';

@Injectable()
export class MockPreferencesManagerService {
  constructor() {
  }

  savePrefs(prefsId: string, serializable: any): void {
  }

  restorePrefs(prefsId: string): any {
    return undefined;
  }

  resetPrefs(prefsId: string): void {
  }
}

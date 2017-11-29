import {Injectable} from '@angular/core';

@Injectable()
export class LocalPreferencesManagerService {
  constructor() {
  }

  savePrefs(prefsId: string, serializable: any): void {
    localStorage.setItem(prefsId, JSON.stringify(serializable));
  }

  restorePrefs(prefsId: string): any {
    const restored = localStorage.getItem(prefsId);
    return restored ? JSON.parse(restored) : restored;
  }

  resetPrefs(prefsId: string): void {
    if (prefsId) {
      localStorage.removeItem(prefsId);
    }
  }
}

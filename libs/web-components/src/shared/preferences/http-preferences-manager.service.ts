import {Injectable} from '@angular/core';

@Injectable()
export class HttpPreferencesManagerService {
  constructor() {
  }

  savePrefs(prefs: any, serializable: any): void {
    throw new Error('La sauvegarde des préférences via Http n\'est pas encore implémentée');
  }

  restorePrefs(prefsId: string): any {
    throw new Error('Le restore des préférences via Http n\'est pas encore implémenté');
  }

  resetPrefs(prefsId: string): void {
    throw new Error('Le reset des préférences via Http n\'est pas encore implémenté');
  }
}

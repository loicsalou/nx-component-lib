export interface PreferencesManagerService {
  savePrefs(prefsId: string, prefs: any): void;

  restorePrefs(prefsId: string): any;

  resetPrefs(prefsId: string): void;
}

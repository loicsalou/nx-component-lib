/**
 * Created by U80830793 on 24.05.2016.
 */
import {Injectable} from '@angular/core';
import * as barcoder from 'barcoder';
import * as checkdigit from 'checkdigit';

export enum NavsValidityStatus {
  Valid,
  WrongSize,
  InvalidEan,
  RegexFailed
}

/**
 * Service de validation et de formatage d'un NAVS.
 * Validation de la validité, formatage, déformatage, reformatage.
 *  - Pour les NAVS formatés on accepte les caractères ' . et ' ' (blanc) comme séparateurs
 *  - Pour le formatage on ne formate pas un navs incorrect, il est retourné tel quel
 *  - un navs déjà formaté est systématiquement reformaté avec le séparateur . (point) sauf si il est invalide
 */
@Injectable()
export class NavsService {
  private NAVS_NON_FORMATTED_REGEX: RegExp = new RegExp('^((756\\d{10})|(\\d{11}))$');
  private NAVS13_NON_FORMATTED_REGEX: RegExp = new RegExp('^756\\d{10}$');
  private NAVS11_NON_FORMATTED_REGEX: RegExp = new RegExp('^\\d{11}$');

  // vérifie qu'une chaine est formatée comme un NAVS. Aucune vérification de validité
  // 3 formats de séparateur sont supportés: point, guillement simple et espace.
  // Ni un mix ni un autre séparateur n'est accepté.
  // Exemple: 756.0000.0000.19, 756'0000'0000'19, 756 0000 0000 19
  private NAVS13_FORMATTED_REGEX1: RegExp = new RegExp('(\\d{3})\'(\\d{4})\'(\\d{4})\'(\\d{2})');
  private NAVS13_FORMATTED_REGEX2: RegExp = new RegExp('(\\d{3})\\.(\\d{4})\\.(\\d{4})\\.(\\d{2})');
  private NAVS13_FORMATTED_REGEX3: RegExp = new RegExp('(\\d{3}) (\\d{4}) (\\d{4}) (\\d{2})');
  private NAVS11_FORMATTED_REGEX1: RegExp = new RegExp('(\\d{3})\'(\\d{2})\'(\\d{3})\'(\\d{3})');
  private NAVS11_FORMATTED_REGEX2: RegExp = new RegExp('(\\d{3})\\.(\\d{2})\\.(\\d{3})\\.(\\d{3})');
  private NAVS11_FORMATTED_REGEX3: RegExp = new RegExp('(\\d{3}) (\\d{2}) (\\d{3}) (\\d{3})');

  // Permet de splitter une chaine pour la formater comme un NAVS doit l'être.
  private NAVS13_FORMATTING_REGEX: RegExp = new RegExp('(\\d{3})(\\d{4})(\\d{4})(\\d{2})');
  private NAVS11_FORMATTING_REGEX: RegExp = new RegExp('(\\d{3})(\\d{2})(\\d{3})(\\d{3})');

  /**
   * Vérifie si le NAVS passé en paramètre est valide ou non.
   * Il peut être passé formaté ou pas.
   * On contrôle la longueur, le chiffre clé et qu'il commence par 756.
   * @param navs
   * @returns un status indiquant la validité ou la raison de l'invalidité
   */
  getNavsValidityStatus(navs: string): NavsValidityStatus {
    if (this.isNavsFormatted(navs)) {
      navs = this.unformatNavs(navs);
    }
    if (navs.length !== 13 && navs.length !== 11) {
      return NavsValidityStatus.WrongSize;
    } else if (!this.NAVS_NON_FORMATTED_REGEX.test(navs)) {
      return NavsValidityStatus.RegexFailed;
    } else if (!this.checkKeyNumber(navs)) {
      return NavsValidityStatus.InvalidEan;
    }
    return NavsValidityStatus.Valid;
  }

  checkKeyNumber(navs: string): boolean {
    if (this.NAVS13_NON_FORMATTED_REGEX.test(navs)) {
      // et barcoder = require('barcoder');
      return barcoder.validate(navs);
    } else {
      return checkdigit.mod11.isValid(navs);
    }
  }

  /**
   * Vérifie si le NAVS est déjà formaté ou pas.
   * On accepte les 3 caractères de séparation ' (simple quote), ' ' (espace)
   * @param navs
   * @returns {boolean}
   */
  isNavsFormatted(navs: string): boolean {
    if (this.NAVS13_FORMATTED_REGEX1.test(navs)) {
      return true;
    } else if (this.NAVS13_FORMATTED_REGEX2.test(navs)) {
      return true;
    } else if (this.NAVS13_FORMATTED_REGEX3.test(navs)) {
      return true;
    } else if (this.NAVS11_FORMATTED_REGEX1.test(navs)) {
      return true;
    } else if (this.NAVS11_FORMATTED_REGEX2.test(navs)) {
      return true;
    } else if (this.NAVS11_FORMATTED_REGEX3.test(navs)) {
      return true;
    }

    return false;
  }

  /**
   * S'il est valide, formate le NAVS, pour qu'il soit présentable à l'affichage. Sinon il est retourné tel quel.
   * Le formatage standard s'appuie sur le séparateur '.' (le point).
   * Vérifie la validité avant formatage.
   * @param navs
   * @returns {string}
   */
  formatNavs(navs: string): string {
    // invalide, on ne touche pas
    if (this.getNavsValidityStatus(navs) !== NavsValidityStatus.Valid) {
      return navs;
    }

    // Si déjà formaté, on reformate quand même pour que tous les navs aient '.' comme séparateur
    if (this.isNavsFormatted(navs)) {
      navs = this.unformatNavs(navs);
    }

    let NAVS_FORMATTING_REGEX;
    if (this.NAVS13_NON_FORMATTED_REGEX.test(navs)) {
      NAVS_FORMATTING_REGEX = this.NAVS13_FORMATTING_REGEX;
    } else {
      NAVS_FORMATTING_REGEX = this.NAVS11_FORMATTING_REGEX;
    }

    // on formate et on renvoie
    return navs
      .trim()
      .split(NAVS_FORMATTING_REGEX)
      .filter(function (value: any) {
        if (isNaN(value) || value.length < 1) {
          return false;
        } else {
          return true;
        }
      })
      .join('.');
  }

  /**
   * déformate un NAVS formaté, ne touche pas un NAVS non formaté.
   * @param navs
   * @returns {string}
   */
  unformatNavs(navs: string): string {
    return navs.trim().replace(/[\.| | \']/g, '');
  }
}

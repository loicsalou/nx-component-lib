import {AbstractMessage, MessageLevel} from './abstract-message';

/**
 * Created by U80830793 on 09.09.2016.
 *
 * Cette classe décrit un message générique destiné à transmettre une information à l'utilisateur final.
 * Elle offre un titre, un texte dans la langue de l'utilisateur final, des datas éventuelles et un niveau d'importance.
 * L'idée est la suivante:
 * # un tel message sera affiché et présenté en fonction de sa gravité
 * # l'attribut 'text' contient un texte déjà traduit dans la langue de l'utilisateur final
 * # les datas fournies permettent de compléter le message
 * # le titre est un très court résumé du message puovant être utilisé par ex comme titre de popup
 */
export class I18nMessage extends AbstractMessage {
  public text: string; // ither text or text in i18n files

  constructor(level: MessageLevel, text: string, title?: string, data?: string[]) {
    super(level, title, data);
    this.text = text;
  }

  public toString(): string {
    return this.level + ' - ' + this.title + ' - ' + this.text + ' - ' + this.data;
  }
}

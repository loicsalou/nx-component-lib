/**
 * Created by U80830793 on 02.01.2017.
 *
 * Cette classe décrit un message générique destiné à transmettre une information à l'utilisateur final.
 * Elle offre un titre, des datas éventuelles et un niveau d'importance.
 * L'idée est la suivante:
 * # un tel message sera affiché et présenté en fonction de sa gravité
 * # les datas fournies permettent de compléter le message
 * # le titre est un très court résumé du message puovant être utilisé par ex comme titre de popup
 */
export abstract class AbstractMessage {
  public level: MessageLevel;
  public title: string; // ither text or text in i18n files
  public data: string[]; // alues if any to fill message

  constructor(level: MessageLevel, title?: string, data?: string[]) {
    this.level = level;
    this.title = title;
    this.data = data;
  }

  public toString(): string {
    return this.level + ' - ' + this.title + ' - ' + ' - ' + this.data;
  }
}

export enum MessageLevel {
  Success,
  Error,
  Warning,
  Info
}

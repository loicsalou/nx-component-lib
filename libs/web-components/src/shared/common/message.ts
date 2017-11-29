import {AbstractMessage, MessageLevel} from './abstract-message';

/**
 * Created by U80830793 on 09.09.2016.
 *
 * Cette classe décrit un message générique destiné à transmettre une information textuelle à l'utilisateur final.
 * Elle est plutôt dédiée à l'utilisation dans une librairie, qui n'a pas à sa disposition les données (notamment la
 * locale) de l'utilisateur final afin de faire la traduction du message. Elle offre un titre, un texte, des datas
 * éventuelles et un niveau d'importance. L'idée est la suivante:
 * # un tel message sera affiché et présenté en fonction de sa gravité
 * # l'attribut 'key' est une chaine à utiliser comme clé d'accès à un fichier de traductions. Il indique la nature du
 * message mais n'est pas le message lui-même.
 * # les datas fournies permettent de compléter le message
 * # le titre est un très court résumé du message puovant être utilisé par ex comme titre de popup
 */
export class Message extends AbstractMessage {
  public key: string; // ither key or key in i18n files

  constructor(level: MessageLevel, key: string, title?: string, data?: string[]) {
    super(level, title, data);
    this.key = key;
  }

  public toString(): string {
    return this.level + ' - ' + this.title + ' - ' + this.key + ' - ' + this.data;
  }
}

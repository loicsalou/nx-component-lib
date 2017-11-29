import {ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NavsService, NavsValidityStatus} from './navs.service';
import {isNullOrUndefined} from 'util';
import {Message, MessageLevel} from '../shared';

/**
 * Created by U80830793 on 15.12.2016.
 * Les directives Navs gèrent le contrôle de validité, le formatage et le déformatage du Navs.
 * La saisie du navs peut être faite en mode formaté (756.0000.0000.02) ou pas (7560000000002).
 * l'Input de ces directives accepte la valeur du NAVS lorsqu'elle est connue.
 * Elles s'appuient sur un service commun et mettent à disposition du host les éventuelles informations liées aux
 * contrôles effectués au moyen de l'output 'onMessage'.
 * Elles gèrent également les classes standards des formulaires Angular, ng-valid et ng-invalid.
 */
export abstract class AbstractNavsDirective implements OnInit {
  /* tslint:disable: no-input-rename */
  @Input('zasNavs') navs: string;
  /* tslint:disable: no-output-rename */
  @Output('onMessage') message: EventEmitter<Message>;
  protected isValid = true;
  protected formattedNavs = '';
  private validityStatus: NavsValidityStatus;

  constructor(protected navsService: NavsService, protected el: ElementRef) {
    this.message = new EventEmitter<Message>();
  }

  ngOnInit(): void {
    if (this.navs) {
      this.setNavsValue(this.navs);
      this.checkField();
    }
  }

  /**
   * selon le tag on récupère la valeur du navs dans tel ou tel attribut
   */
  protected abstract getNavsValue();

  /**
   * selon le tag on affecte la valeur du navs dans tel ou tel attribut
   */
  protected abstract setNavsValue(navs: string);

  protected setNavsInvalid() {
    this.formattedNavs = '';
    this.el.nativeElement.classList.add('ng-invalid');
    this.el.nativeElement.classList.remove('ng-valid');
  }

  /**
   * Vérification du contenu du NAVS.
   * Emet en retour un message <code>Message</code> ayant vocation à être interprété pour l'affichage d'un
   * message destiné à l'utilisateur quant à la validité du NAVS.
   * <ul>
   * <li>'navs-correct', niveau success, confirme la validité du NAVS</li>
   * <li>'navs-incorrect', niveau error, indique que le NAVS est invalide</li>
   * </ul>
   * @param event
   */
  protected checkField(event?: any) {
    const rawNavs = this.getNavsValue();
    if (isNullOrUndefined(rawNavs) || rawNavs.length === 0) {
      this.formattedNavs = '';
      this.setNavsValid();
      return;
    }
    this.validityStatus = this.navsService.getNavsValidityStatus(rawNavs);
    if (this.validityStatus === NavsValidityStatus.Valid) {
      this.isValid = true;
      this.formattedNavs = this.navsService.formatNavs(rawNavs);
    } else {
      this.isValid = false;
    }
    this.doReflectInGui();
    if (event) {
      event.preventDefault();
    }
  }

  /**
   * réinitialise les classes angular liées à la validité.
   */
  protected setNavsValid() {
    this.setNavsValue(this.formattedNavs);
    this.el.nativeElement.classList.add('ng-valid');
    this.el.nativeElement.classList.remove('ng-invalid');
  }

  protected doReflectInGui() {
    if (this.isValid) {
      this.setNavsValid();
    } else {
      this.setNavsInvalid();
    }
  }

  protected emitMessage() {
    if (this.isValid) {
      this.emitValid();
    } else {
      this.emitInvalid(this.validityStatus);
    }
  }

  private emitValid() {
    this.message.emit(new Message(MessageLevel.Success, 'navs-correct', 'success', [ this.formattedNavs ]));
  }

  private emitInvalid(validityStatus: NavsValidityStatus) {
    let msg: Message;
    switch (validityStatus) {
      case NavsValidityStatus.WrongSize:
        msg = new Message(MessageLevel.Error, 'navs-incorrect-wrong-size', 'error', [ this.formattedNavs ]);
        break;

      case NavsValidityStatus.InvalidEan:
        msg = new Message(MessageLevel.Error, 'navs-incorrect-ean', 'error', [ this.formattedNavs ]);
        break;

      case NavsValidityStatus.RegexFailed:
        msg = new Message(MessageLevel.Error, 'navs-incorrect-regex', 'error', [ this.formattedNavs ]);
        break;

      default:
        msg = new Message(MessageLevel.Error, 'navs-incorrect', 'error', [ this.formattedNavs ]);
        break;
    }
    this.message.emit(msg);
  }
}

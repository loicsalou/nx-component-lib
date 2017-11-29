import {Directive, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {NavsService} from './navs.service';
import {AbstractNavsDirective} from './abstract-navs.directive';
import {Navs} from './navs';

/**
 * Cette directive attache à un champ de type input les comportements associés à un NAVS
 * <ul>
 * <li>affichage: elle formate le Navs contenu pour qu'il soit présenté de façon standard. Si celui-ci est déjà formaté
 * elle ne fait rien</li>
 * <li>affichage: elle vérifie que la valeur est un Navs valide et se met en erreur si ce n'est pas le cas</li>
 * <li>saisie: une fois la saisie effectuée, le Navs est vérifié et formaté proprement et mis à disposition dans le
 * champ "formatedNavs"</li>
 * <li>si la saisie n'est pas correcte le champ passe en erreur</li>
 * </ul>
 */

@Directive({
             selector: 'input[zasNavs]'
           })
/*tslint:disable*/
export class NavsInputDirective extends AbstractNavsDirective {
  @Input() emitOnEnterOnly: boolean = true;

  // ain de focus
  @Output() private navsFocusIn: EventEmitter<boolean> = new EventEmitter();

  // erte de focus, validité du Navs saisi
  @Output() private navsFocusOut: EventEmitter<boolean> = new EventEmitter();

  @Output() private navsChanged: EventEmitter<Navs> = new EventEmitter();

  // alidation du Navs saisi, émis seulement si Navs valide
  @Output() private validated: EventEmitter<boolean> = new EventEmitter();

  private outputNavs: Navs;

  private NAVS_PATTERN = '756[0-9]{10}';
  private NAVS_PLACEHOLDER = '7560000000000';

  constructor(navsService: NavsService, el: ElementRef) {
    super(navsService, el);
    this.el.nativeElement.placeholder = this.NAVS_PLACEHOLDER;
    this.el.nativeElement.pattern = this.NAVS_PATTERN;
  }

  /**
   * le champ prend le focus et peut donc être modifié.
   * On remet le Navs au format de saisie, donc non formaté.
   * @param event
   */
  @HostListener('focusin')
  focusGained(_event?: any) {
    this.setNavsValue(this.navsService.unformatNavs(this.getNavsValue()));
    // if (this.getNavsValue()) {
    //   this.checkAndSetOutput(event, false);
    // }
  }

  /**
   * le champ perd le focus et ne peut donc plus être modifié.
   * On formate le Navs pour qu'il soit plus lisible à l'écran.
   * @param event
   */
  @HostListener('focusout')
  focuslost(event?: any) {
    this.checkAndSetOutput(event, false);
    this.navsFocusOut.emit(this.isValid);
  }

  /**
   * le champ a été modifié.
   * On formate le Navs pour qu'il soit plus lisible à l'écran.
   * @param event
   */
  @HostListener('change')
  changed(event?: any) {
    if (!this.emitOnEnterOnly) {
      this.checkAndSetOutput(event);
      this.navsChanged.emit(this.outputNavs);
      this.validated.emit(true);
    }
  }

  @HostListener('keyup.enter')
  keyEvent(event: KeyboardEvent) {
    this.checkAndSetOutput(event);
    this.navsChanged.emit(this.outputNavs);
    this.validated.emit(true);
  }

  /**
   * dans un <INPUT> on récupère le navs dans l'attribut value
   */
  protected getNavsValue() {
    return this.el.nativeElement.value;
  }

  /**
   * dans un <INPUT> on affecte le navs dans l'attribut value
   */
  protected setNavsValue(navs: string) {
    this.el.nativeElement.value = navs;
  }

  /**Vérifier la saisie et si demandé, émettre la Navs si valide, sinon undefined
   * @param {Event} event
   * @param {boolean} emit
   */
  private checkAndSetOutput(event?: Event, emit = true) {
    this.checkField(event);
    if (this.isValid) {
      this.outputNavs = {
        unformattedNavs: this.navsService.unformatNavs(this.formattedNavs),
        formattedNavs: this.formattedNavs
      };
    } else {
      this.outputNavs = undefined;
    }
    if (emit) {
      this.emitMessage();
    }
  }
}

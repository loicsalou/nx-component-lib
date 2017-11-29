import {Directive, ElementRef, OnInit} from '@angular/core';
import {NavsService} from './navs.service';
import {AbstractNavsDirective} from './abstract-navs.directive';

/**
 * Cette directive attache à un champ les comportements associés à un Navs
 * <li>affichage: elle vérifie que la valeur est un Navs valide et se met en erreur si ce n'est pas le cas</li>
 * <li>affichage: elle formate le Navs contenu pour qu'il soit présenté de façon standard. Si celui-ci est déjà formaté
 * elle ne fait rien</li>
 * <li>saisie: une fois la saisie effectuée, le Navs est vérifié et formaté proprement et mis à disposition dans le
 * champ "formatedNavs"</li>
 * <li>si la saisie n'est pas correcte le champ passe en erreur</li>
 */

@Directive({
             selector: ':not(input)[zasNavs]'
           })
export class NavsTextDirective extends AbstractNavsDirective implements OnInit {
  constructor(navsService: NavsService, el: ElementRef) {
    super(navsService, el);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.emitMessage();
  }

  /**
   * dans un <P> on récupère le navs dans l'attribut textContent
   */
  protected getNavsValue() {
    return this.el.nativeElement.textContent;
  }

  /**
   * dans un <P> on affecte le navs dans l'attribut textContent
   */
  protected setNavsValue(navs: string) {
    this.el.nativeElement.textContent = navs;
  }
}

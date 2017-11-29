/* tslint:disable */
// export for convenience.
export {ActivatedRoute, Router, RouterLink, RouterOutlet} from '@angular/router';

import {Component, Directive, Input} from '@angular/core';

/**
 * Mock object substituable au routerLink AngularX dans le cadre des tests unitaires.
 */
@Directive({
             selector: '[routerLink]',
             host: {
               '(click)': 'onClick()'
             }
           })
export class RouterLinkStubDirective {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  onClick() {
    this.navigatedTo = this.linkParams;
  }
}

/**
 * Component mock substituable au router-outlet AngularX dans le cadre des tests unitaires.
 */
@Component({selector: 'router-outlet', template: ''})
export class RouterOutletStubComponent {
}

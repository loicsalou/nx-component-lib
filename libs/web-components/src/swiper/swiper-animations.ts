import {animate, AnimationMetadata, state, style, transition, trigger} from '@angular/animations';

export const swipeAnimation: AnimationMetadata = trigger('transition', [
  state('in', style({transform: 'translateX(0)', opacity: '1'})),

  transition('void => *', [ style({opacity: '1'}), animate('300ms ease-in-out') ]),

  transition('* => left', [ style({transform: 'translateX(-100%)', opacity: '0'}), animate('300ms ease-in-out') ]),

  transition('* => right', [ style({transform: 'translateX(100%)', opacity: '0'}), animate('300ms ease-in-out') ])
]);

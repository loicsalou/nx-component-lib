import { Component } from '@angular/core';

@Component({
  selector: 'zas-wrapper',
  template: `
               <div class="box red">
                 <ng-content></ng-content>
               </div>
               <div class="box">
                 <ng-content select="counter"></ng-content>
               </div>
               <div class="box green">
                 <ng-content select="[green]"></ng-content>
               </div>
               <div class="box black">
                 <ng-content select="p.class-black"></ng-content>
               </div>
               <div class="box grey">
                 <ng-content select="h1.class-black"></ng-content>
               </div>
             `,
  styleUrls: ['./wrapper.component.scss']
})
export class WrapperComponent {}

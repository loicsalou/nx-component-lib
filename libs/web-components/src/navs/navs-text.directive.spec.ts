/* tslint:disable:no-unused-variable */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, NO_ERRORS_SCHEMA} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {Message} from '../shared';
import {NavsModule} from './navs.module';

@Component({
             selector: 'zas-test-directives',
             template: `
               <div>
                 <h3 class="hNavsok" [zasNavs]="7560000000019" (onMessage)="onMessage1($event)"></h3>
                 <p class="pNavsok" [zasNavs]="7560000000000" (onMessage)="onMessage2($event)"></p>
                 <div class="divNavsok" [zasNavs]="7560000000019" (onMessage)="onMessage3($event)"></div>
                 <span class="spanNavsko" [zasNavs]="7770000000019" (onMessage)="onMessage4($event)"></span>
               </div>
             `
           })
class TestComponent {
  onMessage1(message: Message) {
    message.toString();
  }

  onMessage2(message: Message) {
    message.toString();
  }

  onMessage3(message: Message) {
    message.toString();
  }

  onMessage4(message: Message) {
    message.toString();
  }
}

// returns the count of calls to a given component
export function callsTo(component) {
  return component.calls.count();
}

// returns the most recent call to a given component
export function mostRecentCallTo(component) {
  return component.calls.mostRecent();
}

/*tslint:disable no-console*/
describe('Directive: NavsTextDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
                                               imports: [ NavsModule, FormsModule ],
                                               declarations: [ TestComponent ],
                                               schemas: [ NO_ERRORS_SCHEMA ]
                                             }).createComponent(TestComponent);
    component = fixture.componentInstance;
    spyOn(component, 'onMessage1');
    spyOn(component, 'onMessage2');
    spyOn(component, 'onMessage3');
    spyOn(component, 'onMessage4');
    fixture.detectChanges();
  });

  // creation
  it('should create test component and 10 directives should call test component once', () => {
    component = fixture.componentInstance;
    // e composant de test doit être créé
    expect(component).toBeTruthy();
    expect(callsTo(component.onMessage1)).toEqual(1);
    expect(callsTo(component.onMessage2)).toEqual(1);
    expect(callsTo(component.onMessage3)).toEqual(1);
    expect(callsTo(component.onMessage4)).toEqual(1);
  });

  // CORRECT NON-INPUT: testing correct case
  it('<h> should contain correct formatted navs 756.0000.0000.19', () => {
    const debugEl = fixture.debugElement;
    const tag = debugEl.query(By.css('h3.hNavsok')).nativeElement;
    // a directive est censée mettre à jour la value du <h>.
    const val = tag.textContent;
    expect(val).toContain('756.0000.0000.19');
    expect(tag.classList).toContain('ng-valid');
  });
  it('<div> should contain correct formatted navs 756.0000.0000.19', () => {
    const debugEl = fixture.debugElement;
    const tag = debugEl.query(By.css('div.divNavsok')).nativeElement;
    // a directive est censée mettre à jour la value du <h>.
    const val = tag.textContent;
    expect(val).toContain('756.0000.0000.19');
    expect(tag.classList).toContain('ng-valid');
  });

  // INCORRECT NON-INPUTs: testing incorrect cases
  it('<p> should contain correct formatted navs 756.0000.0000.19', () => {
    const debugEl = fixture.debugElement;
    const tag = debugEl.query(By.css('p.pNavsok')).nativeElement;
    // a directive est censée mettre à jour la value du <h>.
    const val = tag.textContent;
    expect(val).toContain('7560000000000');
    expect(tag.classList).toContain('ng-invalid');
  });
  it('<span> should contain incorrect non formatted navs 7770000000019', () => {
    const debugEl = fixture.debugElement;
    const tag = debugEl.query(By.css('span.spanNavsko')).nativeElement;
    // a directive est censée mettre à jour la value du <h>.
    const val = tag.textContent;
    expect(val).toContain('7770000000019');
    expect(tag.classList).toContain('ng-invalid');
  });
});
